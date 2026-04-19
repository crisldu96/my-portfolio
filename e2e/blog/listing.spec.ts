import { test, expect } from '@playwright/test'

test.describe('Blog listing - User arrives at the blog page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog')
  })

  test('the blog listing page loads with a title containing "Blog" and "Cristopher Palacios"', async ({ page }) => {
    await expect(page).toHaveTitle(/Blog.*Cristopher Palacios/)
    await expect(page.locator('h2')).toContainText('Blog')
  })

  test('the AppBar includes a Blog navigation link', async ({ page }) => {
    const headerText = await page.locator('header').textContent()
    expect(headerText).toContain('Blog')
  })

  test('the page has a correct canonical URL containing /blog', async ({ page }) => {
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toContain('/blog')
  })
})

test.describe('Blog listing - User browses available posts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog')
  })

  test('at least one post card is visible on the listing page', async ({ page }) => {
    const cards = page.locator('[class*="MuiCard-root"]')
    await expect(cards.first()).toBeVisible()
  })

  test('the first post card shows a title, reading time, and tags', async ({ page }) => {
    const card = page.locator('[class*="MuiCard-root"]').first()
    await expect(card).toContainText('min read')
    await expect(card.locator('[class*="MuiChip-root"]').first()).toBeVisible()
  })

  test('clicking a post card navigates to the post page', async ({ page }) => {
    const firstLink = page.locator('a[href*="/blog/"]').first()
    await firstLink.click()
    await page.waitForURL('**/blog/**')
    await expect(page.locator('h2').first()).toBeVisible()
  })
})
