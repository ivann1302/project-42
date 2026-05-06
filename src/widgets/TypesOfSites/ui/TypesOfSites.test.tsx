import { render, screen } from '@testing-library/react'
import { TypesOfSites } from './TypesOfSites'
import type { TypeOfSite } from '@/entities/ServicePage'

const items: TypeOfSite[] = [
  { icon: 'target', title: 'Лендинг', description: 'Одностраничный.', price: 'от 9 900 ₽' },
  { icon: 'layers', title: 'Корпоративный', description: 'Многостраничный.', price: 'от 79 900 ₽' },
]

describe('TypesOfSites', () => {
  it('renders section heading', () => {
    render(<TypesOfSites items={items} />)
    expect(screen.getByText('Какие сайты мы делаем')).toBeInTheDocument()
  })

  it('renders all items', () => {
    render(<TypesOfSites items={items} />)
    expect(screen.getByText('Лендинг')).toBeInTheDocument()
    expect(screen.getByText('Корпоративный')).toBeInTheDocument()
  })

  it('renders price for each item', () => {
    render(<TypesOfSites items={items} />)
    expect(screen.getByText('от 9 900 ₽')).toBeInTheDocument()
  })
})
