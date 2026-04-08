import { render, screen } from '@testing-library/react'
import { Header } from './Header'

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
})
