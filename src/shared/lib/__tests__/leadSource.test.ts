import { captureLeadAttribution, getLeadSourcePayload } from '../leadSource'

describe('leadSource', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.history.pushState(null, '', '/')
    Object.defineProperty(document, 'referrer', {
      configurable: true,
      value: '',
    })
  })

  it('keeps the first landing page and tracking params for later form submits', () => {
    Object.defineProperty(document, 'referrer', {
      configurable: true,
      value: 'https://search.example/query',
    })
    window.history.pushState(
      null,
      '',
      '/landing?utm_source=yandex&utm_medium=cpc&utm_campaign=summer&yclid=123',
    )

    captureLeadAttribution()
    window.history.pushState(null, '', '/contacts')

    expect(getLeadSourcePayload('contact_form', 'Обычная форма заявки')).toMatchObject({
      _source: 'contact_form',
      _sourceLabel: 'Обычная форма заявки',
      _sourceUrl: 'http://localhost/contacts',
      _landingPage:
        'http://localhost/landing?utm_source=yandex&utm_medium=cpc&utm_campaign=summer&yclid=123',
      _referrer: 'https://search.example/query',
      _utm_source: 'yandex',
      _utm_medium: 'cpc',
      _utm_campaign: 'summer',
      _yclid: '123',
    })
  })
})
