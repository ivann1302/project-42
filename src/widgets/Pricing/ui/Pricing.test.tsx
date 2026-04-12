import { render, screen } from '@testing-library/react'
import { Pricing } from './Pricing'
import type { PricingPlan } from '@/entities/PricingPlan'

const testPlans: PricingPlan[] = [
  {
    id: 'test',
    name: 'Тестовый тариф',
    price: 'от 1 000 ₽',
    priceNote: 'для теста',
    description: 'Описание',
    features: ['Фича 1'],
    cta: 'Выбрать',
  },
]

describe('Pricing', () => {
  it('renders default plans when no props', () => {
    render(<Pricing />)
    expect(screen.getByText('Лендинг')).toBeInTheDocument()
  })

  it('renders custom plans when provided', () => {
    render(<Pricing plans={testPlans} />)
    expect(screen.getByText('Тестовый тариф')).toBeInTheDocument()
    expect(screen.queryByText('Лендинг')).not.toBeInTheDocument()
  })

  it('renders custom paymentNote when provided', () => {
    render(<Pricing plans={testPlans} paymentNote="Оплата ежемесячно." />)
    expect(screen.getByText('Оплата ежемесячно.')).toBeInTheDocument()
  })
})
