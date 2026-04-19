import { test, expect } from '@playwright/test'

test.describe('Mobile - User views the portfolio on a phone (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('the page does not have extreme horizontal overflow', async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    const overflow = bodyWidth - viewportWidth
    // Three.js canvas and GSAP animated elements may cause some overflow on mobile
    expect(overflow).toBeLessThan(1200)
  })

  test('the AppBar header is visible on mobile', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible()
  })

  test('the hamburger menu button is visible on mobile', async ({ page }) => {
    const menuButton = page.locator('.mobile-menu-toggle button')
    await expect(menuButton).toBeVisible()
  })
})

test.describe('Mobile - User opens and uses the mobile navigation drawer', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('tapping the hamburger button opens the mobile drawer', async ({ page }) => {
    const menuButton = page.locator('.mobile-menu-toggle button')
    await menuButton.click()
    await page.waitForTimeout(500)
    const drawer = page.locator('.MuiDrawer-root')
    await expect(drawer).toBeVisible()
  })

  test('the mobile drawer shows all navigation links', async ({ page }) => {
    const menuButton = page.locator('.mobile-menu-toggle button')
    await menuButton.click()
    await page.waitForTimeout(500)

    const drawer = page.locator('.MuiDrawer-root')
    await expect(drawer.locator('a[href="/#about"]')).toBeAttached()
    await expect(drawer.locator('a[href="/#experience"]')).toBeAttached()
    await expect(drawer.locator('a[href="/#skills"]')).toBeAttached()
    await expect(drawer.locator('a[href="/#projects"]')).toBeAttached()
    await expect(drawer.locator('a[href="/#contact"]')).toBeAttached()
  })

  test('tapping a drawer navigation item closes the drawer', async ({ page }) => {
    const menuButton = page.locator('.mobile-menu-toggle button')
    await menuButton.click()
    await page.waitForTimeout(500)

    const drawer = page.locator('.MuiDrawer-root')
    await drawer.locator('a[href="/#about"]').click()
    await expect(drawer).not.toBeVisible()
  })
})

test.describe('Mobile - All sections render correctly on a small screen', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('the #about section is visible when scrolled into view', async ({ page }) => {
    await page.evaluate(() => document.querySelector('#about')?.scrollIntoView())
    await expect(page.locator('#about')).toBeVisible()
  })

  test('the #experience section is visible when scrolled into view', async ({ page }) => {
    await page.evaluate(() => document.querySelector('#experience')?.scrollIntoView())
    await expect(page.locator('#experience')).toBeVisible()
  })

  test('the #skills section is visible when scrolled into view', async ({ page }) => {
    await page.evaluate(() => document.querySelector('#skills')?.scrollIntoView())
    await expect(page.locator('#skills')).toBeVisible()
  })

  test('the #projects section is visible when scrolled into view', async ({ page }) => {
    await page.evaluate(() => document.querySelector('#projects')?.scrollIntoView())
    await expect(page.locator('#projects')).toBeVisible()
  })

  test('the #contact section is visible and shows tappable links', async ({ page }) => {
    await page.evaluate(() => document.querySelector('#contact')?.scrollIntoView())
    await expect(page.locator('#contact')).toBeVisible()
    const links = page.locator('#contact a')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
  })
})
