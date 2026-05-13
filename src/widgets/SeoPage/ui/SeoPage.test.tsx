import { render, screen } from '@testing-library/react'
import { SeoPage } from './SeoPage'
import { seoConfig } from '@/entities/ServicePage'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

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
