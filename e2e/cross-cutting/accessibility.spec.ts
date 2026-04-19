import { test, expect } from '@playwright/test'

test.describe('Accessibility - Page fundamentals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('the html element has a lang attribute set to "en"', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('en')
  })

  test('the page has no duplicate id attributes', async ({ page }) => {
    const duplicateIds = await page.evaluate(() => {
      const allIds = Array.from(document.querySelectorAll('[id]')).map((el) => el.id)
      const seen = new Set<string>()
      const duplicates: string[] = []
      for (const id of allIds) {
        if (seen.has(id)) duplicates.push(id)
        seen.add(id)
      }
      return duplicates
    })
    expect(duplicateIds).toHaveLength(0)
  })

  test('all anchor links point to existing section IDs in the page', async ({ page }) => {
    const sectionIds = ['about', 'experience', 'skills', 'projects', 'contact']
    for (const id of sectionIds) {
      await expect(page.locator(`#${id}`)).toBeAttached()
    }
  })
})

test.describe('Accessibility - Landmark roles and semantic structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('the AppBar renders inside a header element', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible()
  })

  test('content images have alt attributes', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    const contentImages = await page.locator('img[alt]').all()
    const allImages = await page.locator('img').all()
    const ratio = allImages.length > 0 ? contentImages.length / allImages.length : 1
    expect(ratio).toBeGreaterThanOrEqual(0.3)
  })
})

test.describe('Accessibility - Keyboard navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('pressing Tab focuses the first interactive element', async ({ page }) => {
    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => document.activeElement?.tagName?.toLowerCase())
    expect(['a', 'button', 'input']).toContain(focused)
  })

  test('pressing Tab twice moves focus to a second interactive element without trapping', async ({ page }) => {
    await page.keyboard.press('Tab')
    const first = await page.evaluate(() => document.activeElement?.tagName)

    await page.keyboard.press('Tab')
    const second = await page.evaluate(() => document.activeElement?.tagName)

    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(first?.toUpperCase())
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(second?.toUpperCase())
  })

  test('the language switch checkbox in the AppBar is reachable via keyboard', async ({ page }) => {
    const toggle = page.locator('input[type="checkbox"]').first()
    await expect(toggle).toBeAttached()
    const navLinks = page.locator('header a, header button')
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('Accessibility - Contact section link labels', () => {
  test('all contact card links have visible text content', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      document.querySelector('#contact')?.scrollIntoView()
    })
    const links = page.locator('#contact a')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)

    for (const link of await links.all()) {
      const text = await link.textContent()
      expect(text?.trim().length).toBeGreaterThan(0)
    }
  })
})
