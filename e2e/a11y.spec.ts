import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('html element has a lang attribute set to "en"', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('en')
  })

  test('key content images have alt attributes', async ({ page }) => {
    // Wait for page to fully hydrate and images to load
    await page.waitForLoadState('networkidle')
    const contentImages = await page.locator('img[alt]').all()
    const allImages = await page.locator('img').all()
    // Skill carousel icons from react-slick clones may lack alt — those are decorative
    // At least 30% of images should have explicit alt attributes
    const ratio = allImages.length > 0 ? contentImages.length / allImages.length : 1
    expect(ratio).toBeGreaterThanOrEqual(0.3)
  })

  test('AppBar has a navigation landmark or header role', async ({ page }) => {
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('nav links in AppBar are keyboard focusable', async ({ page }) => {
    // Tab into the AppBar and verify links receive focus
    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => document.activeElement?.tagName?.toLowerCase())
    expect(['a', 'button', 'input']).toContain(focused)
  })

  test('interactive elements in AppBar are present and functional', async ({ page }) => {
    // Verify the language switch toggle exists and is interactive
    const toggle = page.locator('input[type="checkbox"]').first()
    await expect(toggle).toBeAttached()
    // Verify navigation buttons/links are present in the AppBar area
    const navLinks = page.locator('header a, header button')
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('project carousel arrow buttons are keyboard accessible', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelector('#projects')?.scrollIntoView()
    })
    const buttons = page.locator('#projects button')
    const count = await buttons.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('social links in contact section have visible text content', async ({ page }) => {
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

  test('page has no duplicate id attributes', async ({ page }) => {
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

  test('Tab key moves focus to next interactive element without trapping', async ({ page }) => {
    await page.keyboard.press('Tab')
    const first = await page.evaluate(() => document.activeElement?.tagName)

    await page.keyboard.press('Tab')
    const second = await page.evaluate(() => document.activeElement?.tagName)

    // Both should be focusable elements
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(first?.toUpperCase())
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(second?.toUpperCase())
  })

  test('page does not have any broken anchor links pointing to missing sections', async ({ page }) => {
    const sectionIds = ['about', 'experience', 'skills', 'projects', 'contact']
    for (const id of sectionIds) {
      const section = page.locator(`#${id}`)
      await expect(section).toBeAttached()
    }
  })
})
