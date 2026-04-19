import { test, expect } from '@playwright/test'

test.describe('Home page - User arrives and sees the first impression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('the page loads with the correct title containing the developer name', async ({ page }) => {
    await expect(page).toHaveTitle(/Cristopher Palacios/)
  })

  test('the page uses a dark theme by default', async ({ page }) => {
    const bg = await page.locator('body').evaluate((el) => getComputedStyle(el).backgroundColor)
    expect(bg).not.toBe('rgb(255, 255, 255)')
  })

  test('the AppBar header is visible at the top of the page', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible()
  })

  test('the CP monogram logo is displayed in the AppBar', async ({ page }) => {
    const monogram = page.locator('.cp-monogram')
    await expect(monogram).toBeVisible()
    await expect(monogram).toContainText('CP')
  })

  test('the AppBar shows navigation links in English by default', async ({ page }) => {
    const header = page.locator('header')
    await expect(header).toContainText('About Me')
    await expect(header).toContainText('Experience')
    await expect(header).toContainText('Skills')
  })
})

test.describe('Home page - Hero section content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('the hero displays the developer name and surname', async ({ page }) => {
    const hero = page.locator('.hero-overlay')
    await expect(hero.locator('.hero-name__first')).toBeVisible()
    await expect(hero.locator('.hero-name__first')).toContainText('Cristopher')
    await expect(hero.locator('.hero-name__last')).toContainText('Palacios')
  })

  test('the hero shows the role pill with the developer title', async ({ page }) => {
    await expect(page.getByText('Full Stack & AI Developer')).toBeVisible()
  })

  test('the hero shows a profile photo of the developer', async ({ page }) => {
    const photo = page.locator('.hero-photo')
    await expect(photo).toBeVisible()
    await expect(photo).toHaveAttribute('alt', 'Cristopher Palacios')
  })

  test('the LET\'S TALK button links to the contact section', async ({ page }) => {
    const letsTalk = page.locator('a', { hasText: /let.*s talk/i })
    await expect(letsTalk.first()).toBeVisible()
    await expect(letsTalk.first()).toHaveAttribute('href', '/#contact')
  })

  test('the availability indicator shows the developer is available', async ({ page }) => {
    await expect(page.getByText('AVAILABLE FOR WORK')).toBeVisible()
  })

  test('the scroll-to-explore indicator is visible', async ({ page }) => {
    await expect(page.getByText(/scroll to explore/i)).toBeVisible()
  })
})

test.describe('Home page - All portfolio sections are present in the DOM', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  const sections = ['about', 'experience', 'skills', 'projects', 'contact']

  for (const id of sections) {
    test(`the #${id} section anchor exists`, async ({ page }) => {
      await expect(page.locator(`#${id}`)).toBeAttached()
    })
  }
})

test.describe('Home page - Each section renders its key content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('the About section shows its label and heading', async ({ page }) => {
    await expect(page.getByText('01 / About')).toBeAttached()
    await expect(page.getByText('Something about me...')).toBeAttached()
  })

  test('the About section displays stat pills with years, projects, and bilingual info', async ({ page }) => {
    const about = page.locator('#about')
    await expect(about.getByText('5+')).toBeAttached()
    await expect(about.getByText('20+')).toBeAttached()
    await expect(about.getByText('EN/ES')).toBeAttached()
  })

  test('the About section shows Soft Skills and Hard Skills cards', async ({ page }) => {
    await expect(page.getByText('Soft Skills')).toBeAttached()
    await expect(page.getByText('Hard Skills')).toBeAttached()
  })

  test('the Experience section shows the timeline with job roles', async ({ page }) => {
    await expect(page.getByText('02 / Experience')).toBeAttached()
    await expect(page.getByText('Software Developer Specialist')).toBeAttached()
    await expect(page.getByText('Full Stack Developer')).toBeAttached()
  })

  test('the Experience section shows year pills and company names', async ({ page }) => {
    await expect(page.getByText('2021 - Present')).toBeAttached()
    await expect(page.getByText('@ Actuaria')).toBeAttached()
  })

  test('the Skills section shows all four category cards', async ({ page }) => {
    await expect(page.getByText('03 / Skills')).toBeAttached()
    await expect(page.getByText('Frontend')).toBeAttached()
    await expect(page.getByText('Backend')).toBeAttached()
    await expect(page.getByText('AI / ML')).toBeAttached()
    await expect(page.getByText('DevOps')).toBeAttached()
  })

  test('the Projects section shows project cards with titles', async ({ page }) => {
    await expect(page.getByText('04 / Projects')).toBeAttached()
    await expect(page.getByText('Data Collection Portal')).toBeAttached()
    await expect(page.getByText('Kin Analytics')).toBeAttached()
    await expect(page.getByText('Arupo')).toBeAttached()
  })

  test('the Contact section shows the heading and contact method cards', async ({ page }) => {
    await expect(page.getByText('05 / Contact')).toBeAttached()
    await expect(page.getByText('Contact me at:')).toBeAttached()
    await expect(page.locator('#contact').getByText('LinkedIn')).toBeAttached()
    await expect(page.locator('#contact').getByText('GitHub')).toBeAttached()
  })
})
