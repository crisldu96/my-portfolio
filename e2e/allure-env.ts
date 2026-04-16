import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

export function writeAllureEnvironment(outputDir: string) {
  mkdirSync(outputDir, { recursive: true })
  const properties = [
    `App.Name=Cristopher Palacios Portfolio`,
    `Base.URL=${process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'}`,
    `Framework=Next.js 16`,
    `Test.Framework=Playwright`,
    `Browser.Engines=Chromium, Firefox, Mobile Chrome`,
  ].join('\n')
  writeFileSync(join(outputDir, 'environment.properties'), properties)
}
