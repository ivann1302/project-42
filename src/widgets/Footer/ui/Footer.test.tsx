import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

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

  it('renders hash nav links as anchors with correct hrefs', () => {
    render(<Footer />)
    const servicesLink = screen.getByRole('link', { name: 'Услуги' })
    expect(servicesLink).toHaveAttribute('href', '#services')
  })
})
