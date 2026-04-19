import { test, expect } from '@playwright/test'

test.describe('Home page - Search engine discovers essential meta tags', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('the page title contains "Cristopher Palacios"', async ({ page }) => {
    await expect(page).toHaveTitle(/Cristopher Palacios/)
  })

  test('the page title contains the role descriptor', async ({ page }) => {
    await expect(page).toHaveTitle(/Full Stack.*AI Developer/)
  })

  test('the meta description exists and mentions Cristopher Palacios', async ({ page }) => {
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toBeTruthy()
    expect(description!.length).toBeGreaterThan(20)
    expect(description).toMatch(/Cristopher Palacios/i)
  })

  test('the html lang attribute is set to "en"', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('en')
  })

  test('the robots meta allows indexing', async ({ page }) => {
    const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content')
    if (robotsMeta) {
      expect(robotsMeta).toMatch(/index/i)
      expect(robotsMeta).not.toMatch(/noindex/i)
    }
  })

  test('the canonical link tag points to the production domain', async ({ page }) => {
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toBeTruthy()
    expect(canonical).toMatch(/cristopherpalacios\.dev/)
  })
})

test.describe('Home page - Open Graph tags are configured for social sharing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('the OG title is set and contains "Cristopher Palacios"', async ({ page }) => {
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(ogTitle).toBeTruthy()
    expect(ogTitle).toMatch(/Cristopher Palacios/)
  })

  test('the OG description is set and not empty', async ({ page }) => {
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content')
    expect(ogDesc).toBeTruthy()
    expect(ogDesc!.length).toBeGreaterThan(20)
  })

  test('the OG type is "website"', async ({ page }) => {
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content')
    expect(ogType).toBe('website')
  })

  test('the OG image is set', async ({ page }) => {
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    expect(ogImage).toBeTruthy()
  })

  test('the Twitter card meta is set', async ({ page }) => {
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content')
    expect(twitterCard).toBeTruthy()
  })
})

test.describe('Home page - Structured data (JSON-LD) is present for rich results', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('a JSON-LD Person schema is present on the page', async ({ page }) => {
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

  test('the Person schema contains the correct name', async ({ page }) => {
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

  test('a JSON-LD WebSite schema is present', async ({ page }) => {
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
})
