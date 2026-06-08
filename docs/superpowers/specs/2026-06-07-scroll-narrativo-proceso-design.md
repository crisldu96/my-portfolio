# Scroll narrativo — Sección "Mi proceso" (scrollytelling 3D anclado)

- **Fecha:** 2026-06-07
- **Autor:** Cristopher Palacios (con Claude Code)
- **Estado:** Diseño aprobado — pendiente de revisión final antes del plan de implementación
- **Stack:** Next.js 16 (App Router), React 19, MUI v9, TypeScript, GSAP + ScrollTrigger, Lenis, react-three-fiber / three

## 1. Objetivo

Añadir una sección narrativa "Mi proceso / cómo trabajo" a la landing single-page, que cuente en 5 pasos cómo trabajo, mediante **scrollytelling anclado** (pinned + scrub): una escena 3D a pantalla completa que se transforma mientras el contenido avanza paso a paso con el scroll. La sección se inserta **entre About y Experience**.

No es solo decorativo: el contenido refuerza E-E-A-T (metodología real) y debe ser plenamente legible y accesible incluso con animaciones desactivadas.

## 2. Decisiones tomadas (brainstorming)

| Tema | Decisión |
|---|---|
| Patrón | Scrollytelling con sección anclada (GSAP ScrollTrigger pin + scrub) |
| Contenido | "Mi proceso", 5 pasos: Descubrir → Diseñar → Construir → Probar → Desplegar |
| Ubicación | Nueva sección entre About y Experience (`id="proceso"`) |
| Layout | Pantalla completa cinemático, crossfade de pasos + puntos de progreso |
| Escena | 3D scrubbed reutilizando r3f; un objeto que se transforma por paso |
| Enfoque técnico | A — añadir solo `@gsap/react` (useGSAP); sin zustand |
| Móvil | Degradar: sin pin/scrub/3D → tarjetas apiladas + póster estático |
| Reduced-motion | Fallback estático siempre (mismo DOM que móvil) |
| Snap entre pasos | Desactivado (scroll libre); el crossfade marca los pasos |
| Póster móvil | Gradiente cosmic estático ahora; capturar frame 3D real queda como mejora futura |
| Item de nav "Proceso" | Incluido (ancla `#proceso`) por descubribilidad; reversible |

## 3. Hallazgo crítico previo (bug latente de todo el sitio)

`src/components/cosmic/LenisProvider.tsx` ejecuta su propio loop RAF y **no** llama a `ScrollTrigger.update()`. Con Lenis activo, ScrollTrigger lee la posición nativa de scroll (no la interpolada por Lenis), por lo que **cualquier pin/scrub se desincroniza** (lag visible, posible flicker del pin).

**Corrección requerida (base de toda la feature):** conducir Lenis desde el ticker único de GSAP y sincronizar ScrollTrigger.

```ts
// LenisProvider.tsx (rama no-reduced-motion)
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
const update = (time: number) => lenis.raf(time * 1000); // s -> ms
gsap.ticker.add(update);
gsap.ticker.lagSmoothing(0);
// cleanup: gsap.ticker.remove(update); lenis.destroy();
```

Eliminar el `requestAnimationFrame` propio de Lenis (un solo loop = el ticker de GSAP). Mantener la salida temprana actual con `prefers-reduced-motion: reduce` (Lenis no se inicializa). Tras montar Lenis + fuentes + Canvas, llamar `ScrollTrigger.refresh()` una vez para medir bien el pin.

## 4. Arquitectura de componentes

```
src/components/landing/HomeClient.tsx        (MOD: inserta la sección + dynamic import)
src/components/landing/ProcessSection.tsx    (NUEVO: DOM semántico + orquesta scrollytelling)
src/components/cosmic/ProcessBackground3D.tsx(NUEVO: Canvas r3f, reacciona al progreso)
src/hooks/useProcessScrollytelling.ts        (NUEVO: useGSAP + matchMedia + pin/scrub)
src/lib/scrollProgressStore.ts               (NUEVO: store de módulo, sin zustand)
src/components/cosmic/LenisProvider.tsx       (MOD: fix sync Lenis<->ScrollTrigger)
src/styles/cosmic.css                         (MOD: clases .process-*)
src/data/text-content-en.json                 (MOD: copys de los 5 pasos)
src/data/text-content-es.json                 (MOD: copys de los 5 pasos)
package.json                                   (MOD: + @gsap/react)
```

**Clasificación (reutilizable vs específico):**
- `ProcessSection`, `ProcessBackground3D` → **específicos de contexto** (flujo y copys propios; sin abstracción prematura).
- `useProcessScrollytelling`, `scrollProgressStore` → **reutilizables** (desacoplados del dominio "proceso"; parametrizables).

`ProcessBackground3D` no conoce el DOM ni los copys; solo lee progreso y dibuja. `ProcessSection` no conoce three.js; solo orquesta DOM, dots y aria.

### Inserción en HomeClient (entre About y Experience)

```tsx
const ProcessBackground3D = dynamic(
  () => import('@/components/cosmic/ProcessBackground3D'),
  { ssr: false }
);
// ...después del SectionWrapper de "about" (bg1):
<SectionDivider fromColor={cosmic.bg1} toColor={cosmic.bg0} height={24} /> {/* about(bg1) -> proceso(bg0) */}
<SectionWrapper id="proceso" sx={{ bgcolor: cosmic.bg0, position: 'relative', overflow: 'hidden' }}>
  <div className="cosmic-ambient" data-accent="violet" />
  <ProcessBackground3D />
  <div className="dotgrid" />
  <div className="section-content"><ProcessSection /></div>
</SectionWrapper>
<SectionDivider fromColor={cosmic.bg0} toColor={cosmic.bg0} height={24} /> {/* proceso(bg0) -> experience(bg0): plano */}
```

> **Coherencia de color:** Proceso usa `bg0` (como Experience). El divider que **originalmente** precedía a Experience era `bg1→bg0`; al insertar Proceso, ese divider se **reubica** delante de Proceso. Entre Proceso y Experience el divider va `bg0→bg0` para no introducir un "blip" a `bg1`. No cambiamos el `bgcolor` de Experience ni de las secciones siguientes (fuera de alcance).

## 5. Flujo de datos (progreso → escena, sin re-render de React)

```
scroll → Lenis → ScrollTrigger (onUpdate: self.progress)
   → scrollProgressStore.set(p)  → notifica a suscriptores → invalidate() del Canvas
ProcessBackground3D: useFrame lee store.get() y MUTA el objeto 3D (rotación/distorsión/color)
ProcessSection: onUpdate deriva activeStep = clamp(floor(p * 5), 0, 4)
   → setState SOLO cuando cambia el entero (≈5 veces) → dots + aria-current + aria-live
```

- `<Canvas frameloop="demand" dpr={[1, 2]}>`: el WebGL solo renderiza mientras hay scroll (cada `onUpdate` llama `invalidate()`).
- Progreso vía **ref de módulo**, nunca `useState`. `useFrame` muta objetos three directamente (cero reconciliación React).

### `scrollProgressStore` (contrato)

```ts
// p en [0,1]; listeners reciben invalidate() del Canvas
let p = 0;
const listeners = new Set<() => void>();
export const scrollProgress = {
  set(value: number) { p = value; listeners.forEach((fn) => fn()); },
  get() { return p; },
  subscribe(fn: () => void) { listeners.add(fn); return () => listeners.delete(fn); },
};
```

## 6. Mecánica de scroll y los 5 pasos

- Timeline con `ScrollTrigger`: `pin: true`, `pinSpacing: true`, `scrub: 1`, `anticipatePin: 1`, `invalidateOnRefresh: true`, `end: "+="+ Math.round(numSteps * 0.9 * window.innerHeight)`.
- 5 paneles de paso superpuestos (absolute) hacen crossfade por sub-rango de `p` (0–0.2, 0.2–0.4, …, 0.8–1.0) usando **solo `opacity`/`translateY`**.
- Una sola geometría 3D parametrizada (icosaedro + `MeshDistortMaterial` + points, estilo `AboutBackground3D`) cambia según `p`:

| Paso | Copy (clave i18n) | Transformación 3D | Acento |
|---|---|---|---|
| 1 Descubrir | `processSection.steps[0]` | partículas dispersas que convergen | cyan |
| 2 Diseñar | `processSection.steps[1]` | se ordenan en retícula/wireframe | blue |
| 3 Construir | `processSection.steps[2]` | la retícula se solidifica (icosaedro) | violet |
| 4 Probar | `processSection.steps[3]` | anillo de escaneo pulsa sobre el objeto | blue/cyan |
| 5 Desplegar | `processSection.steps[4]` | el objeto se expande/irradia hacia fuera | cyan→violet |

(El concepto 3D es ajustable en implementación; lo importante es: una geometría parametrizada y barata, no 5 escenas.)

## 7. Contenido (i18n)

Añadir a `text-content-en.json` y `text-content-es.json`:

```jsonc
"processSection": {
  "sectionLabel": "Mi proceso",          // EN: "My process"
  "title": "Cómo trabajo, paso a paso",  // EN: "How I work, step by step"
  "subtitle": "De la idea al despliegue: un método claro, probado y repetible.", // EN: "From idea to deployment: a clear, tested, repeatable method."
  "skipLabel": "Saltar animación e ir a la siguiente sección",
  "steps": [
    { "title": "Descubrir", "description": "Entiendo el problema, el usuario y las restricciones antes de escribir una línea de código." },
    { "title": "Diseñar",   "description": "Defino arquitectura, contratos y experiencia: separo lo reutilizable de lo específico del dominio." },
    { "title": "Construir", "description": "Implemento en incrementos pequeños y tipados, siguiendo las convenciones del proyecto." },
    { "title": "Probar",    "description": "Cubro con pruebas unitarias y E2E; valido accesibilidad y rendimiento, no solo el happy path." },
    { "title": "Desplegar", "description": "Despliego con CI en verde, monitoreo y feedback claro al usuario en cada estado." }
  ]
}
```

Acceso vía `useLanguage().handleTranslation('processSection.steps.0.title')` (lodash `_.get`). El método correcto es **`handleTranslation`** (verificado en `src/contexts/LanguageContext.tsx`; el `handleTraslation` del `CLAUDE.md` es un typo de la doc). Soporta genérico para arrays: `handleTranslation<{title:string;description:string}[]>('processSection.steps')`.

> **Reindexado:** las etiquetas numéricas de sección (`01`, `02`, …) están hardcoded por componente. Al insertar "Proceso" entre About (01) y Experience (02) hay que reindexar las posteriores (Experience→03, Skills→04, …). Tarea mecánica incluida en el plan.

> **Nav "Proceso":** los labels viven como `appBar.item1..item6` en `text-content-{en,es}.json` y se renderizan en `src/components/layout/AppBar.tsx`. Añadir el ancla `#proceso` implica una clave nueva (`appBar.itemX`) + su entrada en el menú, manteniendo el orden visual. Reversible.

## 8. Responsividad y reduced-motion (gate único)

Todo el scrollytelling se inicializa **solo** dentro de:
```ts
gsap.matchMedia().add(
  '(min-width: 768px) and (prefers-reduced-motion: no-preference) and (pointer: fine)',
  () => { /* pin + scrub + 3D; crear los ScrollTrigger AQUÍ dentro */ }
);
```
Rama móvil / reduced-motion / coarse-pointer: **no** se crea pin ni scrub. El mismo DOM (5 `<article>` apilados) se muestra estático, con **póster de fondo**; el Canvas 3D no se monta. `gsap.matchMedia` revierte automáticamente todo al cambiar la condición.

> **Póster y CLS:** el póster inicial es un **gradiente cosmic CSS** (sin `<img>` → sin riesgo de CLS por carga). La nota de "reservar `aspect-ratio`/dimensiones para CLS<0.1" aplica solo si en el futuro se sustituye por un `<img>` con un frame 3D real capturado.

## 9. Accesibilidad — criterios de aceptación

1. Con `prefers-reduced-motion: reduce`, la sección renderiza los 5 pasos como contenido apilado estático (título + cuerpo, en orden de lectura), fondo póster, sin pin/scrub/crossfade/parallax; toda la narrativa es legible.
2. Los 5 textos de paso están **siempre** en el DOM y son alcanzables por teclado (Tab/Shift+Tab, flechas, Space/PageDown) en orden coincidente con el visual; la narrativa se entiende con animaciones off.
3. La sección **nunca** atrapa scroll ni foco; el control "saltar animación / ir a la siguiente sección" es el **primer** elemento enfocable del bloque.
4. El paso activo se expone con `aria-current="step"`; los cambios se anuncian por una región `aria-live="polite"` visualmente oculta y *debounced* ("Paso X de 5: <título>"); el Canvas decorativo es `aria-hidden="true"`.
5. Los dots son un grupo operable por teclado: cada dot ≥44×44px, `aria-label` propio, paso activo con señal **no solo color** (escala + anillo + número) más `aria-current`, foco visible; son ayuda opcional, no la única navegación; clic → `lenis.scrollTo` al paso.
6. El texto va sobre un scrim 40–60% negro (o gradiente direccional) y cumple AA (≥4.5:1 cuerpo, ≥3:1 texto grande y glyphs UI), verificado contra el **frame más oscuro** de la escena animada.
7. En móvil/touch/coarse-pointer degrada a tarjetas apiladas con póster estático, scroll vertical nativo, sin scroll/overflow horizontal.
8. Todos los interactivos (dots, skip, CTAs) ≥44×44px con ≥8px de separación y respetan safe-areas.
9. El scrollytelling se inicializa solo tras el gate `matchMedia` y se revierte por completo al cambiar la condición (el camino estático es el baseline garantizado).
10. Las animaciones usan solo `transform/opacity`, reservan espacio del póster (`aspect-ratio`) para CLS<0.1, y sostienen ~60fps en un dispositivo de gama media.

## 10. Anti-patrones a evitar

Scroll-hijacking que altere el ritmo nativo; pins largos/indefinidos ("ilusión de completitud"); movimiento forzado sin fallback reduced-motion; contenido que solo existe al animar; trampa de scroll/foco; jank por animar `width/height/top/left`; movimiento decorativo sin significado; progreso solo por color o dots <44px; romper el back/anchor; auto-avance temporizado.

## 11. Plan de pruebas

- **Unit (Vitest):** `scrollProgressStore` (set/get/subscribe/notify) y funciones puras de mapeo (`progressToActiveStep`, `progressToPanelOpacity`). Deterministas, aisladas, AAA. Archivo espejo: `src/test/unit/...`.
- **E2E (Playwright):** alineado con el spec único `e2e/critical-flow.spec.ts` (o nuevo `e2e/home/proceso.spec.ts`): sección visible; los 5 pasos presentes en DOM; skip link como primer foco y funcional; con `page.emulateMedia({ reducedMotion: 'reduce' })` se ve apilado; navegación por teclado; sin scroll horizontal en viewport móvil; dots accesibles (rol/label/foco); título en EN y ES.
- **Build:** `tsc --noEmit` y `next build` con exit 0 antes de cerrar (regla del proyecto). E2E/unit en verde o bloqueo reportado honestamente.

## 12. Fuera de alcance

- Capturar un frame 3D real como póster móvil (mejora futura; ahora gradiente).
- Reescribir las otras secciones o sus animaciones.
- Snap/anclaje rígido por paso.
- Cambios en el blog u otras rutas.

## 13. Secuencia de build sugerida

1. Fix `LenisProvider` (sync) + `@gsap/react` en deps → verificar que el sitio actual sigue OK.
2. `scrollProgressStore` + tests unit.
3. `useProcessScrollytelling` (pin/scrub + matchMedia, sin 3D aún).
4. `ProcessSection` (DOM accesible estático primero; luego capa de movimiento).
5. `ProcessBackground3D` (Canvas demand + mutación por progreso).
6. Insertar en `HomeClient` + reindexar etiquetas + nav `#proceso` + CSS.
7. Copys i18n EN/ES.
8. E2E + verificación de build y a11y.
