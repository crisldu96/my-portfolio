import { test, expect } from '@playwright/test'

test.describe('Home page - User sees the default language (English)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('the language switch toggle is present in the AppBar', async ({ page }) => {
    const toggle = page.locator('header input[type="checkbox"]')
    await expect(toggle).toBeAttached()
  })

  test('the AppBar shows English labels by default', async ({ page }) => {
    const header = page.locator('header')
    await expect(header).toContainText('About Me')
    await expect(header).toContainText('Experience')
    await expect(header).toContainText('Skills')
  })
})

test.describe('Home page - User switches the language to Spanish', () => {
  test.skip(({ isMobile }) => isMobile, 'Language toggle is hidden on mobile')

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('clicking the language toggle changes the AppBar text to Spanish', async ({ page }) => {
    const toggle = page.locator('header input[type="checkbox"]')
    await toggle.click()
    await expect(page.locator('header')).toContainText('Sobre M\u00ed')
  })

  test('the Spanish locale is stored in localStorage under "jp-config-ts"', async ({ page }) => {
    const toggle = page.locator('header input[type="checkbox"]')
    await toggle.click()

    const stored = await page.evaluate(() => {
      const raw = localStorage.getItem('jp-config-ts')
      return raw ? JSON.parse(raw) : null
    })

    expect(stored).not.toBeNull()
    expect(stored.locale).toBe('es')
  })

  test('the Spanish language preference persists after page reload', async ({ page }) => {
    const toggle = page.locator('header input[type="checkbox"]')
    await toggle.click()
    await expect(page.locator('header')).toContainText('Sobre M\u00ed')

    await page.reload()
    await expect(page.locator('header')).toContainText('Sobre M\u00ed')
  })
})

test.describe('Home page - User switches back to English', () => {
  test.skip(({ isMobile }) => isMobile, 'Language toggle is hidden on mobile')

  test('toggling language twice restores the English labels', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    const toggle = page.locator('header input[type="checkbox"]')
    await toggle.click()
    await expect(page.locator('header')).toContainText('Sobre M\u00ed')

    await toggle.click()
    await expect(page.locator('header')).toContainText('About Me')
  })
})

test.describe('Home page - User arrives with a pre-set Spanish config', () => {
  test('loading the page with locale "es" in localStorage shows Spanish content', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem(
        'jp-config-ts',
        JSON.stringify({
          layout: 'vertical',
          drawerType: 'default',
          fontFamily: 'Roboto',
          borderRadius: 8,
          outlinedFilled: true,
          navType: 'dark',
          presetColor: 'default',
          locale: 'es',
          rtlLayout: false,
        })
      )
    })
    await page.reload()
    await expect(page.locator('header')).toContainText('Sobre M\u00ed')
  })
})
