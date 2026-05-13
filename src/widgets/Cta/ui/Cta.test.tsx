import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Cta } from './Cta'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

beforeEach(() => {
  mockPush.mockClear()
})

describe('Cta', () => {
  it('renders default heading when no props', () => {
    render(<Cta />)
    expect(screen.getByText(/сейчас мы открыты/i)).toBeInTheDocument()
  })

  it('renders custom heading when provided', () => {
    render(<Cta heading="Передайте сайт на поддержку" />)
    expect(screen.getByText('Передайте сайт на поддержку')).toBeInTheDocument()
  })

  it('renders the quiz on the page', () => {
    render(<Cta />)
    expect(screen.getByLabelText('Сфера деятельности')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('uses custom button text on the final quiz step', async () => {
    const user = userEvent.setup()
    render(<Cta buttonText="Оставить заявку" />)

    await user.type(screen.getByLabelText('Сфера деятельности'), 'Онлайн-школа')
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await user.click(screen.getByRole('button', { name: 'Частично готов' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await user.click(screen.getByRole('button', { name: 'В течение недели' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(screen.getByRole('button', { name: 'Оставить заявку' })).toBeInTheDocument()
  })

  it('moves through quiz steps', async () => {
    const user = userEvent.setup()
    render(<Cta />)

    expect(screen.getByLabelText('Сфера деятельности')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Далее' }))
    expect(screen.getByText('Заполните этот шаг, чтобы продолжить.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Сфера деятельности'), 'Онлайн-школа')
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    expect(
      screen.getByText('Есть ли контент для сайта: текст, изображения и другое?'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Частично готов' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    expect(screen.getByText('Как срочно нужно?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'В течение недели' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    expect(screen.getByLabelText('Телефон или ник в Telegram')).toBeInTheDocument()
    expect(screen.getByText('Как удобнее связаться?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Telegram' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'WhatsApp' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'MAX' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'По телефону' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Забронировать место' }))
    expect(screen.getByText('Укажите телефон или ник в Telegram.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Телефон или ник в Telegram'), '@school')
    await user.click(screen.getByRole('button', { name: 'Telegram' }))
    expect(screen.getByRole('button', { name: 'Telegram' })).toHaveClass('optionButtonActive')
  })

  it('supports Enter key navigation and option selection', async () => {
    const user = userEvent.setup()
    render(<Cta />)

    await user.type(screen.getByLabelText('Сфера деятельности'), 'Клиника{Enter}')
    expect(
      screen.getByText('Есть ли контент для сайта: текст, изображения и другое?'),
    ).toBeInTheDocument()

    const contentOption = screen.getByRole('button', { name: 'Да, всё готово' })
    contentOption.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByText('Как срочно нужно?')).toBeInTheDocument()
  })

  it('submits the quiz with Enter on the final contact method', async () => {
    const user = userEvent.setup()
    const fetchMock = jest.fn().mockResolvedValue({ ok: true })
    global.fetch = fetchMock as unknown as typeof fetch

    render(<Cta />)

    await user.type(screen.getByLabelText('Сфера деятельности'), 'Клиника{Enter}')
    screen.getByRole('button', { name: 'Да, всё готово' }).focus()
    await user.keyboard('{Enter}')
    screen.getByRole('button', { name: 'Как можно быстрее' }).focus()
    await user.keyboard('{Enter}')
    await user.type(screen.getByLabelText('Телефон или ник в Telegram'), '@clinic')
    screen.getByRole('button', { name: 'Telegram' }).focus()
    await user.keyboard('{Enter}')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/thank-you'))
  })
})
