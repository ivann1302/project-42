import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Faq } from './Faq'
import type { FaqItem } from '@/entities/FaqItem'

const twoItems: FaqItem[] = [
  { id: 'q1', question: 'Вопрос первый?', answer: 'Ответ первый.' },
  { id: 'q2', question: 'Вопрос второй?', answer: 'Ответ второй.' },
]

describe('Faq', () => {
  it('renders the section heading', () => {
    render(<Faq items={twoItems} />)
    expect(screen.getByText(/частые вопросы/i)).toBeInTheDocument()
  })

  it('renders all provided questions', () => {
    render(<Faq items={twoItems} />)
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('all answers are hidden on initial render', () => {
    render(<Faq items={twoItems} />)
    screen.getAllByRole('button').forEach((btn) => {
      expect(btn).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('clicking a trigger opens its answer', async () => {
    render(<Faq items={twoItems} />)
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[0])
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')
  })

  it('clicking an open trigger closes it', async () => {
    render(<Faq items={twoItems} />)
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[0])
    await userEvent.click(buttons[0])
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false')
  })

  it('opening one item closes the previously open item', async () => {
    render(<Faq items={twoItems} />)
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[0])
    await userEvent.click(buttons[1])
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false')
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'true')
  })

  it('each trigger has aria-controls pointing to its answer region', () => {
    render(<Faq items={twoItems} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      const controlsId = btn.getAttribute('aria-controls')
      expect(controlsId).toBeTruthy()
      expect(document.getElementById(controlsId!)).toBeInTheDocument()
    })
  })

  it('renders custom title when provided', () => {
    render(<Faq items={twoItems} title="Вопросы о поддержке" />)
    expect(screen.getByText('Вопросы о поддержке')).toBeInTheDocument()
  })
})
