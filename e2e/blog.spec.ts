import { test, expect } from '@playwright/test'

test.describe('Blog Section', () => {
  test('blog listing page loads and displays correct title', async ({ page }) => {
    await page.goto('/blog')
    await expect(page).toHaveTitle(/Blog.*Cristopher Palacios/)
    await expect(page.locator('h2')).toContainText('Blog')
  })

  test('blog listing shows at least one post card', async ({ page }) => {
    await page.goto('/blog')
    const cards = page.locator('[class*="MuiCard-root"]')
    await expect(cards.first()).toBeVisible()
  })

  test('post card displays title, date, reading time, and tags', async ({ page }) => {
    await page.goto('/blog')
    const card = page.locator('[class*="MuiCard-root"]').first()
    await expect(card).toContainText('How I Built a Full Stack App')
    await expect(card).toContainText('2025')
    await expect(card).toContainText('min read')
    await expect(card.locator('[class*="MuiChip-root"]').first()).toBeVisible()
  })

  test('clicking a post card navigates to the post page', async ({ page }) => {
    await page.goto('/blog')
    await page.locator('a[href*="/blog/building-fullstack-app-nextjs-ai"]').click()
    await page.waitForURL('**/blog/building-fullstack-app-nextjs-ai')
    await expect(page).toHaveTitle(/How I Built a Full Stack App/)
  })

  test('blog post page displays post content', async ({ page }) => {
    await page.goto('/blog/building-fullstack-app-nextjs-ai')
    await expect(page.locator('h2').first()).toContainText('How I Built a Full Stack App')
    await expect(page.locator('body')).toContainText('The Vision')
    await expect(page.locator('body')).toContainText('Architecture Decisions')
  })

  test('blog post page has back to blog link', async ({ page }) => {
    await page.goto('/blog/building-fullstack-app-nextjs-ai')
    const backLink = page.locator('a[href="/blog"]').first()
    await expect(backLink).toBeVisible()
    await backLink.click()
    await page.waitForURL('**/blog')
  })

  test('blog post page has BlogPosting JSON-LD schema', async ({ page }) => {
    await page.goto('/blog/building-fullstack-app-nextjs-ai')
    const jsonLd = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      return scripts.map((s) => JSON.parse(s.textContent || '{}'))
    })
    const blogPosting = jsonLd.find((s: Record<string, string>) => s['@type'] === 'BlogPosting')
    expect(blogPosting).toBeTruthy()
    expect(blogPosting.headline).toContain('Full Stack App')
    expect(blogPosting.author?.name).toBe('Cristopher Palacios')
  })

  test('blog post page has correct meta description', async ({ page }) => {
    await page.goto('/blog/building-fullstack-app-nextjs-ai')
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toContain('deep dive')
  })

  test('AppBar on blog page includes Blog navigation link', async ({ page }) => {
    await page.goto('/blog')
    const blogLink = page.locator('header a[href="/blog"], header button')
    const allText = await page.locator('header').textContent()
    expect(allText).toContain('Blog')
  })

  test('blog listing page has correct canonical URL', async ({ page }) => {
    await page.goto('/blog')
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toContain('/blog')
  })

  test('non-existent blog post returns 404', async ({ page }) => {
    const response = await page.goto('/blog/non-existent-post-slug')
    expect(response?.status()).toBe(404)
  })
})
