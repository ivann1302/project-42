import { render, screen } from '@testing-library/react'
import { Header } from './Header'

let mockPathname = '/'

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}))

beforeEach(() => {
  mockPathname = '/'
})

describe('Header', () => {
  it('renders the logo', () => {
    render(<Header />)
    expect(screen.getByText(/project/i)).toBeInTheDocument()
  })

  it('renders the logo pointing to home', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /project\s*42/i })).toHaveAttribute('href', '/')
  })

  it('points section links to razrabotka page outside razrabotka route', () => {
    render(<Header />)
    const servicesLink = screen.getByRole('link', { name: 'Услуги' })
    expect(servicesLink).toHaveAttribute('href', '/razrabotka-sayta#services')
  })

  it('renders page-local links on razrabotka route', () => {
    mockPathname = '/razrabotka-sayta'
    render(<Header />)

    expect(screen.getByRole('link', { name: 'Услуги' })).toHaveAttribute('href', '#services')
    expect(screen.getByRole('link', { name: 'Проекты' })).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: 'О нас' })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: 'Этапы' })).toHaveAttribute('href', '#process')
    expect(screen.getByRole('link', { name: 'Контакты' })).toHaveAttribute('href', '#contacts')
  })

  it('points cta links to razrabotka page outside razrabotka route', () => {
    render(<Header />)

    expect(screen.getAllByRole('link', { name: /обсудить проект/i })[0]).toHaveAttribute(
      'href',
      '/razrabotka-sayta#cta',
    )
  })
})
