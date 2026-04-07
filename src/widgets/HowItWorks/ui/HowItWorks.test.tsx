import { render, screen } from '@testing-library/react'
import { HowItWorks } from './HowItWorks'

describe('HowItWorks', () => {
  beforeEach(() => {
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }))
  })

  it('renders all 6 steps', () => {
    render(<HowItWorks />)
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
  })

  it('each step has --i inline style matching its index', () => {
    render(<HowItWorks />)
    const items = screen.getAllByRole('listitem')
    items.forEach((item, idx) => {
      expect(item.getAttribute('style')).toContain(`--i: ${idx}`)
    })
  })
})
