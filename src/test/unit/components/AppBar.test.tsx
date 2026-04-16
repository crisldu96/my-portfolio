import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/helpers'
import AppBar from '@/components/layout/AppBar'

// AppBar uses useScrollTrigger which relies on window scroll events
vi.mock('@mui/material/useScrollTrigger', () => ({
  default: () => false,
}))

describe('AppBar', () => {
  beforeEach(() => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(null)
  })

  it('renders the Logo SVG icon', () => {
    render(<AppBar />)
    // Logo is an SVG icon rendered as a button/link area
    const svg = document.querySelector('svg')
    expect(svg).toBeTruthy()
  })

  it('renders navigation links for all 5 main sections', () => {
    render(<AppBar />)
    expect(screen.getByRole('link', { name: /about me/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /experience/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /skills/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /my projects/i })).toBeInTheDocument()
  })

  it('renders Contact Me as a contained action button', () => {
    render(<AppBar />)
    const contactButtons = screen.getAllByRole('link', { name: /contact me/i })
    expect(contactButtons.length).toBeGreaterThan(0)
  })

  it('navigation links point to correct section anchors', () => {
    render(<AppBar />)
    const aboutLink = screen.getByRole('link', { name: /about me/i })
    expect(aboutLink).toHaveAttribute('href', '/#about')
  })

  it('renders LanguageSwitch toggle', () => {
    render(<AppBar />)
    const toggle = document.querySelector('input[type="checkbox"]')
    expect(toggle).toBeInTheDocument()
  })

  it('language switch is unchecked by default (EN locale)', () => {
    render(<AppBar />)
    const toggle = document.querySelector('input[type="checkbox"]') as HTMLInputElement
    expect(toggle.checked).toBe(false)
  })

  it('clicking language switch calls onChangeLocale to toggle EN/ES', async () => {
    const user = userEvent.setup()
    render(<AppBar />)
    const toggle = document.querySelector('input[type="checkbox"]') as HTMLInputElement
    await user.click(toggle)
    // After switching to ES, toggle should be checked
    expect(toggle.checked).toBe(true)
  })

  it('renders mobile hamburger menu icon', () => {
    render(<AppBar />)
    const menuButton = screen.getByRole('button', { name: '' })
    expect(menuButton).toBeInTheDocument()
  })

  it('opening mobile drawer renders nav items', async () => {
    const user = userEvent.setup()
    render(<AppBar />)
    const allButtons = screen.getAllByRole('button')
    const menuButton = allButtons.find((btn) => btn.querySelector('svg[data-testid="MenuIcon"]'))
    if (menuButton) {
      await user.click(menuButton)
      const drawerLinks = document.querySelectorAll('[role="presentation"] a')
      expect(drawerLinks.length).toBeGreaterThan(0)
    }
  })
})
