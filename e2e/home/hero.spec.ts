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
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('.hero-coin')).toBeVisible()
  })

  test('the hero contains exactly one canvas element (single 3D layer)', async ({ page }) => {
    const canvases = page.getByTestId('hero-section').locator('canvas')
    await expect(canvases).toHaveCount(1)
  })

  test('the coin canvas exposes an accessible role and label', async ({ page }) => {
    const coin = page.locator('.hero-coin').first()
    await expect(coin).toHaveAttribute('aria-label', /spin|girar/i)
  })
})
