import { render, screen } from '@testing-library/react'
import { RazrabotkaPage } from './RazrabotkaPage'
import { razrabotkaConfig } from '@/entities/ServicePage'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

beforeEach(() => {
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  }))
})

describe('RazrabotkaPage', () => {
  it('renders hero heading', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      razrabotkaConfig.hero.headingText,
    )
  })

  it('renders WhatYouGet section', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)
    expect(
      screen.getByText(/Почему наш лендинг\s+будет лучше чем у ваших конкурентов\?/),
    ).toBeInTheDocument()
  })

  it('renders approach section', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)
    expect(screen.getByText('Лендинг должен')).toBeInTheDocument()
    expect(screen.getByText('объяснять оффер и приводить заявку')).toBeInTheDocument()
  })

  it('renders landing-specific sections', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)
    expect(screen.getByText('Результат после запуска')).toBeInTheDocument()
    expect(screen.getByText('Почему наш подход лучше сайта на конструкторе?')).toBeInTheDocument()
    expect(screen.getByText('Поддержка после запуска')).toBeInTheDocument()
  })
})
