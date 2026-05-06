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

  it('renders all 3 project descriptions', () => {
    render(<PortfolioPage />)
    expect(screen.getByText(/многостраничный корпоративный сайт/i)).toBeInTheDocument()
    expect(screen.getByText(/конверсионный лендинг для b2b saas/i)).toBeInTheDocument()
    expect(screen.getByText(/конверсионный лендинг для b2b аналитической/i)).toBeInTheDocument()
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
})
