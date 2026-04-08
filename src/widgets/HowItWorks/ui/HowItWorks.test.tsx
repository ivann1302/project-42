import { render, screen, act } from '@testing-library/react'
import { HowItWorks } from './HowItWorks'

describe('HowItWorks', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
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

  it('adds visible class to list when IntersectionObserver fires', () => {
    let triggerIntersect: (entries: Partial<IntersectionObserverEntry>[]) => void = () => {}

    global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      triggerIntersect = (entries) =>
        callback(entries as IntersectionObserverEntry[], {} as IntersectionObserver)
      return { observe: jest.fn(), disconnect: jest.fn() }
    })

    render(<HowItWorks />)
    const list = screen.getByRole('list')
    expect(list).not.toHaveClass('visible')

    act(() => {
      triggerIntersect([{ isIntersecting: true }])
    })

    expect(list).toHaveClass('visible')
  })
})
