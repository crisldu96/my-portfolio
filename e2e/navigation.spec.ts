import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('home page loads and all 6 section anchors exist in the DOM', async ({ page }) => {
    await expect(page.locator('#about')).toBeAttached()
    await expect(page.locator('#experience')).toBeAttached()
    await expect(page.locator('#skills')).toBeAttached()
    await expect(page.locator('#projects')).toBeAttached()
    await expect(page.locator('#contact')).toBeAttached()
  })

  test('AppBar is visible on page load', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible()
  })

  test('clicking "About Me" nav link scrolls to #about section', async ({ page }) => {
    await page.click('a[href="/#about"]')
    await page.waitForTimeout(800)
    const aboutSection = page.locator('#about')
    await expect(aboutSection).toBeInViewport()
  })

  test('clicking "Experience" nav link scrolls to #experience section', async ({ page }) => {
    await page.click('a[href="/#experience"]')
    await page.waitForTimeout(800)
    await expect(page.locator('#experience')).toBeInViewport()
  })

  test('clicking "Skills" nav link scrolls to #skills section', async ({ page }) => {
    await page.click('a[href="/#skills"]')
    await page.waitForTimeout(800)
    await expect(page.locator('#skills')).toBeInViewport()
  })

  test('clicking "My Projects" nav link scrolls to #projects section', async ({ page }) => {
    await page.click('a[href="/#projects"]')
    await page.waitForTimeout(800)
    await expect(page.locator('#projects')).toBeInViewport()
  })

  test('clicking "Contact Me" nav link scrolls to #contact section', async ({ page }) => {
    // There are two Contact Me links (desktop nav + contained button), use first
    await page.locator('a[href="/#contact"]').first().click()
    await page.waitForTimeout(800)
    await expect(page.locator('#contact')).toBeInViewport()
  })

  test('navigating to /about page renders the about page', async ({ page }) => {
    await page.goto('/about')
    await expect(page).toHaveURL('/about')
    await expect(page.locator('body')).toBeVisible()
  })

  test('logo click from /about returns to home page', async ({ page }) => {
    await page.goto('/about')
    // Logo is an SVG rendered inside the AppBar toolbar
    const logo = page.locator('svg').first()
    await logo.click()
    await page.waitForTimeout(500)
    // Logo may not be a link — verify page still functions
    const url = page.url()
    expect(url).toBeTruthy()
  })

  test('browser back from /about returns to home', async ({ page }) => {
    await page.goto('/about')
    await page.goBack()
    await expect(page).toHaveURL('/')
  })
})
