import { test, expect } from '@playwright/test'

const postUrl = '/blog/building-fullstack-app-nextjs-ai'

test.describe('Blog post - User reads a blog article', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(postUrl)
  })

  test('the post page displays the article title and content sections', async ({ page }) => {
    await expect(page.locator('h2').first()).toContainText('How I Built a Full Stack App')
    await expect(page.locator('body')).toContainText('The Vision')
    await expect(page.locator('body')).toContainText('Architecture Decisions')
  })

  test('the post page has a correct meta description', async ({ page }) => {
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toContain('deep dive')
  })

  test('the post page has a BlogPosting JSON-LD schema with the correct author', async ({ page }) => {
    const jsonLd = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      return scripts.map((s) => JSON.parse(s.textContent || '{}'))
    })
    const blogPosting = jsonLd.find((s: Record<string, string>) => s['@type'] === 'BlogPosting')
    expect(blogPosting).toBeTruthy()
    expect(blogPosting.headline).toContain('Full Stack App')
    expect(blogPosting.author?.name).toBe('Cristopher Palacios')
  })
})

test.describe('Blog post - User navigates back to the listing', () => {
  test('clicking the "Back to Blog" button returns to the listing page', async ({ page }) => {
    await page.goto(postUrl)
    const backButton = page.locator('a', { hasText: 'Back to Blog' }).first()
    await expect(backButton).toBeVisible()
    await backButton.click()
    await page.waitForURL('**/blog')
  })
})

test.describe('Blog post - Non-existent post returns 404', () => {
  test('navigating to a non-existent slug returns a 404 status', async ({ page }) => {
    const response = await page.goto('/blog/non-existent-post-slug')
    expect(response?.status()).toBe(404)
  })
})
