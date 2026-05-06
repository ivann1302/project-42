import { render, screen } from '@testing-library/react'
import { WhatYouGet } from './WhatYouGet'
import type { ServiceIconItem } from '@/entities/ServicePage'

const items: ServiceIconItem[] = [
  { icon: 'monitor', title: 'Дизайн', description: 'Красивый интерфейс.' },
  { icon: 'code', title: 'Разработка', description: 'Чистый код.' },
]

describe('WhatYouGet', () => {
  it('renders section title', () => {
    render(<WhatYouGet items={items} />)
    expect(screen.getByText('Что входит в разработку')).toBeInTheDocument()
  })

  it('renders all items', () => {
    render(<WhatYouGet items={items} />)
    expect(screen.getByText('Дизайн')).toBeInTheDocument()
    expect(screen.getByText('Разработка')).toBeInTheDocument()
  })

  it('renders custom title when provided', () => {
    render(<WhatYouGet items={items} title="Что включено" />)
    expect(screen.getByText('Что включено')).toBeInTheDocument()
  })
})
