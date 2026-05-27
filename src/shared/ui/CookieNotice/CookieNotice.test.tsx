import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CookieNotice } from './CookieNotice'

const STORAGE_KEY = 'webstudio-cookie-notice-accepted'

describe('CookieNotice', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('shows cookie notice when it has not been accepted', async () => {
    render(<CookieNotice />)
    expect(await screen.findByLabelText('Уведомление о cookie')).toBeInTheDocument()
  })

  it('hides notice and stores acceptance after click', async () => {
    render(<CookieNotice />)

    await userEvent.click(await screen.findByRole('button', { name: 'Понятно' }))

    expect(screen.queryByLabelText('Уведомление о cookie')).not.toBeInTheDocument()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('true')
  })

  it('does not show notice when acceptance is already stored', () => {
    window.localStorage.setItem(STORAGE_KEY, 'true')

    render(<CookieNotice />)

    expect(screen.queryByLabelText('Уведомление о cookie')).not.toBeInTheDocument()
  })
})
