import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { trackYandexMetrikaLeadConversion } from '@/shared/lib/metrika'
import { ContactForm } from './ContactForm'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))
jest.mock('@/shared/lib/metrika', () => ({
  trackYandexMetrikaLeadConversion: jest.fn().mockResolvedValue(undefined),
  YANDEX_METRIKA_LEAD_THANK_YOU_URL: '/thank-you',
}))

const originalFetch = global.fetch

beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  global.fetch = originalFetch
})

async function submitForm() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Имя *'), 'Проверка')
  await user.type(screen.getByLabelText('Email'), 'audit@example.com')
  await user.click(screen.getByRole('button', { name: 'Отправить заявку' }))
}

it.each([{ ok: false }, { success: true }, null])(
  'does not count a conversion for an unconfirmed HTTP 200 response: %j',
  async (body) => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => body })
    render(<ContactForm />)
    await submitForm()
    expect(await screen.findByRole('alert')).toHaveTextContent('Ошибка отправки')
    expect(screen.getByLabelText('Email')).toHaveValue('audit@example.com')
    expect(trackYandexMetrikaLeadConversion).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  },
)

it('counts a conversion and redirects only after the server confirms the lead', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
  render(<ContactForm />)
  await submitForm()
  await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/thank-you'))
  expect(trackYandexMetrikaLeadConversion).toHaveBeenCalledTimes(1)
})

it('shows confirmation on the development page without navigating away', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
  render(<ContactForm stayOnPage />)
  await submitForm()
  expect(await screen.findByRole('status')).toHaveTextContent('Заявка отправлена')
  expect(mockPush).not.toHaveBeenCalled()
  expect(trackYandexMetrikaLeadConversion).toHaveBeenCalledTimes(1)
})
