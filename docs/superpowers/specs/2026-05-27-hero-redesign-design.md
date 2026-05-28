# Hero Redesign — Cosmic Cinematic

- **Date:** 2026-05-27
- **Status:** Approved (brainstorming phase)
- **Affects:** Home `/` first viewport (hero)

## Goal

Rediseñar el hero del home para maximizar **impacto visual (#1)** y reforzar la **conversión (#2)** sin perder la identidad cósmica existente. El visitante debe entender en menos de 5 segundos: quién soy, qué construyo, y por qué contratarme.

## Approved decisions

| Decisión | Valor |
|---|---|
| Dirección visual | **Cosmic Cinematic** (evolución del tema espacial actual) |
| Objeto 3D protagonista | **Moneda refinada** (1 sola Canvas) con interacción de arrastrar/girar |
| Fondo | Degradado espacial + ~12 estrellas en CSS (sin 3D de cruces) |
| Headline | **Outcome-focused**: propuesta de valor concreta |
| Prueba social | Sí: `5+ años · 10+ proyectos · React · Next · Node · IA/LLMs` |
| Idioma JSON-LD | `inLanguage: 'en'` (definido en auditoría SEO previa) |

## Anatomy

```text
+--------------------------------------------------------------+
| [role pill — Full Stack & AI Developer]   [AVAILABLE FOR WORK]|
|                                                              |
|  CRISTOPHER PALACIOS                                          |
|                                                              |
|  Construyo apps web RÁPIDAS Y ESCALABLES,                     |
|  y productos con IA.                  ┌─────────┐             |
|                                       │ (coin)  │             |
|  Trabajo con equipos y startups...    │ glow    │             |
|                                       └─────────┘             |
|  [5+ años][10+ proyectos][React][Next][Node][IA/LLMs]         |
|                                                              |
|  [ HABLEMOS → ]  [ Ver proyectos ]                            |
|                                                              |
| │ SCROLL TO EXPLORE                                            |
+--------------------------------------------------------------+
```

- Layout: 2 columnas en desktop (~1024+), apiladas en mobile (texto arriba, moneda abajo, chips ajustados).
- Altura: `100vh` (mínimo `600px`).
- Fondo: `radial-gradient(ellipse at 70% 50%, #122046 0%, #060912 75%)` + ~7 estrellas CSS pintadas con `radial-gradient` apilados en una sola `background-image`.

## Copy (EN + ES)

| Slot | EN | ES |
|---|---|---|
| `heroSection.eyebrow` | `Cristopher Palacios` | `Cristopher Palacios` |
| `heroSection.role` | `Full Stack & AI Developer` (sin cambio) | `Full Stack & AI Developer` |
| `heroSection.available` | `AVAILABLE FOR WORK` (sin cambio) | `DISPONIBLE PARA TRABAJAR` |
| `heroSection.headlinePart1` | `I build` | `Construyo apps web` |
| `heroSection.headlineAccent` | `fast, scalable web apps` | `rápidas y escalables` |
| `heroSection.headlinePart2` | `, and AI-powered products.` | `, y productos con IA.` |
| `heroSection.description` | `I work with teams and startups around the world, turning ideas into digital products that scale.` | `Trabajo con equipos y startups en todo el mundo, transformando ideas en productos digitales que escalan.` |
| `heroSection.chipYears` | `5+ years` | `5+ años` |
| `heroSection.chipProjects` | `10+ projects` | `10+ proyectos` |
| `heroSection.letsTalk` | `LET'S TALK` (sin cambio) | `HABLEMOS` |
| `heroSection.viewProjects` | `View projects` | `Ver proyectos` |
| `heroSection.scrollDown` | `SCROLL TO EXPLORE` (sin cambio) | `DESPLAZAR PARA EXPLORAR` |
| `heroSection.coinHint` | `Click or drag to spin` | `Clic o arrastrá para girar` |

Las palabras *accent* del headline se renderizan con `linear-gradient(135deg,#3B82F6,#7C3AED)` clipping al texto.

### Claves a **eliminar** del JSON (si están presentes)

`heroSection.greeting`, `heroSection.name`, `heroSection.surname` — el H1 ya no es el nombre. Verificar existencia antes de borrar; si no están, omitir.

## Refined coin — spec

| Aspecto | Detalle |
|---|---|
| Caras | Frente: `header-1.png` (foto/ilustración existente). Reverso: monograma "CP" generado en canvas con el gradiente `#3B82F6 → #7C3AED` (sin nuevos assets) |
| Geometría | Cilindro `r=1, h=0.14, 80 segmentos` + dos discos planos (sin cambio) |
| Anillos glow | Cyan al frente (`#00D4FF`), azul al reverso (`#3B82F6`), emissive 0.4 |
| Iluminación | 3-point existente + nueva luz de borde (rim) `directionalLight` en `position={[-2, -1.5, -2]}`, `color="#00D4FF"`, `intensity={0.5}` para definir silueta desde atrás |
| Auto-rotación | Solo si `prefers-reduced-motion: no-preference` |
| Float idle | Igual (subtle bob) — desactivado en reduced motion |
| Interacción | Arrastrar para girar (sin cambio), clic suma velocidad (sin cambio) |
| Tamaño | `200×200` desktop, `140×140` mobile |
| Halo cyan | Capa absoluta detrás de la moneda con `background:radial-gradient(circle, rgba(0,212,255,.18) 0%, transparent 65%)`. Tamaño: `320×320` desktop, `220×220` mobile (NO partículas 3D) |
| Hint texto | "CLIC O ARRASTRÁ PARA GIRAR" debajo, sutil (mobile: oculto) |

### Monograma — generación

```ts
// nuevo helper en HeroCoin.tsx o lib
function createMonogramTexture(size = 512): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  // fondo oscuro de moneda
  const bg = ctx.createRadialGradient(size*0.32, size*0.28, 10, size/2, size/2, size/2);
  bg.addColorStop(0, '#2a3f7a');
  bg.addColorStop(1, '#0b1430');
  ctx.fillStyle = bg;
  ctx.beginPath(); ctx.arc(size/2, size/2, size/2, 0, Math.PI*2); ctx.fill();
  // "CP" con gradiente
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#3B82F6');
  grad.addColorStop(1, '#7C3AED');
  ctx.fillStyle = grad;
  ctx.font = `900 ${size*0.55}px 'Space Grotesk', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CP', size/2, size/2 + size*0.02);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
```

## Files affected

| Acción | Archivo | Motivo |
|---|---|---|
| Modify | `src/components/cosmic/hero/HeroOverlay.tsx` | Eyebrow + nuevo H1 + chips + CTAs (texto) |
| Modify | `src/components/cosmic/hero/HeroSection.tsx` | Quitar referencia a `HeroScene`, agregar estrellas CSS |
| Modify | `src/components/cosmic/hero/HeroCoin.tsx` | Textura monograma para `backSrc`, rim light, reduced-motion |
| Modify | `src/styles/cosmic.css` | Estilos para `.hero-eyebrow`, `.hero-chip`, `.hero-stars`, `.hero-glow-halo` |
| Modify | `src/data/text-content-en.json` | Nuevas claves de copy (sección "Copy") |
| Modify | `src/data/text-content-es.json` | Nuevas claves de copy (sección "Copy") |
| **Delete** | `src/components/cosmic/hero/HeroScene.tsx` | Segundo canvas eliminado |
| **Delete** | `src/components/cosmic/hero/CrossShape.tsx` | Solo usado por HeroScene |

## Accessibility

- `prefers-reduced-motion: reduce` → la moneda no auto-rota ni hace float; sigue siendo interactiva al clic/arrastre.
- `aria-label="Cristopher Palacios — Full Stack & AI Developer"` en el `<h1>` (ya en sitio tras fix SEO previo).
- Canvas con `aria-label="Moneda interactiva — clic o arrastrá para girar"` y `role="img"`.
- Contraste WCAG AA:
  - Chips de `5+ años/10+ proyectos`: `#a8e7ff` sobre `rgba(0,212,255,.08)` → contraste sobre el fondo base verificar ≥ 4.5:1.
  - Chips neutrales: `#cfe0ff` sobre `#ffffff0d` → idem.
- Fallback sin WebGL: render de un `<div>` circular estático con el monograma CP en CSS (sin animación).

## Performance

- **Un solo canvas 3D** (la moneda) — eliminamos `HeroScene` que tenía 11 meshes + lights + pointer tracking.
- Estrellas: ~7 `radial-gradient` apilados en un único `background-image` (GPU-friendly, sin animación).
- Halo cyan: `box-shadow` CSS (no glow 3D / no bloom).
- `HeroScene` ya estaba como `dynamic({ ssr: false })`; la moneda sigue igual.
- LCP esperado: bajará porque el primer paint del hero deja de depender de un Canvas grande.

## Testing

E2E (`e2e/home/` siguiendo las reglas del proyecto):

1. **`hero-content.spec.ts`** — sección "renderizado inicial":
   - `expect(page.getByRole('heading', { level: 1 })).toContainText('escalables')`
   - Chips visibles: `5+ años`, `10+ proyectos`, `React`, `Next.js`, `Node`, `IA / LLMs`
   - Botón `HABLEMOS` linkea a `#contact`; `Ver proyectos` a `#projects`
   - Role pill y AVAILABLE badge visibles
2. **`hero-interaction.spec.ts`**:
   - Canvas de la moneda presente (`canvas` dentro de `.hero-coin`)
   - Click en CTA principal cambia URL a `#contact`
3. **`hero-mobile.spec.ts`** (viewport 390×844):
   - Layout apilado (verificar `bounding box` de moneda debajo del bloque de texto)
   - Chips se envuelven sin overflow horizontal
4. **`hero-i18n.spec.ts`**:
   - Toggle a ES: el H1 incluye "rápidas y escalables"
   - Toggle a EN: el H1 incluye "fast, scalable"
5. **`hero-a11y.spec.ts`**:
   - Con `--enable-features=PrefersReducedMotion` (o emulación), verificar que la moneda no auto-rota (snapshot de rotación en `t=0` y `t=1s` debe ser igual)
   - `axe-core` sin violaciones de contraste en el hero

## Out of scope

- Rediseño de las secciones siguientes (About, Experience, etc.) — solo el hero.
- Cambio de foto principal — se usa `header-1.png` existente.
- Internacionalización por URL (`/en`, `/es`) — H3 ya quedó como "quick fix EN-only" en SEO.
- Reemplazo del sistema GSAP/Lenis — se conservan.
- Nueva imagen de OG — sin cambio.

## Open risks

- Si la foto en `header-1.png` no resulta "premium" en la moneda, conviene reemplazarla por una foto profesional (no parte de este spec; se hace después).
- La textura del monograma generada en canvas se calcula al montar el componente del lado cliente. Si en algún momento se renderiza durante SSR del Canvas (no debería: `ssr: false`), habría que mover la generación a `useEffect`.
