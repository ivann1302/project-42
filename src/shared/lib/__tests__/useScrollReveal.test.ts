import { act, renderHook } from '@testing-library/react'
import { useScrollReveal } from '../useScrollReveal'

describe('useScrollReveal', () => {
  let mockObserve: jest.Mock
  let mockDisconnect: jest.Mock
  let intersectCallback: (entries: Partial<IntersectionObserverEntry>[]) => void

  beforeEach(() => {
    mockObserve = jest.fn()
    mockDisconnect = jest.fn()
    global.IntersectionObserver = jest.fn().mockImplementation((cb) => {
      intersectCallback = (entries) =>
        cb(entries as IntersectionObserverEntry[], {} as IntersectionObserver)
      return { observe: mockObserve, disconnect: mockDisconnect }
    })
  })

  it('adds visible class when element intersects', () => {
    const div = document.createElement('div')
    const ref = { current: div } as React.RefObject<HTMLDivElement>
    renderHook(() => useScrollReveal(ref))
    expect(div.classList.contains('visible')).toBe(false)
    act(() => {
      intersectCallback([{ isIntersecting: true }])
    })
    expect(div.classList.contains('visible')).toBe(true)
  })

  it('does not add visible class when not intersecting', () => {
    const div = document.createElement('div')
    const ref = { current: div } as React.RefObject<HTMLDivElement>
    renderHook(() => useScrollReveal(ref))
    act(() => {
      intersectCallback([{ isIntersecting: false }])
    })
    expect(div.classList.contains('visible')).toBe(false)
  })

  it('disconnects observer after first intersection', () => {
    const div = document.createElement('div')
    const ref = { current: div } as React.RefObject<HTMLDivElement>
    renderHook(() => useScrollReveal(ref))
    act(() => {
      intersectCallback([{ isIntersecting: true }])
    })
    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('calls onReveal callback on intersection', () => {
    const onReveal = jest.fn()
    const div = document.createElement('div')
    const ref = { current: div } as React.RefObject<HTMLDivElement>
    renderHook(() => useScrollReveal(ref, { onReveal }))
    act(() => {
      intersectCallback([{ isIntersecting: true }])
    })
    expect(onReveal).toHaveBeenCalledTimes(1)
  })

  it('does not throw when IntersectionObserver is unavailable (SSR)', () => {
    const original = global.IntersectionObserver
    // @ts-expect-error intentionally undefined for SSR test
    delete global.IntersectionObserver
    const div = document.createElement('div')
    const ref = { current: div } as React.RefObject<HTMLDivElement>
    expect(() => renderHook(() => useScrollReveal(ref))).not.toThrow()
    global.IntersectionObserver = original
  })

  describe('prefers-reduced-motion', () => {
    let originalMatchMedia: typeof window.matchMedia

    beforeEach(() => {
      originalMatchMedia = window.matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })
    })

    afterEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: originalMatchMedia,
      })
    })

    it('adds visible class immediately when prefers-reduced-motion is set', () => {
      const onReveal = jest.fn()
      const div = document.createElement('div')
      const ref = { current: div } as React.RefObject<HTMLDivElement>

      renderHook(() => useScrollReveal(ref, { onReveal }))

      expect(div.classList.contains('visible')).toBe(true)
      expect(onReveal).toHaveBeenCalledTimes(1)
      expect(mockObserve).not.toHaveBeenCalled()
    })
  })
})
