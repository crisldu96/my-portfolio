import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/helpers'
import ContactSection from '@/components/landing/ContactSection'

describe('ContactSection', () => {
  beforeEach(() => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(null)
  })

  it('renders the section title from EN translations', () => {
    render(<ContactSection />)
    expect(screen.getByText('Contact me at:')).toBeInTheDocument()
  })

  it('renders all 5 social media links', () => {
    render(<ContactSection />)
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByText('Dev Community')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('Instagram')).toBeInTheDocument()
    expect(screen.getByText('Facebook')).toBeInTheDocument()
  })

  it('social media links point to correct external URLs', () => {
    render(<ContactSection />)
    const linkedinLink = screen.getByText('LinkedIn').closest('a')
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/cristopher-palacios-791704160')
    expect(linkedinLink).toHaveAttribute('target', '_blank')
  })

  it('GitHub link points to the correct profile', () => {
    render(<ContactSection />)
    const githubLink = screen.getByText('GitHub').closest('a')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/CristopherPalacios')
  })

  it('all social links open in a new tab', () => {
    render(<ContactSection />)
    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank')
    })
  })

  it('renders the slick slider wrapper containing social links', () => {
    render(<ContactSection />)
    // react-slick is mocked to a div with data-testid="slick-slider"
    expect(screen.getByTestId('slick-slider')).toBeInTheDocument()
  })

  it('renders Spanish title when locale is "es"', () => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(
      JSON.stringify({
        layout: 'vertical',
        drawerType: 'default',
        fontFamily: 'Roboto',
        borderRadius: 8,
        outlinedFilled: true,
        navType: 'dark',
        presetColor: 'default',
        locale: 'es',
        rtlLayout: false,
      })
    )
    render(<ContactSection />)
    expect(screen.getByText('Contáctame en:')).toBeInTheDocument()
  })
})
