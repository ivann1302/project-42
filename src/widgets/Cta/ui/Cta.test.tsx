import { render, screen } from '@testing-library/react'
import { Cta } from './Cta'

describe('Cta', () => {
  it('renders default heading when no props', () => {
    render(<Cta />)
    expect(screen.getByText(/сейчас мы открыты/i)).toBeInTheDocument()
  })

  it('renders custom heading when provided', () => {
    render(<Cta heading="Передайте сайт на поддержку" />)
    expect(screen.getByText('Передайте сайт на поддержку')).toBeInTheDocument()
  })

  it('renders custom button text', () => {
    render(<Cta buttonText="Оставить заявку" />)
    expect(screen.getByRole('button', { name: 'Оставить заявку' })).toBeInTheDocument()
  })
})
