#!/bin/bash
# Test infrastructure setup script
# Run from project root: bash scripts/setup-tests.sh

# Unit testing (Vitest + React Testing Library)
npm install --save-dev vitest @vitest/ui @vitejs/plugin-react
npm install --save-dev @testing-library/react @testing-library/user-event @testing-library/jest-dom
npm install --save-dev jsdom @types/jsdom

# E2E testing (Playwright)
npm install --save-dev @playwright/test
npx playwright install --with-deps chromium firefox

# Allure reporting
npm install --save-dev allure-playwright allure-commandline allure-vitest
