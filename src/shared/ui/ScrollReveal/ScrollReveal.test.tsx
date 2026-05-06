import { render } from '@testing-library/react'
import { ScrollReveal } from './ScrollReveal'

// IntersectionObserver не существует в jsdom — мокаем
const observeMock = jest.fn()
const disconnectMock = jest.fn()
let intersectCallback: IntersectionObserverCallback

beforeEach(() => {
  window.IntersectionObserver = jest.fn().mockImplementation((cb) => {
    intersectCallback = cb
    return { observe: observeMock, disconnect: disconnectMock }
  }) as unknown as typeof IntersectionObserver
})

describe('ScrollReveal', () => {
  it('renders children', () => {
    const { getByText } = render(<ScrollReveal>Hello</ScrollReveal>)
    expect(getByText('Hello')).toBeInTheDocument()
  })

  it('renders as the specified element', () => {
    const { container } = render(<ScrollReveal as="section">Content</ScrollReveal>)
    expect(container.firstChild?.nodeName).toBe('SECTION')
  })

  it('adds "visible" class when element intersects', () => {
    const { container } = render(<ScrollReveal>Content</ScrollReveal>)
    const el = container.firstChild as Element
    expect(el).not.toHaveClass('visible')

    intersectCallback(
      [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    expect(el).toHaveClass('visible')
  })

  it('passes through className and other props', () => {
    const { container } = render(
      <ScrollReveal className="myClass" id="test">
        x
      </ScrollReveal>,
    )
    const el = container.firstChild as Element
    expect(el).toHaveClass('myClass')
    expect(el).toHaveAttribute('id', 'test')
  })
})
