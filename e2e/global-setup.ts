import { writeAllureEnvironment } from './allure-env'

async function globalSetup() {
  writeAllureEnvironment('allure-results/e2e')
}

export default globalSetup
