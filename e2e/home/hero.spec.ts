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
    const hero = page.getByTestId('hero-section')
    await expect(hero.getByText(/5\+\s*(years|años)/i)).toBeVisible()
    await expect(hero.getByText(/10\+\s*(projects|proyectos)/i)).toBeVisible()
  })

  test('shows the tech stack chips', async ({ page }) => {
    for (const tech of ['React', 'Next.js', 'Node']) {
      await expect(page.getByText(tech, { exact: true }).first()).toBeVisible()
    }
    await expect(page.getByText(/^(AI|IA) \/ LLMs$/).first()).toBeVisible()
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
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    // 3D canvas initialisation takes longer under parallel load; allow extra time
    await expect(page.locator('.hero-coin')).toBeVisible({ timeout: 15000 })
  })

  test('the hero contains at most one canvas element (single 3D layer or fallback)', async ({ page }) => {
    // In headless CI (no GPU/WebGL) the coin renders a CSS fallback (.hero-coin-fallback)
    // with zero canvases. Locally with WebGL there's exactly one canvas. Both are valid.
    const canvases = page.getByTestId('hero-section').locator('canvas')
    const count = await canvases.count()
    expect(count).toBeLessThanOrEqual(1)
  })

  test('the coin exposes an accessible role and label', async ({ page }) => {
    const coin = page.locator('.hero-coin').first()
    // Match both the WebGL coin labels (spin/girar) and the no-WebGL fallback (monogram).
    await expect(coin).toHaveAttribute('aria-label', /spin|girar|monogram/i)
  })
})

test.describe('Home page - Reduced motion preference is respected', () => {
  test.use({ colorScheme: 'dark' })

  test('the coin does not auto-rotate when prefers-reduced-motion is set', async ({ browser }) => {
    const context = await browser.newContext({
      reducedMotion: 'reduce',
      viewport: { width: 1280, height: 720 },
    })
    const page = await context.newPage()
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const coinLabel = page.locator('.hero-coin').first()
    await expect(coinLabel).toBeVisible({ timeout: 15000 })
    // WebGL path: 'static' label when reduced-motion is set.
    // No-WebGL fallback path: 'monogram' label (the gate is irrelevant without animation).
    await expect(coinLabel).toHaveAttribute('aria-label', /static|monogram/i)

    await context.close()
  })

  test('the coin announces interactive label when reduced-motion is not requested', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    const coin = page.locator('.hero-coin').first()
    await expect(coin).toBeVisible({ timeout: 15000 })
    await expect(coin).toHaveAttribute('aria-label', /spin|girar|monogram/i)
  })
})

test.describe('Home page - Hero i18n switch', () => {
  test('shows Spanish headline accent when locale is Spanish', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    await page.evaluate(() => {
      const cfg = JSON.parse(localStorage.getItem('jp-config-ts') || '{}')
      cfg.locale = 'es'
      localStorage.setItem('jp-config-ts', JSON.stringify(cfg))
    })
    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    await expect(page.getByRole('heading', { level: 1 })).toContainText('rápidas y escalables')
    const hero = page.getByTestId('hero-section')
    await expect(hero.getByText(/10\+\s*proyectos/i)).toBeVisible()
    await expect(hero.getByText('IA / LLMs', { exact: true })).toBeVisible()
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
    const hero = page.getByTestId('hero-section')
    await expect(hero.getByText(/10\+\s*projects/i)).toBeVisible()
    await expect(hero.getByText('AI / LLMs', { exact: true })).toBeVisible()
  })
})
