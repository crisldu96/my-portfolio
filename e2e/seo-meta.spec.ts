import { test, expect } from '@playwright/test'

test.describe('SEO and Meta tags', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page title contains "Cristopher Palacios"', async ({ page }) => {
    await expect(page).toHaveTitle(/Cristopher Palacios/)
  })

  test('page title contains the role descriptor', async ({ page }) => {
    await expect(page).toHaveTitle(/Full Stack.*AI Developer/)
  })

  test('meta description exists and is not empty', async ({ page }) => {
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toBeTruthy()
    expect(description!.length).toBeGreaterThan(20)
  })

  test('meta description mentions Cristopher Palacios', async ({ page }) => {
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toMatch(/Cristopher Palacios/i)
  })

  test('OG title is set and contains "Cristopher Palacios"', async ({ page }) => {
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(ogTitle).toBeTruthy()
    expect(ogTitle).toMatch(/Cristopher Palacios/)
  })

  test('OG description is set and not empty', async ({ page }) => {
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content')
    expect(ogDesc).toBeTruthy()
    expect(ogDesc!.length).toBeGreaterThan(20)
  })

  test('OG type is "website"', async ({ page }) => {
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content')
    expect(ogType).toBe('website')
  })

  test('OG image is set', async ({ page }) => {
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    expect(ogImage).toBeTruthy()
  })

  test('canonical link tag points to the production domain', async ({ page }) => {
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toBeTruthy()
    expect(canonical).toMatch(/cristopherpalacios\.dev/)
  })

  test('html lang attribute is set to "en"', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('en')
  })

  test('robots meta allows indexing', async ({ page }) => {
    // Next.js renders robots directives as meta tags
    const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content')
    // If the tag exists, it must allow indexing
    if (robotsMeta) {
      expect(robotsMeta).toMatch(/index/i)
      expect(robotsMeta).not.toMatch(/noindex/i)
    }
    // Next.js 16 may use HTTP headers instead — in that case the meta tag may be absent
    // The absence of a noindex meta is also valid
  })

  test('JSON-LD Person schema is present on the page', async ({ page }) => {
    const scripts = await page.locator('script[type="application/ld+json"]').all()
    expect(scripts.length).toBeGreaterThanOrEqual(1)

    let hasPersonSchema = false
    for (const script of scripts) {
      const content = await script.textContent()
      if (content && content.includes('"@type":"Person"')) {
        hasPersonSchema = true
        break
      }
    }
    expect(hasPersonSchema).toBe(true)
  })

  test('JSON-LD Person schema contains the correct name', async ({ page }) => {
    const scripts = await page.locator('script[type="application/ld+json"]').all()
    let personSchema: Record<string, unknown> | null = null

    for (const script of scripts) {
      const content = await script.textContent()
      if (content && content.includes('"@type":"Person"')) {
        personSchema = JSON.parse(content)
        break
      }
    }

    expect(personSchema).not.toBeNull()
    expect(personSchema!.name).toBe('Cristopher Palacios')
  })

  test('JSON-LD WebSite schema is present', async ({ page }) => {
    const scripts = await page.locator('script[type="application/ld+json"]').all()
    let hasWebSiteSchema = false

    for (const script of scripts) {
      const content = await script.textContent()
      if (content && content.includes('"@type":"WebSite"')) {
        hasWebSiteSchema = true
        break
      }
    }
    expect(hasWebSiteSchema).toBe(true)
  })

  test('page has at least one H1 or H2 heading for SEO structure', async ({ page }) => {
    const h1Count = await page.locator('h1').count()
    const h2Count = await page.locator('h2').count()
    expect(h1Count + h2Count).toBeGreaterThan(0)
  })

  test('Twitter card meta is set', async ({ page }) => {
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content')
    expect(twitterCard).toBeTruthy()
  })
})
