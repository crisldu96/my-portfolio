import { test, expect } from '@playwright/test'

test.describe('Critical user flow - Visitor lands and converts', () => {
  test('home page loads with the hero value proposition visible', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const headline = page.getByRole('heading', { level: 1 })
    await expect(headline).toBeVisible()
    await expect(headline).toContainText(/scalable|escalables/i)

    const hero = page.getByTestId('hero-section')
    await expect(hero.getByText('Full Stack & AI Developer').first()).toBeVisible()
    await expect(hero.getByText(/5\+\s*(years|años)/i)).toBeVisible()
  })

  test('primary CTA "LET\'S TALK" links to the contact section', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const cta = page.getByRole('link', { name: /LET'S TALK|HABLEMOS/i })
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', /#contact$/)
  })

  test('secondary CTA "View projects" links to the projects section', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const cta = page.getByRole('link', { name: /View projects|Ver proyectos/i })
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', /#projects$/)
  })

  test('blog index loads and shows at least one post card', async ({ page }) => {
    const response = await page.goto('/blog')
    expect(response?.status()).toBe(200)

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('.blog-list-card').first()).toBeVisible()
  })

  test('about page loads with a heading', async ({ page }) => {
    const response = await page.goto('/about')
    expect(response?.status()).toBe(200)

    await expect(page.getByRole('heading', { level: 1, name: /Cristopher Palacios/i })).toBeVisible()
  })

  test('home page exposes a canonical URL for SEO', async ({ page }) => {
    await page.goto('/')
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute('href', /https?:\/\/.+/)
  })
})
