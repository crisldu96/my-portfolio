# Hero Redesign — Cosmic Cinematic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el contenido del hero del home con un layout outcome-focused (H1 con propuesta de valor, chips de prueba social, CTAs refinados) y consolidar el 3D a una única moneda con dos caras reales, eliminando la escena de cruces de fondo.

**Architecture:** Un solo `<Canvas>` (la moneda) en `HeroCoin.tsx`. El fondo deja de ser 3D y pasa a CSS (degradado + ~7 estrellas). `HeroOverlay.tsx` se reescribe con la nueva jerarquía: eyebrow → H1 con propuesta de valor → descripción → chips → CTAs. Copy en `text-content-{en,es}.json`. Reduced-motion respetado.

**Tech Stack:** Next.js 16 App Router · React 19 · MUI v9 · `@react-three/fiber` + Three.js · Playwright (E2E) · lodash i18n via `useLanguage()` · GSAP/Lenis (no cambian)

**Reference spec:** [docs/superpowers/specs/2026-05-27-hero-redesign-design.md](../specs/2026-05-27-hero-redesign-design.md)

---

## File Structure

| Path | Acción | Responsabilidad |
|---|---|---|
| `src/data/text-content-en.json` | Modify | Nuevas claves `heroSection.*` para copy EN |
| `src/data/text-content-es.json` | Modify | Idem ES |
| `src/components/cosmic/hero/HeroOverlay.tsx` | Modify (reescribe el bloque de contenido) | Eyebrow, H1 con accent, descripción, chips, CTAs |
| `src/components/cosmic/hero/HeroSection.tsx` | Modify | Quitar `HeroScene`, agregar fondo CSS (gradiente + estrellas), halo |
| `src/components/cosmic/hero/HeroCoin.tsx` | Modify | Generar textura monograma (canvas), rim light, gating reduced-motion, fallback no-WebGL |
| `src/styles/cosmic.css` | Modify | `.hero-stars`, `.hero-glow-halo`, `.hero-eyebrow`, `.hero-chip`, `.hero-chip--accent`, `.hero-coin-fallback`, media query mobile |
| `src/components/cosmic/hero/HeroScene.tsx` | **Delete** | Ya no se usa |
| `src/components/cosmic/hero/CrossShape.tsx` | **Delete** | Solo lo usaba HeroScene |
| `e2e/home/hero.spec.ts` | Create | E2E del hero (contenido, interacción, i18n, a11y) |

---

## Task 1: Añadir claves i18n al diccionario

**Files:**

- Modify: `src/data/text-content-en.json`
- Modify: `src/data/text-content-es.json`

- [ ] **Step 1: Añadir claves nuevas a EN**

Editar `src/data/text-content-en.json`. Dentro del objeto raíz, asegurar que el bloque `heroSection` (créalo si no existe) contiene exactamente estas claves:

```json
"heroSection": {
  "eyebrow": "Cristopher Palacios",
  "role": "Full Stack & AI Developer",
  "available": "AVAILABLE FOR WORK",
  "headlinePart1": "I build",
  "headlineAccent": "fast, scalable web apps",
  "headlinePart2": ", and AI-powered products.",
  "description": "I work with teams and startups around the world, turning ideas into digital products that scale.",
  "chipYears": "5+ years",
  "chipProjects": "10+ projects",
  "letsTalk": "LET'S TALK",
  "viewProjects": "View projects",
  "scrollDown": "SCROLL TO EXPLORE",
  "coinHint": "Click or drag to spin"
}
```

Si ya existe `heroSection`, borrar las claves obsoletas si están: `greeting`, `name`, `surname` (la spec las marca como removibles).

- [ ] **Step 2: Añadir claves nuevas a ES**

Editar `src/data/text-content-es.json`. Mismo bloque:

```json
"heroSection": {
  "eyebrow": "Cristopher Palacios",
  "role": "Full Stack & AI Developer",
  "available": "DISPONIBLE PARA TRABAJAR",
  "headlinePart1": "Construyo apps web",
  "headlineAccent": "rápidas y escalables",
  "headlinePart2": ", y productos con IA.",
  "description": "Trabajo con equipos y startups en todo el mundo, transformando ideas en productos digitales que escalan.",
  "chipYears": "5+ años",
  "chipProjects": "10+ proyectos",
  "letsTalk": "HABLEMOS",
  "viewProjects": "Ver proyectos",
  "scrollDown": "DESPLAZAR PARA EXPLORAR",
  "coinHint": "Clic o arrastrá para girar"
}
```

- [ ] **Step 3: Verificar JSON parsea correctamente**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/data/text-content-en.json','utf8'));JSON.parse(require('fs').readFileSync('src/data/text-content-es.json','utf8'));console.log('OK')"`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add src/data/text-content-en.json src/data/text-content-es.json
git commit -m "feat(hero): add new i18n keys for redesigned hero copy"
```

---

## Task 2: Escribir tests E2E del contenido del hero (TDD red)

**Files:**

- Create: `e2e/home/hero.spec.ts`

- [ ] **Step 1: Crear el archivo de test fallando**

```ts
// e2e/home/hero.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Home page - User lands on the hero section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('shows the eyebrow with the developer name', async ({ page }) => {
    await expect(page.getByText('Cristopher Palacios', { exact: true }).first()).toBeVisible()
  })

  test('shows a value-proposition H1 mentioning scalable web apps', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).toContainText(/scalable|escalables/i)
  })

  test('shows the social-proof chips for years and projects', async ({ page }) => {
    await expect(page.getByText(/5\+\s*(years|años)/i)).toBeVisible()
    await expect(page.getByText(/10\+\s*(projects|proyectos)/i)).toBeVisible()
  })

  test('shows the tech stack chips', async ({ page }) => {
    for (const tech of ['React', 'Next.js', 'Node', 'IA / LLMs']) {
      await expect(page.getByText(tech, { exact: true }).first()).toBeVisible()
    }
  })

  test('shows the role pill and the AVAILABLE FOR WORK badge', async ({ page }) => {
    await expect(page.getByText('Full Stack & AI Developer').first()).toBeVisible()
    await expect(page.getByText(/AVAILABLE FOR WORK|DISPONIBLE PARA TRABAJAR/i)).toBeVisible()
  })

  test('exposes the primary CTA linking to the contact anchor', async ({ page }) => {
    const cta = page.getByRole('link', { name: /LET'S TALK|HABLEMOS/i })
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', /#contact$/)
  })

  test('exposes the secondary CTA linking to the projects anchor', async ({ page }) => {
    const cta = page.getByRole('link', { name: /View projects|Ver proyectos/i })
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', /#projects$/)
  })
})

test.describe('Home page - 3D coin renders as the focal object', () => {
  test('the hero contains exactly one canvas element (single 3D layer)', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const heroCanvases = page.locator('.hero-overlay').locator('xpath=ancestor::*[1]').locator('canvas')
    await expect(heroCanvases).toHaveCount(1)
  })

  test('the coin canvas exposes an accessible role and label', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const coin = page.locator('.hero-coin')
    await expect(coin).toHaveAttribute('aria-label', /spin|girar/i)
  })
})
```

- [ ] **Step 2: Correr los tests y confirmar que fallan**

Run: `npx playwright test e2e/home/hero.spec.ts --project=chromium --reporter=list`
Expected: la mayoría falla (H1 no contiene "escalables", chips no existen, etc.). Confirmá visualmente que los fallos son por contenido faltante, no por error de configuración.

- [ ] **Step 3: Commit el test (rojo, intencional)**

```bash
git add e2e/home/hero.spec.ts
git commit -m "test(hero): add failing E2E coverage for redesigned hero"
```

---

## Task 3: Reescribir `HeroOverlay.tsx` con la nueva jerarquía

**Files:**

- Modify: `src/components/cosmic/hero/HeroOverlay.tsx`

- [ ] **Step 1: Reemplazar el bloque del overlay completo**

Reemplazar el archivo completo con:

```tsx
'use client';

import Link from '@mui/material/Link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import PillButton from '../PillButton';
import { cosmic } from '@/themes/cosmicTokens';
import useLanguage from '@/hooks/useLanguage';

const HeroCoin = dynamic(() => import('./HeroCoin'), { ssr: false });

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
});

export default function HeroOverlay() {
  const { handleTranslation } = useLanguage();

  return (
    <div className="hero-overlay">
      <div className="hero-overlay-top">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp(0.1)}
          className="hero-role-pill"
        >
          <span className="hero-role-dot" />
          <span className="hero-role-text">
            {handleTranslation<string>('heroSection.role') || 'Full Stack & AI Developer'}
          </span>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp(0.15)}
          className="hero-avail-badge"
        >
          <div className="hero-avail-dot" />
          <span className="hero-avail-text" suppressHydrationWarning>
            {handleTranslation<string>('heroSection.available') || 'AVAILABLE FOR WORK'}
          </span>
        </motion.div>
      </div>

      <div className="hero-content" style={{ pointerEvents: 'auto' }}>
        <div className="hero-text">
          <motion.span
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.25)}
            className="hero-eyebrow"
          >
            {handleTranslation<string>('heroSection.eyebrow') || 'Cristopher Palacios'}
          </motion.span>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.4)}
            className="hero-headline"
            aria-label="Cristopher Palacios — Full Stack & AI Developer"
          >
            <span className="hero-headline__lead">
              {handleTranslation<string>('heroSection.headlinePart1') || 'I build'}
            </span>{' '}
            <span className="hero-headline__accent">
              {handleTranslation<string>('heroSection.headlineAccent') || 'fast, scalable web apps'}
            </span>
            <span className="hero-headline__tail">
              {handleTranslation<string>('heroSection.headlinePart2') || ', and AI-powered products.'}
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.55)}
            className="hero-description"
          >
            {handleTranslation<string>('heroSection.description') ||
              'I work with teams and startups around the world, turning ideas into digital products that scale.'}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.62)}
            className="hero-chips"
          >
            <span className="hero-chip hero-chip--accent">
              {handleTranslation<string>('heroSection.chipYears') || '5+ years'}
            </span>
            <span className="hero-chip hero-chip--accent">
              {handleTranslation<string>('heroSection.chipProjects') || '10+ projects'}
            </span>
            <span className="hero-chip">React</span>
            <span className="hero-chip">Next.js</span>
            <span className="hero-chip">Node</span>
            <span className="hero-chip">IA / LLMs</span>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.7)}
            style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginTop: 16 }}
          >
            <PillButton
              variant="contained"
              component={Link}
              href="/#contact"
              size="small"
              sx={{
                fontSize: '0.8125rem',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700,
                py: 1.25,
                px: 3.5,
              }}
            >
              {handleTranslation<string>('heroSection.letsTalk') || "LET'S TALK"}
            </PillButton>
            <PillButton
              variant="outlined"
              component={Link}
              href="/#projects"
              size="small"
              sx={{
                fontSize: '0.8125rem',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 500,
                py: 1.25,
                px: 3.5,
              }}
            >
              {handleTranslation<string>('heroSection.viewProjects') || 'View projects'}
            </PillButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: 'auto', position: 'relative' }}
        >
          <div className="hero-glow-halo" aria-hidden />
          <HeroCoin />
          <span className="hero-coin-hint" aria-hidden>
            {handleTranslation<string>('heroSection.coinHint') || 'Click or drag to spin'}
          </span>
        </motion.div>
      </div>

      <div
        className="hero-bottom"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          pointerEvents: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 1,
              height: 40,
              background: `linear-gradient(to bottom, ${cosmic.cyan}, transparent)`,
              opacity: 0.5,
            }}
          />
          <span className="hero-scroll-text">
            {handleTranslation<string>('heroSection.scrollDown') || 'SCROLL TO EXPLORE'}
          </span>
        </div>
      </div>
    </div>
  );
}
```

Cambios clave vs el archivo previo: `hero-greeting` → `hero-eyebrow`; el `<motion.h1>` ahora tiene tres `<span>` con clases `__lead/__accent/__tail`; nuevo bloque `hero-chips`; halo y hint añadidos al lado de la moneda.

- [ ] **Step 2: Verificar que el componente compila (sin tests todavía)**

Run: `npx tsc --noEmit`
Expected: 0 errores (los previos del proyecto ya fueron arreglados).

- [ ] **Step 3: Commit**

```bash
git add src/components/cosmic/hero/HeroOverlay.tsx
git commit -m "feat(hero): rewrite overlay with eyebrow, value-prop H1, chips and refined CTAs"
```

---

## Task 4: CSS — eyebrow, headline, chips, halo, hint y fallback

**Files:**

- Modify: `src/styles/cosmic.css`

- [ ] **Step 1: Añadir bloque de estilos del hero al final del archivo**

Append al final de `src/styles/cosmic.css`:

```css
/* ============================================================
   Hero redesign — Cosmic Cinematic
   ============================================================ */

.hero-eyebrow {
  display: inline-block;
  color: #7f9bd6;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 10px;
  font-family: var(--font-jetbrains-mono), monospace;
}

.hero-headline {
  margin: 0;
  font-family: var(--font-space-grotesk), sans-serif;
  font-size: clamp(1.85rem, 4.4vw, 3.25rem);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.02em;
  color: #F0F4FF;
}

.hero-headline__lead,
.hero-headline__tail {
  color: #F0F4FF;
}

.hero-headline__accent {
  background: linear-gradient(135deg, #3B82F6, #7C3AED);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-description {
  color: #9fb0d0;
  font-size: 0.95rem;
  line-height: 1.65;
  margin-top: 14px;
  max-width: 28rem;
}

.hero-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.hero-chip {
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.11);
  color: #cfe0ff;
  font-size: 0.7rem;
  font-family: var(--font-jetbrains-mono), monospace;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.hero-chip--accent {
  background: rgba(0, 212, 255, 0.08);
  border-color: rgba(0, 212, 255, 0.28);
  color: #a8e7ff;
}

.hero-glow-halo {
  position: absolute;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.18) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
}

.hero-coin-hint {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  color: #6f8fd6;
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-family: var(--font-jetbrains-mono), monospace;
  white-space: nowrap;
  pointer-events: none;
}

.hero-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(1.5px 1.5px at 14% 22%, rgba(255,255,255,0.7), transparent 60%),
    radial-gradient(1px 1px at 24% 67%, rgba(159,196,255,0.65), transparent 60%),
    radial-gradient(1px 1px at 47% 81%, rgba(255,255,255,0.55), transparent 60%),
    radial-gradient(1.5px 1.5px at 60% 35%, rgba(174,233,255,0.6), transparent 60%),
    radial-gradient(1px 1px at 78% 71%, rgba(255,255,255,0.45), transparent 60%),
    radial-gradient(1.2px 1.2px at 88% 18%, rgba(159,196,255,0.65), transparent 60%),
    radial-gradient(1px 1px at 33% 12%, rgba(255,255,255,0.5), transparent 60%);
  opacity: 0.85;
}

.hero-coin-fallback {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 32% 28%, #2a3f7a, #0b1430 80%);
  border: 2px solid rgba(0, 212, 255, 0.6);
  box-shadow: 0 0 60px rgba(0, 212, 255, 0.45), inset 0 0 26px rgba(0, 212, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-space-grotesk), sans-serif;
  font-weight: 900;
  font-size: 60px;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(135deg, #3B82F6, #7C3AED);
}

@media (max-width: 768px) {
  .hero-glow-halo { width: 220px; height: 220px; }
  .hero-coin-hint { display: none; }
  .hero-description { max-width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-stars { opacity: 0.6; }
}
```

- [ ] **Step 2: Verificar visualmente en el navegador (no hay tests para puro CSS)**

Run: `npm run dev` y abrir `http://localhost:3000`.
Verificar a ojo: el H1 muestra el "accent" con gradiente azul-violeta, chips visibles, no hay overflow horizontal en chips, halo cyan se ve detrás de la moneda. (La tarea siguiente borrará el fondo de cruces y validará el contenedor.)

- [ ] **Step 3: Commit**

```bash
git add src/styles/cosmic.css
git commit -m "style(hero): add eyebrow, headline, chips, halo and fallback styles"
```

---

## Task 5: Eliminar HeroScene del fondo y reemplazar por CSS

**Files:**

- Modify: `src/components/cosmic/hero/HeroSection.tsx`
- Delete: `src/components/cosmic/hero/HeroScene.tsx`
- Delete: `src/components/cosmic/hero/CrossShape.tsx`

- [ ] **Step 1: Reescribir HeroSection.tsx sin el canvas de fondo**

Reemplazar el archivo completo con:

```tsx
'use client';

import HeroOverlay from './HeroOverlay';

export default function HeroSection() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 600,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 70% 50%, #122046 0%, #060912 75%)',
      }}
    >
      <div className="hero-stars" aria-hidden />
      <HeroOverlay />
    </div>
  );
}
```

- [ ] **Step 2: Borrar archivos huérfanos**

```bash
rm src/components/cosmic/hero/HeroScene.tsx
rm src/components/cosmic/hero/CrossShape.tsx
```

- [ ] **Step 3: Verificar que nada importa los archivos borrados**

Run: `npx tsc --noEmit`
Expected: 0 errores. Si aparece error de import roto, buscar y arreglar referencias.

- [ ] **Step 4: Correr el test del "single canvas" del Task 2**

Run: `npx playwright test e2e/home/hero.spec.ts -g "single 3D layer" --project=chromium --reporter=list`
Expected: PASS (solo queda 1 canvas en el hero — el de la moneda).

- [ ] **Step 5: Commit**

```bash
git add src/components/cosmic/hero/HeroSection.tsx
git rm src/components/cosmic/hero/HeroScene.tsx src/components/cosmic/hero/CrossShape.tsx
git commit -m "refactor(hero): drop 3D cross background; replace with CSS gradient + stars"
```

---

## Task 6: Moneda refinada — textura monograma y rim light

**Files:**

- Modify: `src/components/cosmic/hero/HeroCoin.tsx`

- [ ] **Step 1: Reescribir HeroCoin.tsx con monograma generado y rim light**

Reemplazar el archivo completo con:

```tsx
'use client';

import { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useLoader, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

interface CoinProps {
  frontSrc: string;
  reducedMotion: boolean;
}

function createMonogramTexture(size = 512): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const bg = ctx.createRadialGradient(size * 0.32, size * 0.28, 10, size / 2, size / 2, size / 2);
  bg.addColorStop(0, '#2a3f7a');
  bg.addColorStop(1, '#0b1430');
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#3B82F6');
  grad.addColorStop(1, '#7C3AED');
  ctx.fillStyle = grad;
  ctx.font = `900 ${size * 0.55}px 'Space Grotesk', system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CP', size / 2, size / 2 + size * 0.02);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Coin({ frontSrc, reducedMotion }: CoinProps) {
  const groupRef = useRef<THREE.Group>(null);
  const front = useLoader(THREE.TextureLoader, frontSrc);
  const back = useMemo(() => createMonogramTexture(512), []);

  const [spinVel, setSpinVel] = useState(0);
  const dragging = useRef(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const targetRot = useRef({ x: 0, y: 0 });
  const idleFloat = useRef(0);

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    idleFloat.current += dt;

    if (!dragging.current) {
      targetRot.current.y += spinVel * dt;
      setSpinVel((v) => v * Math.pow(0.18, dt));
      if (!reducedMotion) {
        targetRot.current.y += 0.25 * dt;
        targetRot.current.x += Math.sin(idleFloat.current * 0.6) * 0.002;
      }
    }

    groupRef.current.rotation.y += (targetRot.current.y - groupRef.current.rotation.y) * Math.min(1, dt * 10);
    groupRef.current.rotation.x += (targetRot.current.x - groupRef.current.rotation.x) * Math.min(1, dt * 10);
    groupRef.current.position.y = reducedMotion ? 0 : Math.sin(idleFloat.current * 1.4) * 0.05;
  });

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    dragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current || !lastPointer.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    targetRot.current.y += dx * 0.01;
    targetRot.current.x += dy * 0.008;
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return;
    dragging.current = false;
    lastPointer.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSpinVel((v) => v + 14);
  };

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={onClick}
    >
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[1, 1, 0.14, 80]} />
        <meshStandardMaterial color="#0D1530" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.0701]}>
        <circleGeometry args={[0.96, 72]} />
        <meshStandardMaterial map={front} metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, -0.0701]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.96, 72]} />
        <meshStandardMaterial map={back} metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.071]}>
        <ringGeometry args={[0.96, 1.0, 80]} />
        <meshStandardMaterial color="#00D4FF" emissive="#00D4FF" emissiveIntensity={0.4} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, -0.071]} rotation={[0, Math.PI, 0]}>
        <ringGeometry args={[0.96, 1.0, 80]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.35} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

function useWebGLSupported(): boolean {
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

export default function HeroCoin({ frontSrc = '/assets/images/header-1.png' }: Partial<{ frontSrc: string }>) {
  const reducedMotion = usePrefersReducedMotion();
  const webglOk = useWebGLSupported();

  if (!webglOk) {
    return (
      <div
        className="hero-coin hero-coin-fallback"
        role="img"
        aria-label="Cristopher Palacios — monogram"
      >
        CP
      </div>
    );
  }

  return (
    <div
      className="hero-coin"
      role="img"
      aria-label={reducedMotion ? 'Cristopher Palacios coin (static)' : 'Cristopher Palacios coin — click or drag to spin'}
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 32 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 3, 5]} intensity={1.4} color="#F0F4FF" />
        <directionalLight position={[-3, 2, 2]} intensity={0.8} color="#00D4FF" />
        <pointLight position={[0, -2, 3]} intensity={0.6} color="#7C3AED" />
        <directionalLight position={[-2, -1.5, -2]} intensity={0.5} color="#00D4FF" />
        <Suspense fallback={null}>
          <Coin frontSrc={frontSrc} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

Cambios respecto al archivo previo: la cara reversa ya no es `backSrc` (una imagen igual a la del frente) sino una textura generada con `createMonogramTexture`. Se agrega rim light en `[-2, -1.5, -2]` cyan, gating de reduced-motion (no auto-rota ni flota), detección de WebGL y fallback CSS.

- [ ] **Step 2: Verificar build**

Run: `npx tsc --noEmit && echo OK`
Expected: `OK`

- [ ] **Step 3: Correr los tests de a11y de la moneda**

Run: `npx playwright test e2e/home/hero.spec.ts -g "accessible role and label" --project=chromium --reporter=list`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/cosmic/hero/HeroCoin.tsx
git commit -m "feat(hero-coin): generate monogram texture for back face, add rim light, reduced-motion + WebGL fallback"
```

---

## Task 7: Correr la suite completa de tests del hero

**Files:** (sin cambios de código; verificación)

- [ ] **Step 1: Correr todos los tests del hero en chromium**

Run: `npx playwright test e2e/home/hero.spec.ts --project=chromium --reporter=list`
Expected: TODOS PASAN (los 9 tests definidos en Task 2).

Si alguno falla:

- Test de chips de prueba social → revisar Task 1 (claves i18n) y Task 3 (markup en HeroOverlay)
- Test de role pill / availability → revisar Task 3 (estructura no debe haberse roto)
- Test "single canvas" → revisar Task 5 (HeroScene/CrossShape borrados)

Arreglar y volver a correr hasta que todos pasen.

- [ ] **Step 2: Correr también en mobile-chrome (Pixel 5) para validar viewport pequeño**

Run: `npx playwright test e2e/home/hero.spec.ts --project=mobile-chrome --reporter=list`
Expected: TODOS PASAN. Si el layout apilado provoca overflow, revisar CSS de Task 4 (`.hero-description max-width: 100%` en mobile) y posibles `flex-wrap` faltantes.

- [ ] **Step 3: Commit (si hubo correcciones en CSS o markup)**

```bash
git add -A
git commit -m "fix(hero): adjust mobile layout and chip overflow"
```

(Si no hubo cambios, omitir este commit.)

---

## Task 8: Test de reduced-motion (gate del auto-spin de la moneda)

**Files:**

- Modify: `e2e/home/hero.spec.ts` (añade describe)

- [ ] **Step 1: Añadir bloque al final de hero.spec.ts**

Append al final del archivo `e2e/home/hero.spec.ts`:

```ts
test.describe('Home page - Reduced motion preference is respected', () => {
  test.use({ colorScheme: 'dark' })

  test('the coin does not auto-rotate when prefers-reduced-motion is set', async ({ browser }) => {
    const context = await browser.newContext({
      reducedMotion: 'reduce',
      viewport: { width: 1280, height: 720 },
    })
    const page = await context.newPage()
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const coinLabel = page.locator('.hero-coin').first()
    await expect(coinLabel).toHaveAttribute('aria-label', /static/i)

    await context.close()
  })

  test('the coin announces interactive label when reduced-motion is not requested', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const coin = page.locator('.hero-coin').first()
    await expect(coin).toHaveAttribute('aria-label', /spin|girar/i)
  })
})
```

- [ ] **Step 2: Correr el bloque nuevo**

Run: `npx playwright test e2e/home/hero.spec.ts -g "Reduced motion" --project=chromium --reporter=list`
Expected: AMBOS PASAN.

- [ ] **Step 3: Commit**

```bash
git add e2e/home/hero.spec.ts
git commit -m "test(hero): cover reduced-motion gating of coin auto-rotation"
```

---

## Task 9: Test de i18n (toggle EN/ES en el hero)

**Files:**

- Modify: `e2e/home/hero.spec.ts`

- [ ] **Step 1: Identificar el selector del toggle de idioma**

Run: `grep -rEn "locale|setLocale|language|idioma" src/components/layout/ src/components/cosmic/ 2>/dev/null | head -20`
Expected: encontrar el control de idioma (probablemente un IconButton o Switch dentro del header). Anotar el `aria-label` o data-testid actual. Si no existe selector accesible, usar el espec ya existente `e2e/home/theme-language.spec.ts` como referencia para ver cómo se cambia idioma allí.

- [ ] **Step 2: Añadir bloque al final de hero.spec.ts replicando el patrón del proyecto**

Append al final de `e2e/home/hero.spec.ts`:

```ts
test.describe('Home page - Hero i18n switch', () => {
  test('shows Spanish headline accent when locale is Spanish', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Reproducir el flujo de cambio de idioma usado en theme-language.spec.ts.
    // Si el proyecto persiste locale en localStorage bajo 'jp-config-ts', preparar el storage:
    await page.evaluate(() => {
      const cfg = JSON.parse(localStorage.getItem('jp-config-ts') || '{}')
      cfg.locale = 'es'
      localStorage.setItem('jp-config-ts', JSON.stringify(cfg))
    })
    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    await expect(page.getByRole('heading', { level: 1 })).toContainText('rápidas y escalables')
    await expect(page.getByText(/10\+\s*proyectos/i)).toBeVisible()
  })

  test('shows English headline accent when locale is English', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    await page.evaluate(() => {
      const cfg = JSON.parse(localStorage.getItem('jp-config-ts') || '{}')
      cfg.locale = 'en'
      localStorage.setItem('jp-config-ts', JSON.stringify(cfg))
    })
    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    await expect(page.getByRole('heading', { level: 1 })).toContainText('fast, scalable')
    await expect(page.getByText(/10\+\s*projects/i)).toBeVisible()
  })
})
```

- [ ] **Step 3: Correr el bloque**

Run: `npx playwright test e2e/home/hero.spec.ts -g "Hero i18n" --project=chromium --reporter=list`
Expected: AMBOS PASAN. Si fallan por hidratación tardía, aumentar a `await page.waitForLoadState('networkidle')`.

- [ ] **Step 4: Commit**

```bash
git add e2e/home/hero.spec.ts
git commit -m "test(hero): cover EN/ES locale switch in headline and chips"
```

---

## Task 10: Verificación final — build, tsc, suite completa

**Files:** (sin cambios de código)

- [ ] **Step 1: TypeScript estricto**

Run: `npx tsc --noEmit`
Expected: 0 errores.

- [ ] **Step 2: Build de producción**

Run: `npm run build`
Expected: `Compiled successfully` + 14 rutas prerenderizadas (o el número que tenga el proyecto al momento). Sin errores.

- [ ] **Step 3: Verificación visual en el navegador**

Run: `npm run start` (sirve el build) y abrir `http://localhost:3000`.
Check manual:

1. El H1 muestra "Construyo apps web rápidas y escalables, y productos con IA." (o EN equivalente).
2. Las palabras `rápidas y escalables` (o `fast, scalable`) tienen gradiente azul-violeta.
3. Chips visibles: `5+ años · 10+ proyectos · React · Next.js · Node · IA / LLMs`.
4. Moneda gira sola lento; clic la acelera; arrastrá funciona; al frente se ve la foto, al reverso "CP" con gradiente.
5. Botón `HABLEMOS` scrollea a `#contact`; `Ver proyectos` a `#projects`.
6. Resize del navegador a ~390px: layout apilado, sin overflow horizontal, chips se envuelven.
7. DevTools → Rendering → Emulate CSS media `prefers-reduced-motion: reduce`. La moneda deja de auto-rotar. Click sigue funcionando.

- [ ] **Step 4: Suite E2E completa**

Run: `npx playwright test --project=chromium e2e/home/hero.spec.ts --reporter=list`
Expected: TODOS PASAN.

Run: `npx playwright test --project=mobile-chrome e2e/home/hero.spec.ts --reporter=list`
Expected: TODOS PASAN.

- [ ] **Step 5: No-regresión de otras specs del home**

Run: `npx playwright test --project=chromium e2e/home/ --reporter=list`
Expected: TODOS PASAN. Si algún test previo del home rompe por el cambio de markup, evaluar si se rompió por una asunción legítima o por un selector obsoleto.

- [ ] **Step 6: Commit final (si hubo ajustes menores)**

```bash
git add -A
git commit -m "chore(hero): finalize redesign — tsc, build and full e2e green"
```

---

## Self-Review

**Spec coverage check** (cada requisito de la spec mapea a una tarea):

| Requisito de la spec | Tarea |
|---|---|
| Headline outcome-focused con accent gradiente | Task 3 + Task 4 |
| Eyebrow con el nombre | Task 3 + Task 4 |
| Descripción debajo del H1 | Task 3 + Task 4 |
| Chips: 5+ años, 10+ proyectos, stack | Task 3 + Task 4 + Task 2 (E2E) |
| CTAs: HABLEMOS + Ver proyectos | Task 3 + Task 2 (E2E) |
| Eliminar HeroScene + CrossShape | Task 5 |
| Fondo CSS (gradiente + estrellas) | Task 4 + Task 5 |
| Halo cyan (CSS, 320/220px) | Task 4 |
| Moneda: foto + monograma | Task 6 |
| Rim light cyan en `[-2,-1.5,-2]` | Task 6 |
| Auto-rotación gated por reduced-motion | Task 6 + Task 8 |
| Click/drag conservados | Task 6 |
| Fallback no-WebGL | Task 6 + Task 4 (CSS) |
| `aria-label` en moneda | Task 6 + Task 2 (E2E) |
| `aria-label` del H1 | Task 3 |
| i18n EN + ES de todo el copy | Task 1 + Task 9 |
| Mobile: layout apilado, halo más chico, hint oculto | Task 4 + Task 7 |
| Borrar claves obsoletas si presentes | Task 1 |

Sin requisitos de spec sin cubrir.

**Placeholder scan:** sin `TBD`, sin `TODO`, sin "implement later", todos los pasos tienen comando concreto y código.

**Type consistency:** `usePrefersReducedMotion`, `useWebGLSupported`, `createMonogramTexture` y `Coin` están definidos antes de su uso en `HeroCoin`. El prop `reducedMotion: boolean` se pasa explícito. El `useLoader` solo carga `frontSrc` (el back ya no es imagen). `aria-label` consistente entre Task 6 (implementación) y Task 8 (test que asserta `/static/i`).

**Ambiguity check:** todos los selectores CSS y nombres de variables coinciden 1-a-1 entre tasks. Los tamaños (320/220 halo, 200×200 fallback, 0.55 emissive cyan, 0.4 emissive cyan ring) coinciden con la spec.

Plan completo.

---

## Execution Handoff

**Plan completo y guardado en `docs/superpowers/plans/2026-05-27-hero-redesign.md`. Dos opciones de ejecución:**

**1. Subagent-Driven (recomendado)** — Despacho un subagente fresco por tarea, reviso entre tareas, iteración rápida y context limpio.

**2. Inline Execution** — Ejecuto las tareas en esta sesión usando `executing-plans`, batch con checkpoints para revisión.

**¿Cuál preferís?**
