import { render, screen } from '@testing-library/react'
import { Testimonials } from './Testimonials'
import type { Testimonial } from '@/entities/Testimonial'

describe('Testimonials', () => {
  it('renders default testimonials when no props', () => {
    render(<Testimonials />)
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0)
  })

  it('renders provided items', () => {
    const items: Testimonial[] = [
      {
        id: 't-test',
        text: 'Отличная работа',
        author: 'Тест Тестов',
        role: 'CEO',
        company: 'Test Co',
      },
    ]
    render(<Testimonials items={items} />)
    expect(screen.getByText('Отличная работа')).toBeInTheDocument()
  })
})
