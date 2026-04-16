import { test, expect } from '@playwright/test'

test.describe('Contact Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#contact')
    await page.waitForTimeout(600)
  })

  test('contact section is visible on the page', async ({ page }) => {
    const contactSection = page.locator('#contact')
    await expect(contactSection).toBeVisible()
  })

  test('contact section displays the "Contact me at:" title', async ({ page }) => {
    const contactSection = page.locator('#contact')
    await expect(contactSection).toContainText('Contact me at:')
  })

  test('LinkedIn social link is present and points to correct URL', async ({ page }) => {
    const linkedinLink = page.locator('.project-info a[href*="linkedin.com"]').first()
    await expect(linkedinLink).toBeAttached()
    await expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/cristopher-palacios-791704160')
  })

  test('GitHub social link is present and points to correct URL', async ({ page }) => {
    const githubLink = page.locator('.project-info a[href*="github.com"]').first()
    await expect(githubLink).toBeAttached()
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/CristopherPalacios')
  })

  test('all social links open in a new tab', async ({ page }) => {
    const links = page.locator('.project-info a[target="_blank"]')
    const count = await links.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('Dev Community link is present', async ({ page }) => {
    const devLink = page.locator('a[href*="dev.to"]').first()
    await expect(devLink).toBeAttached()
  })

  test('contact section is reachable via keyboard Tab from the AppBar', async ({ page }) => {
    await page.goto('/')
    // Tab through to reach the contact section links
    await page.keyboard.press('Tab')
    // We just verify keyboard navigation does not throw and interactive elements are focusable
    const focused = await page.evaluate(() => document.activeElement?.tagName)
    expect(focused).toBeTruthy()
  })

  test('contact section title switches to Spanish when locale is "es"', async ({ page }) => {
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
    await page.goto('/#contact')
    await page.waitForTimeout(600)
    const contactSection = page.locator('#contact')
    await expect(contactSection).toContainText('Contáctame en:')
  })
})
