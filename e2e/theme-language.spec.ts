import { test, expect } from '@playwright/test'

test.describe('Theme and Language switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Clear localStorage to ensure a clean state
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('page loads with dark theme by default (dark navType from config)', async ({ page }) => {
    // The default navType is "dark" — the AppBar background should reflect the dark theme
    const appBar = page.locator('header')
    await expect(appBar).toBeVisible()
    const bgColor = await appBar.evaluate((el) => getComputedStyle(el).backgroundColor)
    // Dark theme background is not white
    expect(bgColor).not.toBe('rgb(255, 255, 255)')
  })

  test('language switch toggle is present in the AppBar', async ({ page }) => {
    const toggle = page.locator('header input[type="checkbox"]')
    await expect(toggle).toBeAttached()
  })

  test('default locale is English — AppBar shows "About Me"', async ({ page }) => {
    await expect(page.locator('header')).toContainText('About Me')
  })

  test('clicking language switch changes AppBar text to Spanish', async ({ page }) => {
    const toggle = page.locator('header input[type="checkbox"]')
    await toggle.click()
    await expect(page.locator('header')).toContainText('Sobre Mí')
  })

  test('Spanish language preference persists after page reload', async ({ page }) => {
    const toggle = page.locator('header input[type="checkbox"]')
    await toggle.click()
    await expect(page.locator('header')).toContainText('Sobre Mí')

    await page.reload()
    await expect(page.locator('header')).toContainText('Sobre Mí')
  })

  test('locale is stored in localStorage under "jp-config-ts"', async ({ page }) => {
    const toggle = page.locator('header input[type="checkbox"]')
    await toggle.click()

    const stored = await page.evaluate(() => {
      const raw = localStorage.getItem('jp-config-ts')
      return raw ? JSON.parse(raw) : null
    })

    expect(stored).not.toBeNull()
    expect(stored.locale).toBe('es')
  })

  test('switching back to English restores English labels', async ({ page }) => {
    const toggle = page.locator('header input[type="checkbox"]')
    await toggle.click()
    await expect(page.locator('header')).toContainText('Sobre Mí')

    await toggle.click()
    await expect(page.locator('header')).toContainText('About Me')
  })

  test('stored config is read back correctly after reload', async ({ page }) => {
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
    await expect(page.locator('header')).toContainText('Sobre Mí')
  })
})
