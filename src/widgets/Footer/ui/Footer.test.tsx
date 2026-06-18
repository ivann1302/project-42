import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

let mockPathname = '/'

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}))

beforeEach(() => {
  mockPathname = '/'
})

describe('Footer', () => {
  it('renders the logo', () => {
    render(<Footer />)
    const logo = screen.getByRole('link', { name: 'Project 42 - на главную' })
    expect(logo).toHaveAttribute('href', '/')
  })

  it('points section links to razrabotka page outside razrabotka route', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Что входит' })).toHaveAttribute(
      'href',
      '/razrabotka-sayta#services',
    )
  })

  it('renders page-local section links on razrabotka route', () => {
    mockPathname = '/razrabotka-sayta'
    render(<Footer />)
    const processLink = screen.getByRole('link', { name: 'Как работаем' })
    expect(processLink).toHaveAttribute('href', '#process')
  })

  it('renders privacy policy link', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Политика конфиденциальности' })).toHaveAttribute(
      'href',
      '/privacy-policy',
    )
  })

  it('renders offer link', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Публичная оферта' })).toHaveAttribute('href', '/offer')
  })

  it('points contact cta to razrabotka page outside razrabotka route', () => {
    render(<Footer />)

    expect(screen.getByRole('link', { name: /разобрать задачу/i })).toHaveAttribute(
      'href',
      '/razrabotka-sayta#cta',
    )
  })
})
