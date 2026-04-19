import { test, expect } from '@playwright/test'

test.describe('Home page - User navigates using AppBar links', () => {
  test.skip(({ isMobile }) => isMobile, 'Desktop nav links are hidden on mobile')

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('clicking "About Me" scrolls the page to the #about section', async ({ page }) => {
    await page.click('a[href="/#about"]')
    await page.waitForTimeout(800)
    await expect(page.locator('#about')).toBeInViewport()
  })

  test('clicking "Experience" scrolls the page to the #experience section', async ({ page }) => {
    await page.click('a[href="/#experience"]')
    await page.waitForTimeout(800)
    await expect(page.locator('#experience')).toBeInViewport()
  })

  test('clicking "Skills" scrolls the page to the #skills section', async ({ page }) => {
    await page.click('a[href="/#skills"]')
    await page.waitForTimeout(800)
    await expect(page.locator('#skills')).toBeInViewport()
  })

  test('clicking "Contact" pill button scrolls to the #contact section', async ({ page }) => {
    await page.locator('a[href="/#contact"]').first().click()
    await page.waitForTimeout(800)
    await expect(page.locator('#contact')).toBeInViewport()
  })
})

test.describe('Home page - User navigates using the CP monogram logo', () => {
  test('clicking the CP monogram from the home page keeps the user on the home page', async ({ page }) => {
    await page.goto('/')
    await page.locator('.cp-monogram').locator('..').click()
    await expect(page).toHaveURL(/\/$/)
  })

  test('clicking the CP monogram from the blog page returns to the home page', async ({ page }) => {
    await page.goto('/blog')
    await page.locator('.cp-monogram').locator('..').click()
    await page.waitForURL('/')
    await expect(page).toHaveURL('/')
  })
})

test.describe('Home page - User uses browser history for navigation', () => {
  test('pressing browser back from the blog page returns to the home page', async ({ page }) => {
    await page.goto('/')
    await page.goto('/blog')
    await page.goBack()
    await expect(page).toHaveURL('/')
  })
})
