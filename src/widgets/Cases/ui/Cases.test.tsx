import { render, screen } from '@testing-library/react'
import { Cases } from './Cases'
import type { CaseItem } from '@/entities/ServicePage'

const items: CaseItem[] = [
  {
    id: 'case-1',
    title: 'Тестовый кейс',
    niche: 'IT',
    metricsBefore: 'Трафик: 0',
    metricsAfter: 'Трафик: 500/мес',
    duration: '3 месяца',
    tags: ['SEO'],
  },
]

describe('Cases', () => {
  it('renders section title', () => {
    render(<Cases items={items} />)
    expect(screen.getByText('Кейсы')).toBeInTheDocument()
  })

  it('renders case title', () => {
    render(<Cases items={items} />)
    expect(screen.getByText('Тестовый кейс')).toBeInTheDocument()
  })

  it('renders before and after metrics', () => {
    render(<Cases items={items} />)
    expect(screen.getByText('Трафик: 0')).toBeInTheDocument()
    expect(screen.getByText('Трафик: 500/мес')).toBeInTheDocument()
  })

  it('renders tags', () => {
    render(<Cases items={items} />)
    expect(screen.getByText('SEO')).toBeInTheDocument()
  })
})
