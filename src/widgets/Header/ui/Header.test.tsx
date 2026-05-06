import { render, screen } from '@testing-library/react'
import { Header } from './Header'

let mockPathname = '/'

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}))

beforeEach(() => {
  mockPathname = '/'
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  }))
})

describe('Header', () => {
  it('renders the logo', () => {
    render(<Header />)
    expect(screen.getByText(/project/i)).toBeInTheDocument()
  })

  it('renders the Портфолио nav link pointing to /portfolio', () => {
    render(<Header />)
    const link = screen.getByRole('link', { name: 'Портфолио' })
    expect(link).toHaveAttribute('href', '/portfolio')
  })

  it('renders hash nav links as anchors with correct hrefs', () => {
    render(<Header />)
    const servicesLink = screen.getByRole('link', { name: 'Услуги' })
    expect(servicesLink).toHaveAttribute('href', '#services')
  })

  it('renders page-local links on razrabotka page', () => {
    mockPathname = '/razrabotka-sayta'
    render(<Header />)

    expect(screen.getByRole('link', { name: /project\s*42/i })).toHaveAttribute('href', '#hero')
    expect(screen.getByRole('link', { name: 'Как работаем' })).toHaveAttribute('href', '#process')
    expect(screen.getByRole('link', { name: 'Проекты' })).toHaveAttribute('href', '#portfolio')
    expect(screen.getByRole('link', { name: 'Цены' })).toHaveAttribute('href', '#pricing')
    expect(screen.getByRole('link', { name: 'Обсудить' })).toHaveAttribute('href', '#cta')
  })
})
