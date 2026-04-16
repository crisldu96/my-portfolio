import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/helpers'
import Home from '@/app/page'

// page.tsx uses useTheme internally — MUI ThemeProvider is in helpers wrapper
// It also imports slick-carousel CSS which needs to be mocked
vi.mock('slick-carousel/slick/slick.css', () => ({}))
vi.mock('slick-carousel/slick/slick-theme.css', () => ({}))

// Stub heavy landing sections to isolate page composition testing
vi.mock('@/components/landing/HeaderSection', () => ({
  default: () => <section data-testid="header-section">Header</section>,
}))
vi.mock('@/components/landing/AboutMeSection', () => ({
  default: () => <section data-testid="about-section">About</section>,
}))
vi.mock('@/components/landing/ExperienceSection', () => ({
  default: () => <section data-testid="experience-section">Experience</section>,
}))
vi.mock('@/components/landing/SkillsSection', () => ({
  default: () => <section data-testid="skills-section">Skills</section>,
}))
vi.mock('@/components/landing/ProjectsSection', () => ({
  default: () => <section data-testid="projects-section">Projects</section>,
}))
vi.mock('@/components/landing/ContactSection', () => ({
  default: () => <section data-testid="contact-section">Contact</section>,
}))

// Stub layout wrappers that may require complex theme context
vi.mock('@/app/layout/HeaderWrapper', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('@/app/layout/SectionWrapper', () => ({
  default: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <div id={id}>{children}</div>
  ),
}))

describe('HomePage', () => {
  beforeEach(() => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(null)
  })

  it('renders the HeaderSection', () => {
    render(<Home />)
    expect(screen.getByTestId('header-section')).toBeInTheDocument()
  })

  it('renders the AboutMeSection with id="about"', () => {
    render(<Home />)
    const section = screen.getByTestId('about-section')
    expect(section).toBeInTheDocument()
    expect(section.closest('[id="about"]')).toBeInTheDocument()
  })

  it('renders the ExperienceSection with id="experience"', () => {
    render(<Home />)
    const section = screen.getByTestId('experience-section')
    expect(section).toBeInTheDocument()
    expect(section.closest('[id="experience"]')).toBeInTheDocument()
  })

  it('renders the SkillsSection with id="skills"', () => {
    render(<Home />)
    const section = screen.getByTestId('skills-section')
    expect(section).toBeInTheDocument()
    expect(section.closest('[id="skills"]')).toBeInTheDocument()
  })

  it('renders the ProjectsSection with id="projects"', () => {
    render(<Home />)
    const section = screen.getByTestId('projects-section')
    expect(section).toBeInTheDocument()
    expect(section.closest('[id="projects"]')).toBeInTheDocument()
  })

  it('renders the ContactSection with id="contact"', () => {
    render(<Home />)
    const section = screen.getByTestId('contact-section')
    expect(section).toBeInTheDocument()
    expect(section.closest('[id="contact"]')).toBeInTheDocument()
  })

  it('renders all 6 sections in correct DOM order', () => {
    render(<Home />)
    const sectionIds = ['header-section', 'about-section', 'experience-section', 'skills-section', 'projects-section', 'contact-section']
    const elements = sectionIds.map((id) => screen.getByTestId(id))

    for (let i = 0; i < elements.length - 1; i++) {
      expect(
        elements[i].compareDocumentPosition(elements[i + 1]) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy()
    }
  })
})
