import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Hero } from './Hero'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

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

  it('renders secondary gradient subheading when provided', () => {
    render(
      <Hero
        gradientSubheading="от 20 000 рублей"
        gradientSubheadingSecondary="от 5 рабочих дней"
      />,
    )
    expect(screen.getByText(/рабочих дней/).closest('p')).toHaveTextContent('от 5 рабочих дней')
  })

  it('renders custom primary CTA label', () => {
    render(<Hero ctaPrimary={{ label: 'Обсудить разработку', href: '#cta' }} />)
    expect(screen.getByRole('link', { name: 'Обсудить разработку' })).toBeInTheDocument()
  })

  it('opens the contact form from the default primary CTA', async () => {
    const user = userEvent.setup()

    render(<Hero />)
    await user.click(screen.getByRole('button', { name: 'Обсудить проект' }))

    expect(screen.getByRole('dialog', { name: 'Обсудить проект' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Иван Иванов')).toBeInTheDocument()
  })
})
