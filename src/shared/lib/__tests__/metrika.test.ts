import {
  shouldSkipYandexMetrikaHit,
  trackYandexMetrikaLeadConversion,
  YANDEX_METRIKA_CONTACT_FORM_GOAL,
  YANDEX_METRIKA_ID,
  YANDEX_METRIKA_LEAD_THANK_YOU_URL,
} from '../metrika'

describe('metrika', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    delete window.ym
  })

  it('sends the lead goal and a thank-you page hit before navigation', async () => {
    const ymMock: NonNullable<Window['ym']> = jest.fn(
      (_counterId, method, _target, optionsOrParams, callback) => {
        if (method === 'hit' && typeof optionsOrParams === 'object') {
          const callbackFromOptions = optionsOrParams.callback
          if (typeof callbackFromOptions === 'function') callbackFromOptions()
        }

        if (method === 'reachGoal' && typeof callback === 'function') {
          callback()
        }
      },
    )

    window.ym = ymMock

    await trackYandexMetrikaLeadConversion()

    expect(ymMock).toHaveBeenCalledWith(
      YANDEX_METRIKA_ID,
      'reachGoal',
      YANDEX_METRIKA_CONTACT_FORM_GOAL,
      undefined,
      expect.any(Function),
    )
    expect(ymMock).toHaveBeenCalledWith(
      YANDEX_METRIKA_ID,
      'hit',
      YANDEX_METRIKA_LEAD_THANK_YOU_URL,
      expect.objectContaining({
        callback: expect.any(Function),
        referer: window.location.href,
        title: 'Спасибо за заявку',
      }),
    )
    expect(shouldSkipYandexMetrikaHit('http://localhost/thank-you')).toBe(true)
    expect(shouldSkipYandexMetrikaHit('http://localhost/thank-you')).toBe(false)
  })
})
