import { render, screen } from '@testing-library/react'
import { WhyNow } from './WhyNow'

const config = {
  eyebrow: 'Почему сейчас',
  title: 'AI меняет правила поиска',
  sub: 'Подзаголовок.',
  items: [{ icon: 'globe' as const, title: 'Google AI Overviews', description: 'Описание.' }],
}

describe('WhyNow', () => {
  it('renders title', () => {
    render(<WhyNow {...config} />)
    expect(screen.getByText('AI меняет правила поиска')).toBeInTheDocument()
  })

  it('renders sub text', () => {
    render(<WhyNow {...config} />)
    expect(screen.getByText('Подзаголовок.')).toBeInTheDocument()
  })

  it('renders all items', () => {
    render(<WhyNow {...config} />)
    expect(screen.getByText('Google AI Overviews')).toBeInTheDocument()
  })
})
