import { test, expect } from '@playwright/test'

test.describe('Critical user flow - Visitor lands and converts', () => {
  test('home page loads with the hero value proposition visible', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const headline = page.getByRole('heading', { level: 1 })
    await expect(headline).toBeVisible()
    await expect(headline).toContainText(/scalable|escalables/i)

    const hero = page.getByTestId('hero-section')
    await expect(hero.getByText('Full Stack & AI Developer').first()).toBeVisible()
    await expect(hero.getByText(/5\+\s*(years|años)/i)).toBeVisible()
  })

  test('primary CTA "LET\'S TALK" links to the contact section', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const cta = page.getByRole('link', { name: /LET'S TALK|HABLEMOS/i })
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', /#contact$/)
  })

  test('secondary CTA "View projects" links to the projects section', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const cta = page.getByRole('link', { name: /View projects|Ver proyectos/i })
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', /#projects$/)
  })

  test('blog index loads and shows at least one post card', async ({ page }) => {
    const response = await page.goto('/blog')
    expect(response?.status()).toBe(200)

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('.blog-list-card').first()).toBeVisible()
  })

  test('about page loads with a heading', async ({ page }) => {
    const response = await page.goto('/about')
    expect(response?.status()).toBe(200)

    await expect(page.getByRole('heading', { level: 1, name: /Cristopher Palacios/i })).toBeVisible()
  })

  test('home page exposes a canonical URL for SEO', async ({ page }) => {
    await page.goto('/')
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute('href', /https?:\/\/.+/)
  })
})

test.describe('Narrative section - "Mi proceso"', () => {
  test('renders the process section with all five steps present in the DOM', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const section = page.locator('#proceso');
    await expect(section).toBeVisible();

    const steps = section.locator('.process-step');
    await expect(steps).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      await expect(steps.nth(i)).toHaveAttribute('id', `proceso-step-${i}`);
    }
  });

  test('progress dots are an accessible, labelled, keyboard-focusable group', async ({ page }) => {
    await page.goto('/');
    const dots = page.locator('#proceso .process-dot');
    await expect(dots).toHaveCount(5);
    await expect(dots.first()).toHaveAttribute('aria-label', /1\/5/);
    await dots.first().focus();
    await expect(dots.first()).toBeFocused();
  });

  test('skip link points to the next section', async ({ page }) => {
    await page.goto('/');
    const skip = page.locator('#proceso .process-skip-link');
    await expect(skip).toHaveAttribute('href', '#experience');
  });

  test('with reduced motion, all five steps are stacked and readable', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const steps = page.locator('#proceso .process-step');
    await expect(steps).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      await expect(steps.nth(i)).toBeVisible();
    }
  });

  test('on a mobile viewport there is no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.locator('#proceso').scrollIntoViewIfNeeded();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1
    );
    expect(overflow).toBe(true);
  });

  test('process heading shows in English and Spanish', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#proceso')).toContainText(/How I work|Cómo trabajo/);
  });
});
