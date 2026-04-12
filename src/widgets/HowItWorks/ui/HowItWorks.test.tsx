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

  it('renders default steps when no props', () => {
    render(<HowItWorks />)
    expect(screen.getByText('Погружение')).toBeInTheDocument()
  })

  it('renders custom steps when provided', () => {
    const steps = [
      { num: '01', title: 'Аудит', description: 'Анализ текущего состояния сайта.' },
      { num: '02', title: 'Стратегия', description: 'Формируем план продвижения.' },
    ]
    render(<HowItWorks steps={steps} />)
    expect(screen.getByText('Аудит')).toBeInTheDocument()
    expect(screen.queryByText('Погружение')).not.toBeInTheDocument()
  })

  it('renders custom eyebrow and title', () => {
    render(<HowItWorks eyebrow="Как работаем" title="Процесс продвижения" steps={[]} />)
    expect(screen.getByText('Как работаем')).toBeInTheDocument()
    expect(screen.getByText('Процесс продвижения')).toBeInTheDocument()
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
