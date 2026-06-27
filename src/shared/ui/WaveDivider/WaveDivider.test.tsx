import { act, render, screen } from '@testing-library/react'
import { WaveDivider } from './WaveDivider'

const MOBILE_QUERY = '(max-width: 767px)'

const createRect = (top: number, width = 360) =>
  ({
    bottom: top + 1,
    height: 1,
    left: 0,
    right: width,
    top,
    width,
    x: 0,
    y: top,
    toJSON: () => ({}),
  }) as DOMRect

function setViewport({ height = 800, width = 390 } = {}) {
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: height,
    writable: true,
  })
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: width,
    writable: true,
  })
}

function setDocumentHeight(height: number) {
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: height,
  })
  Object.defineProperty(document.body, 'scrollHeight', {
    configurable: true,
    value: height,
  })
}

function setScrollY(scrollY: number) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value: scrollY,
    writable: true,
  })
}

function mockMatchMedia({ isMobile = true } = {}) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: jest.fn((query: string) => ({
      matches: query === MOBILE_QUERY ? isMobile : false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

describe('WaveDivider', () => {
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect
  const originalRequestAnimationFrame = window.requestAnimationFrame
  const originalCancelAnimationFrame = window.cancelAnimationFrame

  beforeEach(() => {
    setViewport()
    setDocumentHeight(3200)
    setScrollY(0)
    mockMatchMedia()

    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: jest.fn(() => 1),
    })
    Object.defineProperty(window, 'cancelAnimationFrame', {
      configurable: true,
      value: jest.fn(),
    })
  })

  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: originalRequestAnimationFrame,
    })
    Object.defineProperty(window, 'cancelAnimationFrame', {
      configurable: true,
      value: originalCancelAnimationFrame,
    })
    jest.restoreAllMocks()
  })

  it('springs when the divider first becomes visible on phones', () => {
    let lineTop = 900
    Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
      if ((this as HTMLElement).dataset.testid === 'wave-divider-line') {
        return createRect(lineTop)
      }

      return originalGetBoundingClientRect.call(this)
    }

    render(<WaveDivider autoBounceOnMobile />)

    const path = screen.getByTestId('wave-divider').querySelector('path')
    expect(path).toHaveAttribute('d', 'M0 100 Q180 100, 360 100')

    lineTop = 560

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(path).toHaveAttribute('d', 'M0 100 Q180 126.4, 360 100')
  })

  it('springs when the divider first becomes visible on desktop', () => {
    setViewport({ height: 900, width: 1280 })
    mockMatchMedia({ isMobile: false })

    let lineTop = 960
    Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
      if ((this as HTMLElement).dataset.testid === 'wave-divider-line') {
        return createRect(lineTop, 1280)
      }

      return originalGetBoundingClientRect.call(this)
    }

    render(<WaveDivider autoBounce />)

    const path = screen.getByTestId('wave-divider').querySelector('path')
    expect(path).toHaveAttribute('d', 'M0 100 Q640 100, 1280 100')

    lineTop = 700

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(path).toHaveAttribute('d', 'M0 100 Q640 126.4, 1280 100')
  })

  it('springs again on upward scroll after the page bottom was reached', () => {
    const frameCallbacks = new Map<number, FrameRequestCallback>()
    let frameId = 0
    const runAnimationFrames = (limit = 240) => {
      let framesLeft = limit

      while (frameCallbacks.size > 0 && framesLeft > 0) {
        const callbacks = Array.from(frameCallbacks.entries())
        frameCallbacks.clear()

        callbacks.forEach(([, callback]) => callback(performance.now()))
        framesLeft -= 1
      }
    }

    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: jest.fn((callback: FrameRequestCallback) => {
        frameId += 1
        frameCallbacks.set(frameId, callback)
        return frameId
      }),
    })
    Object.defineProperty(window, 'cancelAnimationFrame', {
      configurable: true,
      value: jest.fn((id: number) => {
        frameCallbacks.delete(id)
      }),
    })

    let lineTop = 560
    Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
      if ((this as HTMLElement).dataset.testid === 'wave-divider-line') {
        return createRect(lineTop)
      }

      return originalGetBoundingClientRect.call(this)
    }

    render(<WaveDivider autoBounceOnMobile />)

    const path = screen.getByTestId('wave-divider').querySelector('path')
    expect(path).toHaveAttribute('d', 'M0 100 Q180 126.4, 360 100')
    runAnimationFrames()

    lineTop = -700
    setScrollY(2400)

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(path).toHaveAttribute('d', 'M0 100 Q180 84.4, 360 100')
    runAnimationFrames()

    lineTop = 420
    setScrollY(2280)

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(path).toHaveAttribute('d', 'M0 100 Q180 126.4, 360 100')
  })
})
