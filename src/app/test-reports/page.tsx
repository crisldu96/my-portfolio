// This page is only accessible in development. It shows links to local test reports.
// Access at: http://localhost:3000/test-reports

export default function TestReportsPage() {
  const reports = [
    {
      name: 'Allure Report (Full)',
      description: 'Combined unit + E2E test results with traces, screenshots, and videos',
      command: 'npm run allure:open',
      path: 'allure-report/index.html',
    },
    {
      name: 'Playwright HTML Report',
      description: 'E2E test results with screenshots, traces, and video recordings',
      command: 'npm run test:e2e:report',
      path: 'playwright-report/index.html',
    },
    {
      name: 'Vitest Coverage Report',
      description: 'Unit test coverage report with line-by-line coverage',
      command: 'open coverage/index.html',
      path: 'coverage/index.html',
    },
  ]

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Test Reports</h1>
      <p>Run these commands to view test reports locally:</p>
      {reports.map((report) => (
        <section key={report.name} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #333' }}>
          <h2>{report.name}</h2>
          <p>{report.description}</p>
          <code style={{ display: 'block', padding: '0.5rem', background: '#111' }}>
            {report.command}
          </code>
        </section>
      ))}
      <section>
        <h2>CI/CD Reports</h2>
        <p>Reports are published to GitHub Pages after each push to main.</p>
        <p>Access at: https://[your-username].github.io/[repo-name]/</p>
      </section>
    </main>
  )
}
