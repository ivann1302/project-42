import { render, screen } from '@testing-library/react'
import { PortfolioPage } from './PortfolioPage'
import { projects } from '@/entities/Project'

describe('PortfolioPage', () => {
  it('renders the page heading', () => {
    render(<PortfolioPage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders all project titles', () => {
    render(<PortfolioPage />)
    projects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument()
    })
  })

  it('renders project headings as h2', () => {
    render(<PortfolioPage />)
    const h2s = screen.getAllByRole('heading', { level: 2 })
    expect(h2s).toHaveLength(projects.length)
  })

  it('renders "Посмотреть сайт" links for all projects with href', () => {
    render(<PortfolioPage />)
    const links = screen.queryAllByRole('link', { name: /посмотреть сайт/i })
    expect(links).toHaveLength(projects.filter((project) => project.href).length)
  })

  it('renders the CTA without a secondary cases link', () => {
    render(<PortfolioPage />)
    expect(screen.getByRole('button', { name: /оставить заявку/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /смотреть кейсы/i })).not.toBeInTheDocument()
  })
})
