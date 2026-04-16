# Testing Infrastructure

## Setup

Run the setup script once from the project root to install all test dependencies:

```bash
bash scripts/setup-tests.sh
```

This installs:
- **Vitest** + **React Testing Library** for unit/component tests
- **Playwright** for end-to-end tests (Chromium + Firefox browsers)
- **Allure** reporter for both test suites

---

## Running Unit Tests

```bash
# Watch mode (development)
npm test

# Run once (CI)
npm run test:run

# With coverage report
npm run test:coverage

# Interactive UI
npm run test:ui
```

Coverage HTML report is written to `./coverage/index.html`.

---

## Running E2E Tests

Start the dev server first (or let Playwright start it automatically):

```bash
# Run all E2E suites headlessly (Chromium + Firefox + Mobile Chrome)
npm run test:e2e

# Run with visible browser windows
npm run test:e2e:headed

# Interactive Playwright UI mode
npm run test:e2e:ui

# Open the last HTML report
npm run test:e2e:report
```

To run only a specific browser project:

```bash
npx playwright test --project=chromium
npx playwright test --project=mobile-chrome
```

---

## Allure Reports

After running tests, generate and view the Allure report:

```bash
# Generate unified report from all results
npm run allure:generate

# Open in browser
npm run allure:open

# Live server (watches allure-results/)
npm run allure:serve
```

Unit test results are written to `allure-results/unit/`.
E2E test results are written to `allure-results/e2e/`.

---

## CI Mode

Set `CI=true` to enable strict CI behavior:

```bash
CI=true npm run test:run
CI=true npm run test:e2e
```

In CI mode:
- Playwright retries each test up to 2 times on failure
- Only 1 worker is used for E2E (prevents port conflicts)
- `forbidOnly` is enabled (test.only causes a build failure)
- GitHub Actions reporter is activated for Playwright

---

## Test Structure

```
src/test/
  setup.ts                        Global mocks (next/navigation, framer-motion, localStorage, react-slick)
  helpers.tsx                     renderWithProviders — wraps components in MUI + ConfigProvider + LanguageProvider
  unit/
    contexts/
      ConfigContext.test.tsx      Default state, navType toggle, locale change, localStorage persistence, hydration from storage
      LanguageContext.test.tsx    EN/ES translation, lodash key lookup, reactive locale switching, missing key behavior
    components/
      AppBar.test.tsx             Logo render, nav link hrefs, language toggle EN<->ES, mobile drawer contents
      ContactSection.test.tsx     Section title (EN/ES), all 5 social links present, correct hrefs, target="_blank"
      ProjectsSection.test.tsx    Section title, first project render, carousel next/prev navigation, wrap-around, image alt
    pages/
      HomePage.test.tsx           All 6 sections rendered, section id anchors correct, DOM order validation

e2e/
  navigation.spec.ts              Full page load, anchor scroll for all 5 sections, /about page, logo back-navigation
  theme-language.spec.ts          Default dark theme, EN/ES toggle, persistence via localStorage after reload
  contact-form.spec.ts            Social links present and correct URLs, Spanish locale title, keyboard accessibility
  seo-meta.spec.ts                Title, meta description, OG tags, canonical, robots, JSON-LD Person/WebSite schemas
  mobile-responsive.spec.ts       375px viewport, hamburger menu, drawer nav items, no horizontal overflow
  a11y.spec.ts                    lang attribute, image alt, keyboard focus, no duplicate IDs, focusable interactive elements
```

---

## Notes for Component Authors

The following components are mocked in unit tests to avoid environment dependencies:

| Mock | Reason |
|---|---|
| `framer-motion` | Avoids animation timing issues in jsdom |
| `next/navigation` | No Next.js router in jsdom |
| `next/image` | Renders as plain `<img>` |
| `react-slick` | Avoids CSS/DOM layout requirements |
| `localStorage` | Controlled via `vi.fn()` per test |

If you add a new component that uses `next/font`, `next/headers`, or server-only imports, add a corresponding mock in `src/test/setup.ts`.
