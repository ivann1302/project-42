import { render, screen } from '@testing-library/react'
import { PortfolioPage } from './PortfolioPage'

describe('PortfolioPage', () => {
  it('renders the page heading', () => {
    render(<PortfolioPage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders all 3 project titles', () => {
    render(<PortfolioPage />)
    expect(screen.getByText('Корпоративный сайт')).toBeInTheDocument()
    expect(screen.getByText('Лендинг для SaaS')).toBeInTheDocument()
    expect(screen.getByText('Интернет-магазин')).toBeInTheDocument()
  })

  it('renders all 3 project descriptions', () => {
    render(<PortfolioPage />)
    expect(screen.getByText(/конверсионный лендинг/i)).toBeInTheDocument()
    expect(screen.getByText(/многостраничный корпоративный/i)).toBeInTheDocument()
    expect(screen.getByText(/полноценный интернет-магазин/i)).toBeInTheDocument()
  })

  it('renders project headings as h2', () => {
    render(<PortfolioPage />)
    const h2s = screen.getAllByRole('heading', { level: 2 })
    expect(h2s).toHaveLength(3)
  })

  it('renders no "Посмотреть сайт" links when projects have no href (placeholder data)', () => {
    render(<PortfolioPage />)
    const links = screen.queryAllByRole('link', { name: /посмотреть сайт/i })
    expect(links).toHaveLength(0)
  })
})
