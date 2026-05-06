import { render, screen } from '@testing-library/react'
import { WhatIncludes } from './WhatIncludes'
import type { WhatIncludesColumn } from '@/entities/ServicePage'

const columns: WhatIncludesColumn[] = [
  { label: 'SEO', items: ['Технический аудит', 'Семантика'] },
  { label: 'GEO', items: ['llms.txt', 'Schema'] },
]

describe('WhatIncludes', () => {
  it('renders section title', () => {
    render(<WhatIncludes eyebrow="Что входит" title="SEO + GEO" columns={columns} />)
    expect(screen.getByText('SEO + GEO')).toBeInTheDocument()
  })

  it('renders column labels', () => {
    render(<WhatIncludes eyebrow="Что входит" title="SEO + GEO" columns={columns} />)
    expect(screen.getByText('SEO')).toBeInTheDocument()
    expect(screen.getByText('GEO')).toBeInTheDocument()
  })

  it('renders all items in columns', () => {
    render(<WhatIncludes eyebrow="Что входит" title="SEO + GEO" columns={columns} />)
    expect(screen.getByText('Технический аудит')).toBeInTheDocument()
    expect(screen.getByText('llms.txt')).toBeInTheDocument()
  })
})
