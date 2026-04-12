import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders default heading on main page (no props)', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders custom headingText when provided', () => {
    render(<Hero headingText="Разработка сайтов под ключ" />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Разработка сайтов под ключ',
    )
  })

  it('renders custom sub when provided', () => {
    render(<Hero sub="Кастомный подзаголовок" />)
    expect(screen.getByText('Кастомный подзаголовок')).toBeInTheDocument()
  })

  it('renders custom primary CTA label', () => {
    render(<Hero ctaPrimary={{ label: 'Обсудить разработку', href: '#cta' }} />)
    expect(screen.getByRole('link', { name: 'Обсудить разработку' })).toBeInTheDocument()
  })
})
