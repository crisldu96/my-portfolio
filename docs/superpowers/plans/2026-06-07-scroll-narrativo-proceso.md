# Scroll narrativo "Mi proceso" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir una sección narrativa "Mi proceso" (scrollytelling 3D anclado, 5 pasos) entre About y Experience en la landing, con fallback estático en móvil/reduced-motion y accesibilidad completa.

**Architecture:** El scroll suave (Lenis) se sincroniza con GSAP ScrollTrigger vía el ticker único de GSAP. Una sección a pantalla completa se "pinea" y, con `scrub`, una timeline hace crossfade de 5 paneles mientras una escena r3f (`frameloop="demand"`) lee el progreso desde un store de módulo y muta el objeto 3D sin re-render de React. Todo el movimiento se inicializa solo tras un gate `gsap.matchMedia('(min-width:768px) and (prefers-reduced-motion:no-preference) and (pointer:fine)')`; el resto recibe tarjetas apiladas estáticas con póster de gradiente.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, MUI v9, GSAP 3.15 + `@gsap/react` (useGSAP) + ScrollTrigger, Lenis, react-three-fiber / drei / three, Vitest, Playwright.

**Rama de trabajo:** `feat/scroll-narrativo-proceso` (ya creada; el spec está commiteado en ella).

**Spec de referencia:** `docs/superpowers/specs/2026-06-07-scroll-narrativo-proceso-design.md`

---

## Estructura de archivos

**Crear:**
- `src/lib/scrollProgressStore.ts` — store de módulo (progreso 0–1) + helpers puros (`progressToActiveStep`). Reutilizable.
- `src/lib/lenisInstance.ts` — singleton de módulo para compartir la instancia de Lenis (nav de los dots). Reutilizable.
- `src/hooks/useProcessScrollytelling.ts` — encapsula useGSAP + matchMedia + pin/scrub; expone `scrollToStep`. Reutilizable.
- `src/components/cosmic/ProcessBackground3D.tsx` — Canvas r3f scrubbed (específico).
- `src/components/landing/ProcessSection.tsx` — DOM semántico + dots + aria + orquesta el hook (específico).
- `src/test/unit/lib/scrollProgressStore.test.ts` — tests del store y helpers.

**Modificar:**
- `src/components/cosmic/LenisProvider.tsx` — fix sync Lenis↔ScrollTrigger + publicar instancia.
- `src/components/cosmic/GsapProvider.tsx` — registrar `useGSAP` además de `ScrollTrigger`.
- `src/components/landing/HomeClient.tsx` — insertar la sección + dynamic import + dividers.
- `src/styles/cosmic.css` — clases `.process-*` y `.process-bg-3d` + reduced-motion.
- `src/data/text-content-en.json` y `src/data/text-content-es.json` — `processSection` + `appBar.proceso`.
- `src/components/layout/AppBar.tsx` — navItem "Proceso" + `sectionIds`.
- `src/components/landing/ExperienceSection.tsx` (`02`→`03`), `SkillsSection.tsx` (`03`→`04`), `ProjectsSection.tsx` (`04`→`05`), `BlogHighlightSection.tsx` (`05`→`06`), `ContactSection.tsx` (`06`→`07`) — reindexar etiquetas.
- `package.json` — `@gsap/react`.
- `e2e/critical-flow.spec.ts` — bloque `describe` para "Mi proceso".

---

## Task 1: Instalar @gsap/react

**Files:**
- Modify: `package.json` (dependencies)

- [ ] **Step 1: Instalar la dependencia**

Run:
```bash
npm install @gsap/react@^2.1.2
```
Expected: `package.json` queda con `"@gsap/react": "^2.1.2"` en `dependencies` y `npm install` termina con exit 0.

- [ ] **Step 2: Verificar que el proyecto sigue compilando**

Run:
```bash
npm run lint
```
(`lint` = `tsc --noEmit`.) Expected: exit 0, sin errores nuevos.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add @gsap/react for useGSAP"
```

---

## Task 2: scrollProgressStore + helper puro (TDD)

Store de módulo desacoplado de React: ScrollTrigger escribe el progreso; los suscriptores (la escena r3f) reciben aviso para invalidar un frame. Helper puro `progressToActiveStep` para derivar el paso activo (dots/aria).

**Files:**
- Create: `src/lib/scrollProgressStore.ts`
- Test: `src/test/unit/lib/scrollProgressStore.test.ts`

- [ ] **Step 1: Escribir el test que falla**

`src/test/unit/lib/scrollProgressStore.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import {
  scrollProgressStore,
  progressToActiveStep,
  PROCESS_STEP_COUNT,
} from '@/lib/scrollProgressStore';

describe('scrollProgressStore', () => {
  beforeEach(() => {
    scrollProgressStore.set(0);
  });

  it('almacena y devuelve el progreso', () => {
    scrollProgressStore.set(0.42);
    expect(scrollProgressStore.get()).toBe(0.42);
  });

  it('notifica a los suscriptores en cada set', () => {
    let calls = 0;
    const unsubscribe = scrollProgressStore.subscribe(() => {
      calls += 1;
    });
    scrollProgressStore.set(0.1);
    scrollProgressStore.set(0.2);
    expect(calls).toBe(2);
    unsubscribe();
  });

  it('deja de notificar tras desuscribirse', () => {
    let calls = 0;
    const unsubscribe = scrollProgressStore.subscribe(() => {
      calls += 1;
    });
    unsubscribe();
    scrollProgressStore.set(0.5);
    expect(calls).toBe(0);
  });
});

describe('progressToActiveStep', () => {
  it('mapea el inicio al paso 0', () => {
    expect(progressToActiveStep(0)).toBe(0);
  });

  it('mapea el final al último paso', () => {
    expect(progressToActiveStep(1)).toBe(PROCESS_STEP_COUNT - 1);
  });

  it('mapea el centro al paso central', () => {
    expect(progressToActiveStep(0.5)).toBe(2);
  });

  it('clampa valores fuera de rango', () => {
    expect(progressToActiveStep(-0.3)).toBe(0);
    expect(progressToActiveStep(1.7)).toBe(PROCESS_STEP_COUNT - 1);
  });

  it('devuelve 0 ante NaN', () => {
    expect(progressToActiveStep(Number.NaN)).toBe(0);
  });
});
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run:
```bash
npx vitest run src/test/unit/lib/scrollProgressStore.test.ts
```
Expected: FAIL — no existe el módulo `@/lib/scrollProgressStore`.

- [ ] **Step 3: Implementar el módulo**

`src/lib/scrollProgressStore.ts`:
```ts
export const PROCESS_STEP_COUNT = 5;

type Listener = () => void;

let progress = 0;
const listeners = new Set<Listener>();

export const scrollProgressStore = {
  set(value: number) {
    progress = value;
    listeners.forEach((fn) => fn());
  },
  get() {
    return progress;
  },
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

export function progressToActiveStep(p: number, steps = PROCESS_STEP_COUNT): number {
  if (Number.isNaN(p)) return 0;
  const clamped = Math.min(Math.max(p, 0), 1);
  return Math.min(steps - 1, Math.floor(clamped * steps));
}
```

- [ ] **Step 4: Ejecutar el test y verificar que pasa**

Run:
```bash
npx vitest run src/test/unit/lib/scrollProgressStore.test.ts
```
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/scrollProgressStore.ts src/test/unit/lib/scrollProgressStore.test.ts
git commit -m "feat(proceso): scrollProgressStore + progressToActiveStep (TDD)"
```

---

## Task 3: lenisInstance singleton

Permite que `useProcessScrollytelling` use `lenis.scrollTo` desde los dots sin acoplarse a LenisProvider.

**Files:**
- Create: `src/lib/lenisInstance.ts`

- [ ] **Step 1: Implementar el singleton**

`src/lib/lenisInstance.ts`:
```ts
import type Lenis from 'lenis';

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}
```

- [ ] **Step 2: Verificar tipos**

Run:
```bash
npm run lint
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/lib/lenisInstance.ts
git commit -m "feat(proceso): lenisInstance singleton para nav de pasos"
```

---

## Task 4: Fix Lenis ↔ ScrollTrigger sync (+ publicar instancia)

Sin esto, pin/scrub se desincronizan del scroll suave. Se reemplaza el RAF propio de Lenis por el ticker de GSAP y se actualiza ScrollTrigger en cada scroll. Se publica la instancia en el singleton.

**Files:**
- Modify: `src/components/cosmic/LenisProvider.tsx` (reescritura completa)

- [ ] **Step 1: Reescribir LenisProvider**

`src/components/cosmic/LenisProvider.tsx` (contenido completo):
```tsx
'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenis } from '@/lib/lenisInstance';

export default function LenisProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });
    setLenis(lenis);

    // Single clock: drive Lenis from the GSAP ticker and keep ScrollTrigger in sync.
    lenis.on('scroll', ScrollTrigger.update);
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Hash anchor scroll via Lenis for in-page navigation
    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a[href*="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      const [path, hash] = href.split('#');
      const samePath = !path || path === window.location.pathname || path === '/';
      if (!samePath || !hash) return;
      const el = document.getElementById(hash);
      if (!el) return;
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('page-fold:start', { detail: { hash } }));
      setTimeout(() => {
        lenis.scrollTo(el, { offset: -72, duration: 1.3 });
        window.dispatchEvent(new CustomEvent('page-fold:end'));
      }, 380);
    };
    document.addEventListener('click', onAnchorClick);

    // Pin start/end are measured from layout: refresh after first paint settles.
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      window.clearTimeout(refreshId);
      gsap.ticker.remove(update);
      lenis.off('scroll', ScrollTrigger.update);
      document.removeEventListener('click', onAnchorClick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
```

- [ ] **Step 2: Verificar tipos y arranque**

Run:
```bash
npm run lint
```
Expected: exit 0.

Run (manual, terminar con Ctrl+C tras confirmar):
```bash
npm run dev
```
Expected: el sitio carga, el scroll suave sigue funcionando y los enlaces ancla (`/#about`, etc.) navegan suave. No hay errores de GSAP en consola.

- [ ] **Step 3: Commit**

```bash
git add src/components/cosmic/LenisProvider.tsx
git commit -m "fix(scroll): sincronizar Lenis con GSAP ScrollTrigger (ticker unico)"
```

---

## Task 5: Registrar useGSAP en GsapProvider

`useGSAP` debe registrarse como plugin para integrarse con el manejo de contexto de GSAP.

**Files:**
- Modify: `src/components/cosmic/GsapProvider.tsx`

- [ ] **Step 1: Editar GsapProvider**

`src/components/cosmic/GsapProvider.tsx` (contenido completo):
```tsx
'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

let registered = false;

export default function GsapProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!registered) {
      gsap.registerPlugin(useGSAP, ScrollTrigger);
      registered = true;
    }
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2: Verificar tipos**

Run:
```bash
npm run lint
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/cosmic/GsapProvider.tsx
git commit -m "chore(gsap): registrar useGSAP en GsapProvider"
```

---

## Task 6: useProcessScrollytelling hook

Encapsula useGSAP + matchMedia + pin/scrub. En desktop+no-preference+fine crea la timeline (pin, scrub, crossfade de paneles `.process-step`), escribe el progreso en el store y deriva el paso activo. En móvil/reduced-motion fija el progreso en su estado representativo y no crea pin. Expone `scrollToStep`.

**Files:**
- Create: `src/hooks/useProcessScrollytelling.ts`

- [ ] **Step 1: Implementar el hook**

`src/hooks/useProcessScrollytelling.ts`:
```ts
'use client';

import { useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  scrollProgressStore,
  progressToActiveStep,
  PROCESS_STEP_COUNT,
} from '@/lib/scrollProgressStore';
import { getLenis } from '@/lib/lenisInstance';

// Ensure plugins are registered before the hook runs, regardless of provider effect order.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

interface Options {
  rootRef: RefObject<HTMLDivElement | null>;
  pinRef: RefObject<HTMLDivElement | null>;
  stepCount?: number;
  panelSelector?: string;
  onStepChange: (step: number) => void;
}

export function useProcessScrollytelling({
  rootRef,
  pinRef,
  stepCount = PROCESS_STEP_COUNT,
  panelSelector = '.process-step',
  onStepChange,
}: Options) {
  const stRef = useRef<ScrollTrigger | null>(null);
  const lastStep = useRef<number>(-1);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        '(min-width: 768px) and (prefers-reduced-motion: no-preference) and (pointer: fine)',
        () => {
          const panels = gsap.utils.toArray<HTMLElement>(panelSelector, rootRef.current!);
          if (!panels.length) return;

          gsap.set(panels, { opacity: 0, yPercent: 8 });
          gsap.set(panels[0], { opacity: 1, yPercent: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinRef.current!,
              start: 'top top',
              end: () => '+=' + Math.round(stepCount * 0.9 * window.innerHeight),
              pin: true,
              pinSpacing: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                scrollProgressStore.set(self.progress);
                const step = progressToActiveStep(self.progress, stepCount);
                if (step !== lastStep.current) {
                  lastStep.current = step;
                  onStepChange(step);
                }
              },
            },
          });

          panels.forEach((panel, i) => {
            if (i === 0) return;
            tl.to(panels[i - 1], { opacity: 0, yPercent: -8, duration: 0.5 }, i)
              .to(panel, { opacity: 1, yPercent: 0, duration: 0.5 }, i);
          });

          stRef.current = tl.scrollTrigger ?? null;
          onStepChange(0);
        }
      );

      mm.add('(max-width: 767px), (prefers-reduced-motion: reduce), (pointer: coarse)', () => {
        // Static baseline: scene at a representative frame; no pin/scrub.
        scrollProgressStore.set(1);
        stRef.current = null;
        onStepChange(0);
      });
    },
    { scope: rootRef }
  );

  const scrollToStep = (i: number) => {
    const st = stRef.current;
    const lenis = getLenis();
    if (st) {
      const target = st.start + (st.end - st.start) * ((i + 0.5) / stepCount);
      if (lenis) lenis.scrollTo(target, { duration: 1 });
      else window.scrollTo({ top: target, behavior: 'smooth' });
      return;
    }
    // Fallback (mobile/reduced): scroll the step article into view.
    const el = document.getElementById(`proceso-step-${i}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return { scrollToStep };
}
```

- [ ] **Step 2: Verificar tipos**

Run:
```bash
npm run lint
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useProcessScrollytelling.ts
git commit -m "feat(proceso): hook useProcessScrollytelling (useGSAP + matchMedia pin/scrub)"
```

---

## Task 7: ProcessBackground3D (escena r3f scrubbed)

Canvas `frameloop="demand"` montado solo en desktop+no-preference+fine; el div `.process-bg-3d` siempre lleva el póster de gradiente (visible en móvil/reduced). La escena lee el progreso del store en `useFrame` y muta el objeto; un componente interno invalida un frame en cada cambio del store.

**Files:**
- Create: `src/components/cosmic/ProcessBackground3D.tsx`

- [ ] **Step 1: Implementar el componente**

`src/components/cosmic/ProcessBackground3D.tsx`:
```tsx
'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { scrollProgressStore } from '@/lib/scrollProgressStore';

const ACCENT_START = new THREE.Color('#00D4FF'); // cyan (paso 1)
const ACCENT_END = new THREE.Color('#7C3AED'); // violet (paso 5)

function FrameOnScroll() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => scrollProgressStore.subscribe(() => invalidate()), [invalidate]);
  return null;
}

function ProcessObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useRef(ACCENT_START.clone());

  useFrame(() => {
    const m = meshRef.current;
    if (!m) return;
    const p = scrollProgressStore.get();
    m.rotation.y = p * Math.PI * 2;
    m.rotation.x = p * Math.PI * 0.5;
    m.scale.setScalar(0.9 + p * 1.1);
    color.current.copy(ACCENT_START).lerp(ACCENT_END, p);
    const mat = m.material as THREE.MeshStandardMaterial;
    mat.color.copy(color.current);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={1}>
      <icosahedronGeometry args={[1.4, 24]} />
      <MeshDistortMaterial
        color={ACCENT_START.getStyle()}
        distort={0.45}
        speed={1.4}
        metalness={0.6}
        roughness={0.3}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function useDesktopMotionGate(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference) and (pointer: fine)'
    );
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return enabled;
}

export default function ProcessBackground3D() {
  const enabled = useDesktopMotionGate();
  return (
    <div className="process-bg-3d" aria-hidden="true">
      {enabled && (
        <Canvas
          frameloop="demand"
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} color="#00D4FF" />
          <pointLight position={[-5, -3, 2]} intensity={1.2} color="#7C3AED" />
          <Suspense fallback={null}>
            <ProcessObject />
          </Suspense>
          <FrameOnScroll />
        </Canvas>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verificar tipos**

Run:
```bash
npm run lint
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/cosmic/ProcessBackground3D.tsx
git commit -m "feat(proceso): ProcessBackground3D (r3f frameloop demand, scrubbed)"
```

---

## Task 8: Copys i18n (EN + ES)

Añadir `processSection` y la clave de nav `appBar.proceso` a ambos diccionarios. Insertar el bloque `processSection` justo después del bloque `aboutMeSection` en cada archivo, y `"proceso"` dentro del objeto `appBar`.

**Files:**
- Modify: `src/data/text-content-en.json`
- Modify: `src/data/text-content-es.json`

- [ ] **Step 1: Añadir clave de nav en EN**

En `src/data/text-content-en.json`, dentro del objeto `"appBar"`, añadir tras `"item7"`:
```json
    "proceso": "Process"
```

- [ ] **Step 2: Añadir bloque processSection en EN**

En `src/data/text-content-en.json`, inmediatamente después del cierre del objeto `"aboutMeSection"`, añadir:
```json
  "processSection": {
    "sectionLabel": "My process",
    "title": "How I work, step by step",
    "subtitle": "From idea to deployment: a clear, tested, repeatable method.",
    "skipLabel": "Skip animation and jump to the next section",
    "liveTemplate": "Step {n} of {total}: {title}",
    "steps": [
      { "title": "Discover", "description": "I dig into the problem, the user, and the constraints before writing a single line of code." },
      { "title": "Design", "description": "I shape the architecture, the contracts, and the experience, separating reusable patterns from domain-specific logic." },
      { "title": "Build", "description": "I implement in small, typed increments that follow the project's conventions." },
      { "title": "Test", "description": "I cover it with unit and E2E tests, validating accessibility and performance, not just the happy path." },
      { "title": "Ship", "description": "I deploy with green CI, monitoring, and clear user feedback at every state." }
    ]
  },
```

- [ ] **Step 3: Añadir clave de nav en ES**

En `src/data/text-content-es.json`, dentro del objeto `"appBar"`, añadir tras `"item7"`:
```json
    "proceso": "Proceso"
```

- [ ] **Step 4: Añadir bloque processSection en ES**

En `src/data/text-content-es.json`, inmediatamente después del cierre del objeto `"aboutMeSection"`, añadir:
```json
  "processSection": {
    "sectionLabel": "Mi proceso",
    "title": "Cómo trabajo, paso a paso",
    "subtitle": "De la idea al despliegue: un método claro, probado y repetible.",
    "skipLabel": "Saltar animación e ir a la siguiente sección",
    "liveTemplate": "Paso {n} de {total}: {title}",
    "steps": [
      { "title": "Descubrir", "description": "Entiendo el problema, el usuario y las restricciones antes de escribir una línea de código." },
      { "title": "Diseñar", "description": "Defino arquitectura, contratos y experiencia: separo lo reutilizable de lo específico del dominio." },
      { "title": "Construir", "description": "Implemento en incrementos pequeños y tipados, siguiendo las convenciones del proyecto." },
      { "title": "Probar", "description": "Cubro con pruebas unitarias y E2E; valido accesibilidad y rendimiento, no solo el happy path." },
      { "title": "Desplegar", "description": "Despliego con CI en verde, monitoreo y feedback claro al usuario en cada estado." }
    ]
  },
```

- [ ] **Step 5: Validar que el JSON sigue siendo válido**

Run:
```bash
node -e "require('./src/data/text-content-en.json'); require('./src/data/text-content-es.json'); console.log('json ok')"
```
Expected: imprime `json ok` (sin SyntaxError).

- [ ] **Step 6: Commit**

```bash
git add src/data/text-content-en.json src/data/text-content-es.json
git commit -m "feat(proceso): copys i18n EN/ES (processSection + nav)"
```

---

## Task 9: ProcessSection (DOM accesible + dots + aria + hook)

Componente de sección que renderiza los 5 pasos como `<article>` reales (baseline estático), el skip-link como primer foco, los dots accesibles, la región `aria-live`, y conecta `useProcessScrollytelling`. Mantiene el patrón del proyecto (`SectionLabel`, `reveal-on-scroll`, `handleTranslation`).

**Files:**
- Create: `src/components/landing/ProcessSection.tsx`

- [ ] **Step 1: Implementar el componente**

`src/components/landing/ProcessSection.tsx`:
```tsx
'use client';

import { useRef, useState } from 'react';
import Container from '@mui/material/Container';

import SectionLabel from '../cosmic/SectionLabel';
import { cosmic } from '@/themes/cosmicTokens';
import useLanguage from '@/hooks/useLanguage';
import { PROCESS_STEP_COUNT } from '@/lib/scrollProgressStore';
import { useProcessScrollytelling } from '@/hooks/useProcessScrollytelling';

interface ProcessStep {
  title: string;
  description: string;
}

const ProcessSection = () => {
  const { handleTranslation } = useLanguage();
  const steps = handleTranslation<ProcessStep[]>('processSection.steps') ?? [];
  const total = steps.length || PROCESS_STEP_COUNT;
  const liveTemplate = handleTranslation('processSection.liveTemplate');

  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollToStep } = useProcessScrollytelling({
    rootRef,
    pinRef,
    stepCount: total,
    onStepChange: setActiveStep,
  });

  const liveMessage =
    typeof liveTemplate === 'string' && steps[activeStep]
      ? liveTemplate
          .replace('{n}', String(activeStep + 1))
          .replace('{total}', String(total))
          .replace('{title}', steps[activeStep].title)
      : '';

  return (
    <div ref={rootRef}>
      <a href="#experience" className="process-skip-link">
        {handleTranslation('processSection.skipLabel')}
      </a>

      <Container maxWidth="lg">
        <SectionLabel number="02" label={handleTranslation('processSection.sectionLabel')} />
        <h2 className="section-headline">
          <span className="reveal-on-scroll">
            <span>{handleTranslation('processSection.title')}</span>
          </span>
        </h2>
        <p style={{ color: cosmic.textSecondary, maxWidth: 540, marginTop: 0, marginBottom: 24 }}>
          {handleTranslation('processSection.subtitle')}
        </p>
      </Container>

      <div ref={pinRef} className="process-pin">
        <Container maxWidth="md" className="process-stage">
          {steps.map((step, i) => (
            <article
              key={step.title}
              id={`proceso-step-${i}`}
              className="process-step"
              aria-current={i === activeStep ? 'step' : undefined}
            >
              <span className="process-step__index">
                {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <h3 className="process-step__title">{step.title}</h3>
              <p className="process-step__desc">{step.description}</p>
            </article>
          ))}
        </Container>

        <div className="process-dots" role="group" aria-label={handleTranslation('processSection.sectionLabel')}>
          {steps.map((step, i) => (
            <button
              key={step.title}
              type="button"
              className={`process-dot${i === activeStep ? ' process-dot--active' : ''}`}
              aria-current={i === activeStep ? 'step' : undefined}
              aria-label={`${handleTranslation('processSection.sectionLabel')}: ${i + 1}/${total} ${step.title}`}
              onClick={() => scrollToStep(i)}
            >
              <span className="process-dot__num">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {liveMessage}
      </div>
    </div>
  );
};

export default ProcessSection;
```

- [ ] **Step 2: Verificar tipos**

Run:
```bash
npm run lint
```
Expected: exit 0. (Si `sr-only` no existe en el proyecto, se crea en Task 10.)

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/ProcessSection.tsx
git commit -m "feat(proceso): ProcessSection (DOM accesible, dots, aria-live, hook)"
```

---

## Task 10: Estilos cosmic.css (.process-*, .process-bg-3d, reduced-motion)

Añadir las clases nuevas siguiendo el patrón de las existentes. El póster es un gradiente CSS en `.process-bg-3d`. Incluir `.sr-only` si no existe y la rama reduced-motion (paneles estáticos apilados).

**Files:**
- Modify: `src/styles/cosmic.css` (insertar tras la regla `.about-bg-3d`, ~línea 388)

- [ ] **Step 1: Añadir los bloques CSS**

Insertar en `src/styles/cosmic.css` después del bloque `.about-bg-3d`:
```css
/* ===== "Mi proceso" scrollytelling ===== */

/* 3D backdrop + static gradient poster (poster visible on mobile/reduced-motion) */
.process-bg-3d {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
  background:
    radial-gradient(60% 60% at 35% 40%, rgba(0, 212, 255, 0.18), transparent 70%),
    radial-gradient(55% 55% at 72% 70%, rgba(124, 58, 237, 0.20), transparent 70%);
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 85%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 85%);
}

/* Pinned stage: full viewport, panels overlaid (desktop motion branch) */
.process-pin {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.process-stage {
  position: relative;
  min-height: 50vh;
}

/* Each step panel overlaps in the same spot; GSAP crossfades opacity/y */
.process-step {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Scrim: keeps text AA-legible over the animated 3D scene */
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(8, 12, 26, 0.55), rgba(8, 12, 26, 0.45));
}

.process-step__index {
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: #00D4FF;
}

.process-step__title {
  font-family: var(--font-space-grotesk), sans-serif;
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 700;
  color: #F0F4FF;
  margin: 8px 0 12px;
}

.process-step__desc {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #C7D2E8;
  max-width: 60ch;
  margin: 0;
}

/* Progress dots: keyboard-operable, >=44px, non-color cue (ring + scale + number) */
.process-dots {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 2;
}

.process-dot {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid rgba(136, 153, 187, 0.5);
  background: rgba(8, 12, 26, 0.6);
  color: #8899BB;
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 0.75rem;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.process-dot:hover {
  border-color: #00D4FF;
}

.process-dot:focus-visible {
  outline: 3px solid #00D4FF;
  outline-offset: 2px;
}

.process-dot--active {
  transform: scale(1.15);
  border-color: #00D4FF;
  color: #F0F4FF;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.25);
}

/* Skip link: first focusable element of the block */
.process-skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 5;
}

.process-skip-link:focus {
  left: 16px;
  top: 16px;
  padding: 8px 16px;
  border-radius: 8px;
  background: #0D1530;
  color: #F0F4FF;
  border: 1px solid #00D4FF;
}

/* Visually-hidden live region (only add if not already present in cosmic.css) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Mobile / reduced-motion: stacked static cards, no pin/overlap */
@media (max-width: 767px), (prefers-reduced-motion: reduce), (pointer: coarse) {
  .process-pin {
    min-height: auto;
    display: block;
  }
  .process-stage {
    min-height: auto;
  }
  .process-step {
    position: relative;
    inset: auto;
    opacity: 1 !important;
    transform: none !important;
    margin-bottom: 24px;
  }
  .process-dots {
    position: relative;
    left: auto;
    bottom: auto;
    transform: none;
    margin: 16px auto 0;
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .process-bg-3d { opacity: 0.35; }
}
```

> Antes de añadir `.sr-only`, comprobar con búsqueda que no exista ya en `cosmic.css`; si existe, omitir ese bloque para no duplicar.

- [ ] **Step 2: Verificar build de estilos**

Run:
```bash
npm run build
```
Expected: exit 0 (compila e incluye el CSS sin errores).

- [ ] **Step 3: Commit**

```bash
git add src/styles/cosmic.css
git commit -m "style(proceso): clases .process-*, poster .process-bg-3d y reduced-motion"
```

---

## Task 11: Insertar la sección en HomeClient

**Files:**
- Modify: `src/components/landing/HomeClient.tsx`

- [ ] **Step 1: Añadir imports y dynamic import**

En `src/components/landing/HomeClient.tsx`, junto a los otros imports de secciones, añadir:
```tsx
import ProcessSection from '@/components/landing/ProcessSection';
```
Y junto a los `dynamic(...)` existentes (tras `ExperienceBackground3D`):
```tsx
const ProcessBackground3D = dynamic(
  () => import('@/components/cosmic/ProcessBackground3D'),
  { ssr: false }
);
```

- [ ] **Step 2: Insertar la sección entre About y Experience**

Reemplazar el `SectionDivider` que está entre el `SectionWrapper id="about"` y el `SectionWrapper id="experience"`:

Buscar:
```tsx
      <SectionDivider fromColor={cosmic.bg1} toColor={cosmic.bg0} height={24} />

      <SectionWrapper id="experience" sx={{ bgcolor: cosmic.bg0, position: 'relative', overflow: 'hidden' }}>
```
Reemplazar por:
```tsx
      <SectionDivider fromColor={cosmic.bg1} toColor={cosmic.bg0} height={24} />

      <SectionWrapper id="proceso" sx={{ bgcolor: cosmic.bg0, position: 'relative', overflow: 'hidden' }}>
        <div className="cosmic-ambient" data-accent="violet" />
        <ProcessBackground3D />
        <div className="dotgrid" />
        <div className="section-content"><ProcessSection /></div>
      </SectionWrapper>

      <SectionDivider fromColor={cosmic.bg0} toColor={cosmic.bg0} height={24} />

      <SectionWrapper id="experience" sx={{ bgcolor: cosmic.bg0, position: 'relative', overflow: 'hidden' }}>
```

- [ ] **Step 3: Verificar tipos y build**

Run:
```bash
npm run build
```
Expected: exit 0; la ruta `/` se prerenderiza sin errores.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/HomeClient.tsx
git commit -m "feat(proceso): insertar seccion Mi proceso entre About y Experience"
```

---

## Task 12: Reindexar etiquetas de sección

Insertar Proceso como `02` obliga a correr el resto. Editar el prop `number` en cada componente.

**Files:**
- Modify: `src/components/landing/ExperienceSection.tsx` (`"02"` → `"03"`)
- Modify: `src/components/landing/SkillsSection.tsx` (`"03"` → `"04"`)
- Modify: `src/components/landing/ProjectsSection.tsx` (`"04"` → `"05"`)
- Modify: `src/components/landing/BlogHighlightSection.tsx` (`"05"` → `"06"`)
- Modify: `src/components/landing/ContactSection.tsx` (`"06"` → `"07"`)

- [ ] **Step 1: ExperienceSection**

En `src/components/landing/ExperienceSection.tsx`, en el `<SectionLabel ... number="02" ... />`, cambiar `number="02"` por `number="03"`.

- [ ] **Step 2: SkillsSection**

En `src/components/landing/SkillsSection.tsx`, cambiar `number="03"` por `number="04"`.

- [ ] **Step 3: ProjectsSection**

En `src/components/landing/ProjectsSection.tsx`, cambiar `number="04"` por `number="05"`.

- [ ] **Step 4: BlogHighlightSection**

En `src/components/landing/BlogHighlightSection.tsx`, cambiar `number="05"` por `number="06"`.

- [ ] **Step 5: ContactSection**

En `src/components/landing/ContactSection.tsx`, cambiar `number="06"` por `number="07"`.

- [ ] **Step 6: Verificar tipos**

Run:
```bash
npm run lint
```
Expected: exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/components/landing/ExperienceSection.tsx src/components/landing/SkillsSection.tsx src/components/landing/ProjectsSection.tsx src/components/landing/BlogHighlightSection.tsx src/components/landing/ContactSection.tsx
git commit -m "refactor(landing): reindexar etiquetas de seccion tras insertar Proceso"
```

---

## Task 13: Item "Proceso" en el nav (AppBar)

Añadir el ancla `/#proceso` entre About y Experience en el nav y registrar `proceso` en la detección de sección activa.

**Files:**
- Modify: `src/components/layout/AppBar.tsx`

- [ ] **Step 1: Añadir el navItem**

En `src/components/layout/AppBar.tsx`, en el array `navItems`, insertar tras la entrada `about`:
```tsx
    { href: '/#proceso', id: 'proceso', labelKey: 'appBar.proceso', icon: <IconRoute2 /> },
```

- [ ] **Step 2: Importar el icono**

En el import de `@tabler/icons-react` (el que trae `IconHome2, IconUser, ...`), añadir `IconRoute2`:
```tsx
import { IconHome2, IconUser, IconRoute2, IconBriefcase, IconCode, IconDeviceLaptop, IconMail, IconArticle } from '@tabler/icons-react';
```

- [ ] **Step 3: Registrar en detección de sección activa**

En el `useEffect` de scroll, actualizar el array `sectionIds` para incluir `proceso` en orden descendente de posición:
```tsx
    const sectionIds = ['contact', 'projects', 'skills', 'experience', 'proceso', 'about', 'home'];
```

- [ ] **Step 4: Verificar tipos y build**

Run:
```bash
npm run build
```
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/AppBar.tsx
git commit -m "feat(nav): item Proceso (#proceso) en el AppBar"
```

---

## Task 14: E2E — bloque "Mi proceso" en critical-flow

Mantener el spec único. Añadir un `describe` que valide render, presencia de los 5 pasos en DOM, skip-link, dots accesibles, fallback reduced-motion (apilado), ausencia de scroll horizontal en móvil, e i18n EN/ES.

**Files:**
- Modify: `e2e/critical-flow.spec.ts` (añadir al final, antes del cierre del archivo)

- [ ] **Step 1: Añadir el bloque de tests**

Añadir al final de `e2e/critical-flow.spec.ts`:
```ts
test.describe('Narrative section - "Mi proceso"', () => {
  test('renders the process section with all five steps present in the DOM', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const section = page.locator('#proceso');
    await expect(section).toBeVisible();

    const steps = section.locator('.process-step');
    await expect(steps).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      await expect(steps.nth(i)).toHaveAttribute('id', `proceso-step-${i}`);
    }
  });

  test('progress dots are an accessible, labelled, keyboard-focusable group', async ({ page }) => {
    await page.goto('/');
    const dots = page.locator('#proceso .process-dot');
    await expect(dots).toHaveCount(5);
    await expect(dots.first()).toHaveAttribute('aria-label', /1\/5/);
    await dots.first().focus();
    await expect(dots.first()).toBeFocused();
  });

  test('skip link points to the next section', async ({ page }) => {
    await page.goto('/');
    const skip = page.locator('#proceso .process-skip-link');
    await expect(skip).toHaveAttribute('href', '#experience');
  });

  test('with reduced motion, all five steps are stacked and readable', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const steps = page.locator('#proceso .process-step');
    await expect(steps).toHaveCount(5);
    // Stacked (not overlapped): every step is visible at once.
    for (let i = 0; i < 5; i++) {
      await expect(steps.nth(i)).toBeVisible();
    }
  });

  test('on a mobile viewport there is no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.locator('#proceso').scrollIntoViewIfNeeded();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1
    );
    expect(overflow).toBe(true);
  });

  test('process heading shows in English and Spanish', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#proceso')).toContainText(/How I work|Cómo trabajo/);
  });
});
```

- [ ] **Step 2: Ejecutar los E2E nuevos**

Run:
```bash
npx playwright test e2e/critical-flow.spec.ts -g "Mi proceso"
```
Expected: PASS (6 tests). Si algún selector no aparece, corregir el componente/CSS antes de continuar (no relajar la aserción).

- [ ] **Step 3: Commit**

```bash
git add e2e/critical-flow.spec.ts
git commit -m "test(e2e): cobertura de la seccion Mi proceso (a11y, i18n, reduced-motion, movil)"
```

---

## Task 15: Verificación final

**Files:** ninguno (verificación)

- [ ] **Step 1: Tipos + build de producción**

Run:
```bash
npm run lint && npm run build
```
Expected: ambos exit 0. La ruta `/` se prerenderiza con la sección incluida.

- [ ] **Step 2: Unit tests completos**

Run:
```bash
npx vitest run
```
Expected: verde, incluyendo `scrollProgressStore.test.ts`.

- [ ] **Step 3: E2E completo**

Run:
```bash
npx playwright test e2e/critical-flow.spec.ts
```
Expected: verde (flujo crítico existente + bloque "Mi proceso").

- [ ] **Step 4: Verificación manual de la experiencia (desktop)**

Run:
```bash
npm run dev
```
Comprobar en desktop (pointer fino, sin reduced-motion): al llegar a "Mi proceso" la sección se ancla, los 5 pasos hacen crossfade con el scroll, el objeto 3D rota/cambia de color, los dots reflejan el paso activo y permiten saltar; el skip-link aparece al tabular y lleva a Experience; con DevTools > Rendering > Emulate "prefers-reduced-motion" la sección pasa a tarjetas apiladas sin WebGL. Terminar con Ctrl+C.

- [ ] **Step 5: Commit final (si hubo ajustes en Step 4)**

```bash
git add -A
git commit -m "chore(proceso): ajustes finales tras verificacion manual"
```

---

## Notas de cierre

- **Snap desactivado** a propósito (scroll libre): evita el anti-patrón de "pin largo que parece colgado".
- **Póster** = gradiente CSS (sin `<img>`, sin CLS). Capturar un frame 3D real es mejora futura (fuera de alcance).
- El método i18n correcto es **`handleTranslation`** (el `handleTraslation` del `CLAUDE.md` es typo de la doc).
- Si al ejecutar se detecta que `.sr-only` ya existe en `cosmic.css`, omitir ese bloque (Task 10) para no duplicar.
