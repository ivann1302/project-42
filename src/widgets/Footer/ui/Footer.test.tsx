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
    const logo = screen.getByRole('link', { name: /project/i })
    expect(logo).toHaveAttribute('href', '/')
  })

  it('renders the Портфолио nav link pointing to /portfolio', () => {
    render(<Footer />)
    const links = screen.getAllByRole('link', { name: 'Портфолио' })
    expect(links[0]).toHaveAttribute('href', '/portfolio')
  })

  it('renders process hash nav link with correct href', () => {
    render(<Footer />)
    const processLink = screen.getByRole('link', { name: 'Как работаем' })
    expect(processLink).toHaveAttribute('href', '/#process')
  })

  it('points home links to razrabotka page from portfolio page', () => {
    mockPathname = '/portfolio'
    render(<Footer />)

    expect(screen.getByRole('link', { name: /project/i })).toHaveAttribute(
      'href',
      '/razrabotka-sayta',
    )
    expect(screen.getByRole('link', { name: 'Как работаем' })).toHaveAttribute(
      'href',
      '/razrabotka-sayta#process',
    )
    expect(screen.getByRole('link', { name: 'Цены' })).toHaveAttribute(
      'href',
      '/razrabotka-sayta#pricing',
    )
  })
})
