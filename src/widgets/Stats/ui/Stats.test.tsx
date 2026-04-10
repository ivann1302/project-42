import { render, screen, act } from '@testing-library/react'
import { Stats } from './Stats'

jest.mock('countup.js', () => ({
  CountUp: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
  })),
}))

describe('Stats', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }))
  })

  it('renders all 4 stat items', () => {
    render(<Stats />)
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('renders all stat labels', () => {
    render(<Stats />)
    expect(screen.getByText('проектов сданы в срок')).toBeInTheDocument()
    expect(screen.getByText('быстрее среднего за счёт AI')).toBeInTheDocument()
    expect(screen.getByText('проектов одновременно')).toBeInTheDocument()
    expect(screen.getByText('брошенных проектов')).toBeInTheDocument()
  })

  it('static stat renders its value as text', () => {
    render(<Stats />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('starts CountUp for animated stats on intersection', async () => {
    const { CountUp } = await import('countup.js')
    const startMock = jest.fn()
    ;(CountUp as jest.Mock).mockImplementation(() => ({ start: startMock }))

    let triggerIntersect: (entries: Partial<IntersectionObserverEntry>[]) => void = () => {}
    global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      triggerIntersect = (entries) =>
        callback(entries as IntersectionObserverEntry[], {} as IntersectionObserver)
      return { observe: jest.fn(), disconnect: jest.fn() }
    })

    render(<Stats />)

    await act(async () => {
      triggerIntersect([{ isIntersecting: true }])
    })

    // 3 animated stats (not the static 0)
    expect(startMock).toHaveBeenCalledTimes(3)
  })
})
