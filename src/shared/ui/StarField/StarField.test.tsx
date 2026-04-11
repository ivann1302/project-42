import { render, screen } from '@testing-library/react'
import { StarField } from './StarField'

describe('StarField', () => {
  it('renders three star layer divs', () => {
    render(<StarField />)
    expect(screen.getAllByTestId('star-layer')).toHaveLength(3)
  })

  it('does not render a canvas element', () => {
    render(<StarField />)
    expect(document.querySelector('canvas')).toBeNull()
  })

  it('renders blob when blobColor is provided', () => {
    render(<StarField blobColor="rgba(120,80,255,0.4)" />)
    expect(screen.getByTestId('starfield-blob')).toBeInTheDocument()
  })

  it('does not render blob when blobColor is omitted', () => {
    render(<StarField />)
    expect(screen.queryByTestId('starfield-blob')).toBeNull()
  })
})
