import { test, expect } from '@playwright/test'

test.describe('Home page - User views the Contact section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#contact')
    await page.waitForTimeout(600)
  })

  test('the contact section is visible and shows its heading', async ({ page }) => {
    const contact = page.locator('#contact')
    await expect(contact).toBeVisible()
    await expect(contact).toContainText('Contact me at:')
  })

  test('the contact section shows the 05 / Contact label', async ({ page }) => {
    await expect(page.getByText('05 / Contact')).toBeAttached()
  })
})

test.describe('Home page - User checks contact method cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#contact')
    await page.waitForTimeout(600)
  })

  test('the LinkedIn card is present with the correct link', async ({ page }) => {
    const linkedinLink = page.locator('.project-info a[href*="linkedin.com"]').first()
    await expect(linkedinLink).toBeAttached()
    await expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/cristopher-palacios-791704160')
  })

  test('the GitHub card is present with the correct link', async ({ page }) => {
    const githubLink = page.locator('.project-info a[href*="github.com"]').first()
    await expect(githubLink).toBeAttached()
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/CristopherPalacios')
  })

  test('the Dev Community card is present with a dev.to link', async ({ page }) => {
    const devLink = page.locator('.project-info a[href*="dev.to"]').first()
    await expect(devLink).toBeAttached()
  })

  test('the Email card is present with a mailto link', async ({ page }) => {
    const emailLink = page.locator('.project-info a[href^="mailto:"]').first()
    await expect(emailLink).toBeAttached()
  })

  test('all contact method cards open in a new tab', async ({ page }) => {
    const links = page.locator('.project-info a[target="_blank"]')
    const count = await links.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('each contact card displays the platform name and handle', async ({ page }) => {
    const contact = page.locator('#contact')
    await expect(contact.getByText('LinkedIn')).toBeAttached()
    await expect(contact.getByText('GitHub')).toBeAttached()
    await expect(contact.getByText('Dev Community')).toBeAttached()
    await expect(contact.getByText('Email')).toBeAttached()
  })
})

test.describe('Home page - Contact section responds to language change', () => {
  test('switching to Spanish changes the contact heading to "Contactame en:"', async ({ page }) => {
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
    await page.goto('/#contact')
    await page.waitForTimeout(600)
    const contact = page.locator('#contact')
    await expect(contact).toContainText('Contáctame en:')
  })
})
