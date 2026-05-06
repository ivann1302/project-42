import { render, screen } from '@testing-library/react'
import { SeoPage } from './SeoPage'
import { seoConfig } from '@/entities/ServicePage'

describe('SeoPage', () => {
  it('renders hero heading', () => {
    render(<SeoPage config={seoConfig} />)
    expect(screen.getByText('SEO-продвижение и GEO-оптимизация')).toBeInTheDocument()
  })

  it('renders WhyNow section', () => {
    render(<SeoPage config={seoConfig} />)
    expect(screen.getByText('AI меняет правила поиска')).toBeInTheDocument()
  })

  it('renders Cases section', () => {
    render(<SeoPage config={seoConfig} />)
    expect(screen.getByText('Кейсы')).toBeInTheDocument()
  })
})
