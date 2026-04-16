# CI/CD Pipeline

## Overview

The pipeline runs on every push to `main` or `develop`, and on pull requests targeting `main`. It consists of four parallel jobs:

- **unit-tests** — Vitest unit tests with V8 coverage and Allure result upload
- **e2e-tests** — Playwright E2E tests across Chromium and Firefox (matrix), with Allure result upload
- **allure-report** — Runs after both test jobs (always), merges all Allure results, generates a unified report, and publishes it to GitHub Pages on pushes to `main`
- **quality-checks** — TypeScript type checking (`tsc --noEmit`) and ESLint, runs in parallel with tests

Concurrency is controlled per workflow + branch: a new push cancels the in-progress run for that branch.

## Report Publishing

On every push to `main`, the `allure-report` job:

1. Downloads all `allure-*-results*` artifacts from the same run (unit + both browser E2E results)
2. Merges them via `simple-elf/allure-report-action`, keeping the last 20 historical runs
3. Publishes the output to the `gh-pages` branch using `peaceiris/actions-gh-pages`

GitHub Pages must be configured to serve from the `gh-pages` branch (see setup section below).

## Accessing Reports After a CI Run

**GitHub Pages (main branch pushes only):**
```
https://<your-username>.github.io/<repo-name>/
```

**Artifacts (all runs, 30-day retention):**

Navigate to Actions > select the run > scroll to Artifacts:

| Artifact | Contents |
|---|---|
| `allure-unit-results` | Raw Allure XML from Vitest |
| `allure-e2e-results-chromium` | Raw Allure XML from Playwright/Chromium |
| `allure-e2e-results-firefox` | Raw Allure XML from Playwright/Firefox |
| `playwright-report-chromium` | Playwright HTML report (Chromium) |
| `playwright-report-firefox` | Playwright HTML report (Firefox) |
| `allure-report` | Generated Allure HTML report |

## Running Tests Locally

```bash
# Unit tests (single run, no watch)
npm run test:run

# Unit tests with coverage
npm run test:run -- --coverage

# E2E tests (requires app running or webServer config)
npx playwright test

# E2E tests for a specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

## Viewing Reports Locally

| Report | Command | Notes |
|---|---|---|
| Allure (combined) | `npm run allure:open` | Requires `allure-report/` to exist |
| Playwright HTML | `npm run test:e2e:report` | Opens `playwright-report/index.html` |
| Vitest Coverage | `open coverage/index.html` | macOS; use `start` on Windows |
| Dev route | `http://localhost:3000/test-reports` | Links and commands in-browser |

To generate the Allure report from results:
```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

## What a Report Must Answer

Every Allure report is structured to answer four questions:

1. **What failed?** — Test name, suite, and status visible in the dashboard overview
2. **Where?** — File path, line number, and step-level breakdown in the test body
3. **Why?** — Error message, diff output, and attached screenshots or trace files
4. **Can it be reproduced?** — Attached video recording and Playwright trace viewer link

## Captured Artifacts Per Test

Playwright is configured to capture on failure or first retry:

- **Screenshots** — `screenshot: 'only-on-failure'`
- **Video** — `video: 'on-first-retry'`
- **Trace** — `trace: 'on-first-retry'` (open with `npx playwright show-trace`)

These are embedded directly in both the Playwright HTML report and the Allure report.

## GitHub Pages Setup

1. Push at least one successful run to `main` (the `gh-pages` branch will be created automatically)
2. Go to the repository **Settings > Pages**
3. Under **Source**, select **Deploy from a branch**
4. Set branch to `gh-pages`, folder to `/ (root)`
5. Save — the URL `https://<username>.github.io/<repo>/` will be active within a minute

The `GITHUB_TOKEN` secret used by `peaceiris/actions-gh-pages` is automatically available in all Actions runs; no manual secret configuration is required.

## Branch Strategy

| Branch | Triggers |
|---|---|
| `main` | Push and pull request — all jobs run; Allure published to Pages |
| `develop` | Push only — all jobs run; Allure not published to Pages |
| Other branches | Pull request to `main` — all jobs run |
