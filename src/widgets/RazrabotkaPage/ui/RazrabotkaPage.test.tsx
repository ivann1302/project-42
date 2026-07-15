import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { razrabotkaConfig } from '@/entities/ServicePage'
import { RazrabotkaPage } from './RazrabotkaPage'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  usePathname: () => '/razrabotka-sayta',
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('RazrabotkaPage', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the new design-system header', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(screen.getByTestId('razrabotka-page-canvas')).toBeInTheDocument()
    expect(screen.getByTestId('razrabotka-header')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Project 42 Веб-студия/ })).toHaveAttribute(
      'href',
      '/razrabotka-sayta',
    )
  })

  it('renders the new hero section', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Сайты и приложения для бизнеса',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Создание и продвижение')).toBeInTheDocument()
    expect(
      screen.getByText('Если вам нужен результат, а не просто красивый дизайн, то вы по адресу.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Вращающаяся сфера Project 42/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Получить консультацию/ })).toHaveAttribute(
      'href',
      '#cta',
    )
    expect(screen.getByRole('link', { name: /Наши работы/ })).toHaveAttribute('href', '#projects')
  })

  it('tilts the hero sphere toward pointer movement', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    const sphere = screen.getByRole('img', { name: /Вращающаяся сфера Project 42/ })
    sphere.getBoundingClientRect = jest.fn(() => ({
      bottom: 100,
      height: 100,
      left: 0,
      right: 100,
      top: 0,
      width: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }))

    const pointerMove = new Event('pointermove', { bubbles: true })
    Object.defineProperties(pointerMove, {
      clientX: { value: 100 },
      clientY: { value: 0 },
    })

    fireEvent(sphere, pointerMove)

    expect(sphere).toHaveStyle({
      '--sphere-shift-x': '16.00px',
      '--sphere-shift-y': '-12.00px',
      '--sphere-tilt-x': '8.00deg',
      '--sphere-tilt-y': '8.00deg',
    })

    fireEvent.pointerLeave(sphere)

    expect(sphere).toHaveStyle({
      '--sphere-shift-x': '0px',
      '--sphere-shift-y': '0px',
      '--sphere-tilt-x': '0deg',
      '--sphere-tilt-y': '0deg',
    })
  })

  it('renders the decision window section', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /30 секунд Именно столько клиенту нужно/,
      }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Окно выбора')).not.toBeInTheDocument()
    expect(screen.getByText(/ясная польза, доверие, доказательства/)).toBeInTheDocument()
    expect(screen.getByText('куда нажать дальше')).toBeInTheDocument()
  })

  it('renders the competitor choice section after the 30-second section', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    const decisionHeading = screen.getByRole('heading', {
      level: 2,
      name: /30 секунд Именно столько клиенту нужно/,
    })
    const competitorHeading = screen.getByRole('heading', {
      level: 2,
      name: 'Что, если вы лучше конкурента, а клиент всё равно выбирает его?',
    })

    expect(decisionHeading.compareDocumentPosition(competitorHeading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(screen.getByText(/клиент оценивает не весь ваш опыт/)).toBeInTheDocument()
    expect(screen.getByText('Понятный следующий шаг')).toBeInTheDocument()
    expect(screen.getByText(/показывает ваш уровень ещё до первого разговора/)).toBeInTheDocument()
  })

  it('renders the what we do section', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Что создаём?' })).toBeInTheDocument()
    expect(screen.getByText(/понятно объясняет ваш бизнес клиенту/)).toBeInTheDocument()
    expect(screen.getByText('В каждый проект входит')).toBeInTheDocument()
    expect(screen.getByText('Разработка проекта')).toBeInTheDocument()
    expect(screen.getByText('Оптимизация под ИИ')).toBeInTheDocument()
    expect(screen.getByText('Мобильная версия')).toBeInTheDocument()
    expect(screen.getByText('Настройка безопасности')).toBeInTheDocument()
    expect(screen.getByText('Цена под ключ')).toBeInTheDocument()
    expect(screen.getByText('от 15 тыс рублей')).toBeInTheDocument()
    expect(screen.queryByText('За одностраничный сайт')).not.toBeInTheDocument()
    expect(screen.getByText('Оплата по этапам')).toBeInTheDocument()
  })

  it('renders the work process section', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Как мы работаем' })).toBeInTheDocument()
    expect(screen.getAllByText('Анализ ниши и конкурентов').length).toBeGreaterThan(0)
    expect(screen.getByText('Создание прототипа и дизайна')).toBeInTheDocument()
    expect(screen.getByText('Разработка сайта и SEO')).toBeInTheDocument()
    expect(screen.getAllByText('01').length).toBeGreaterThan(0)
    expect(screen.getAllByText('02').length).toBeGreaterThan(0)
    expect(screen.getAllByText('03').length).toBeGreaterThan(0)
  })

  it('renders the cases section', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    const casesTitle = screen.getByRole('heading', { level: 2, name: 'Наши кейсы' })
    const casesSection = casesTitle.closest('section')
    expect(casesTitle).toBeInTheDocument()
    expect(casesSection).not.toBeNull()

    const cases = within(casesSection as HTMLElement)

    expect(screen.queryByRole('link', { name: 'Смотреть все кейсы' })).not.toBeInTheDocument()
    expect(cases.getByText('ROSA')).toBeInTheDocument()
    expect(cases.getAllByText('Корпоративный сайт строительной компании').length).toBeGreaterThan(0)
    expect(cases.getByText('TrueTell')).toBeInTheDocument()
    expect(cases.getAllByText('Лендинг TrueTell').length).toBeGreaterThan(0)
    expect(cases.queryByText('Красим.ру')).not.toBeInTheDocument()
    expect(
      cases.queryByText('Лендинг для Красим.ру и настройка рекламы в Яндекс.Директ'),
    ).not.toBeInTheDocument()
    expect(cases.getByText('Sosedi')).toBeInTheDocument()
    expect(cases.getAllByText('Промо сайт приложения Sosedi').length).toBeGreaterThan(0)
    expect(cases.getByText('Звезда')).toBeInTheDocument()
    expect(cases.getAllByText('Завод трансформаторов «Звезда»').length).toBeGreaterThan(0)
  })

  it('opens a case modal and closes it from the controls', async () => {
    const user = userEvent.setup()
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    await user.click(screen.getByRole('button', { name: 'Открыть кейс ROSA' }))

    const dialog = screen.getByRole('dialog', { name: 'ROSA' })
    const modal = within(dialog)

    expect(
      modal.getByRole('img', { name: 'Корпоративный сайт строительной компании' }),
    ).toBeInTheDocument()
    expect(modal.getByText(/понятная система привлечения заявок/)).toBeInTheDocument()
    expect(modal.getByText('Оказанные услуги')).toBeInTheDocument()
    expect(modal.getByText('SEO и GEO-оптимизация')).toBeInTheDocument()
    expect(modal.queryByText('Примеры экранов')).not.toBeInTheDocument()

    await user.click(modal.getByRole('button', { name: 'Следующее изображение' }))

    expect(
      modal.getByRole('img', { name: 'Пример экрана ROSA: блок полезных ссылок и форма заявки' }),
    ).toBeInTheDocument()

    await user.click(modal.getByRole('button', { name: 'Следующее изображение' }))
    await user.click(modal.getByRole('button', { name: 'Следующее изображение' }))

    expect(
      modal.getByRole('img', { name: 'Корпоративный сайт строительной компании' }),
    ).toBeInTheDocument()

    await user.click(modal.getByRole('button', { name: 'Закрыть' }))

    expect(screen.queryByRole('dialog', { name: 'ROSA' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Открыть кейс TrueTell' }))
    const overlay = screen.getByRole('dialog', { name: 'TrueTell' })

    fireEvent.click(overlay)

    expect(screen.queryByRole('dialog', { name: 'TrueTell' })).not.toBeInTheDocument()
  })

  it('renders the testimonials section between cases and services', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    const casesTitle = screen.getByRole('heading', { level: 2, name: 'Наши кейсы' })
    const testimonialsTitle = screen.getByRole('heading', { level: 2, name: 'Отзывы клиентов' })
    const servicesTitle = screen.getByRole('heading', { level: 2, name: 'Наши услуги' })

    expect(testimonialsTitle).toBeInTheDocument()
    expect(
      casesTitle.compareDocumentPosition(testimonialsTitle) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      testimonialsTitle.compareDocumentPosition(servicesTitle) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    const testimonialsSection = testimonialsTitle.closest('section')
    expect(testimonialsSection).not.toBeNull()

    const testimonials = within(testimonialsSection as HTMLElement)

    expect(testimonials.getByText('TrueTell')).toBeInTheDocument()
    expect(testimonials.getByText('ROSA')).toBeInTheDocument()
    expect(testimonials.getByText('AKS-FIT')).toBeInTheDocument()
    expect(testimonials.getByText('Tutor Online')).toBeInTheDocument()
    expect(testimonials.getByText('Красим.ру')).toBeInTheDocument()
    expect(testimonials.getByText(/помог привлечь несколько крупных клиентов/)).toBeInTheDocument()
    expect(testimonials.getByText(/первые обращения из ChatGPT/)).toBeInTheDocument()
    expect(testimonials.getByText(/стоимость лида стала ниже/)).toBeInTheDocument()
  })

  it('renders the reasons to trust section', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Почему мы?' })).toBeInTheDocument()
    expect(screen.getByText('Разработка точно в срок + поддержка')).toBeInTheDocument()
    expect(screen.getByText(/Понимание пути клиента/)).toBeInTheDocument()
    expect(screen.getByText(/защите информации и персональных данных/)).toBeInTheDocument()
    expect(screen.getByText(/Защита сайта от перехвата клиентов/)).toBeInTheDocument()
    expect(screen.getByText(/Не привязываем проект к шаблону/)).toBeInTheDocument()
  })

  it('opens the quick consultation quiz after 28 seconds on the page', async () => {
    jest.useFakeTimers()

    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await act(async () => {
      jest.advanceTimersByTime(27_999)
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await act(async () => {
      jest.advanceTimersByTime(1)
    })

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Подумаем над сайтом вместе',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(/без давления и лишнего размаха/)).toBeInTheDocument()
    jest.useRealTimers()

    const dialog = screen.getByRole('dialog')
    const quiz = within(dialog)
    expect(quiz.getByLabelText('Как вас зовут?')).toBeInTheDocument()

    await userEvent.type(quiz.getByLabelText('Как вас зовут?'), 'Иван')
    await userEvent.click(quiz.getByRole('button', { name: 'Далее' }))

    expect(quiz.getByLabelText('Сфера деятельности')).toBeInTheDocument()

    await userEvent.type(quiz.getByLabelText('Сфера деятельности'), 'Разработка')
    await userEvent.click(quiz.getByRole('button', { name: 'Далее' }))

    expect(quiz.getByLabelText('Ваш ник в Telegram')).toBeInTheDocument()

    await userEvent.click(quiz.getByLabelText('WhatsApp'))

    expect(quiz.getByLabelText('Ваш телефон')).toBeInTheDocument()
    expect(quiz.getByRole('button', { name: 'Получить консультацию' })).toBeInTheDocument()
  })

  it('does not auto-open the quiz after the visitor starts filling another form', async () => {
    jest.useFakeTimers()

    render(<RazrabotkaPage config={razrabotkaConfig} />)

    fireEvent.input(screen.getByLabelText('Как вас зовут?'), { target: { value: 'И' } })

    await act(async () => {
      jest.advanceTimersByTime(28_000)
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('retries an interrupted process CTA request with the same submission id', async () => {
    const fetchMock = jest
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce({ ok: true })
    global.fetch = fetchMock as unknown as typeof fetch

    render(<RazrabotkaPage config={razrabotkaConfig} />)

    await userEvent.type(screen.getByLabelText('Как вас зовут?'), 'Иван')
    await userEvent.type(screen.getByLabelText('Сфера деятельности'), 'Разработка')
    await userEvent.type(screen.getByLabelText('Ваш ник в Telegram'), 'project42')
    await userEvent.click(screen.getByRole('button', { name: 'Получить рекомендации' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))

    const firstPayload = JSON.parse(fetchMock.mock.calls[0][1].body)
    const retryPayload = JSON.parse(fetchMock.mock.calls[1][1].body)

    expect(firstPayload._requestId).toEqual(expect.any(String))
    expect(retryPayload._requestId).toBe(firstPayload._requestId)
    expect(mockPush).toHaveBeenCalledWith('/thank-you')
  })

  it('opens the consultation quiz from CTA links', async () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('link', { name: /Получить консультацию/ }))

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByLabelText('Как вас зовут?')).toBeInTheDocument()
  })

  it('submits the consultation quiz with a Telegram username', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true })
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    global.fetch = fetchMock as unknown as typeof fetch

    render(<RazrabotkaPage config={razrabotkaConfig} />)

    await userEvent.click(screen.getByRole('link', { name: /Получить консультацию/ }))
    const quiz = within(await screen.findByRole('dialog'))
    await userEvent.type(quiz.getByLabelText('Как вас зовут?'), 'Иван')
    await userEvent.click(quiz.getByRole('button', { name: 'Далее' }))
    await userEvent.type(quiz.getByLabelText('Сфера деятельности'), 'Разработка')
    await userEvent.click(quiz.getByRole('button', { name: 'Далее' }))
    await userEvent.type(quiz.getByLabelText('Ваш ник в Telegram'), 'project42')
    await userEvent.click(quiz.getByRole('button', { name: 'Получить консультацию' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      name: 'Иван',
      contact: '@project42',
      service: 'Разработка сайта',
      _contactMethod: 'telegram',
      _contact: '@project42',
    })
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).not.toHaveProperty('phone')
    consoleErrorSpy.mockRestore()
  })

  it('validates phone before submitting the consultation quiz', async () => {
    const fetchMock = jest.fn()
    global.fetch = fetchMock as unknown as typeof fetch

    render(<RazrabotkaPage config={razrabotkaConfig} />)

    await userEvent.click(screen.getByRole('link', { name: /Получить консультацию/ }))
    const quiz = within(await screen.findByRole('dialog'))
    await userEvent.type(quiz.getByLabelText('Как вас зовут?'), 'Иван')
    await userEvent.click(quiz.getByRole('button', { name: 'Далее' }))
    await userEvent.type(quiz.getByLabelText('Сфера деятельности'), 'Разработка')
    await userEvent.click(quiz.getByRole('button', { name: 'Далее' }))
    await userEvent.click(quiz.getByLabelText('WhatsApp'))
    await userEvent.type(quiz.getByLabelText('Ваш телефон'), '123')
    await userEvent.click(quiz.getByRole('button', { name: 'Получить консультацию' }))

    expect(quiz.getByText('Введите телефон в формате +7 999 000-00-00')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('renders the new CTA section', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Есть задача? Давайте обсудим',
    })
    const cta = heading.closest('section')

    expect(heading).toBeInTheDocument()
    expect(cta).not.toBeNull()
    expect(screen.queryByText('Начнём с разговора')).not.toBeInTheDocument()
    expect(screen.getByText(/предложим подходящий формат работы/)).toBeInTheDocument()
    expect(within(cta!).getByRole('link', { name: /Обсудить проект/ })).toHaveAttribute(
      'href',
      '#contacts',
    )
    expect(within(cta!).getByRole('link', { name: /Смотреть кейсы/ })).toHaveAttribute(
      'href',
      '#projects',
    )
  })

  it('renders the services carousel section above the trust reasons', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    const servicesTitle = screen.getByRole('heading', { level: 2, name: 'Наши услуги' })
    const reasonsTitle = screen.getByRole('heading', { level: 2, name: 'Почему мы?' })

    expect(servicesTitle).toBeInTheDocument()
    expect(reasonsTitle).toBeInTheDocument()
    expect(
      servicesTitle.compareDocumentPosition(reasonsTitle) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(screen.getByText('Разработка лендинга')).toBeInTheDocument()
    expect(screen.getByText('Разработка сайта-визитки')).toBeInTheDocument()
    expect(screen.getByText('Разработка корпоративного сайта')).toBeInTheDocument()
    expect(screen.getByText('Разработка интернет-магазина')).toBeInTheDocument()
    expect(screen.getByText('Разработка Telegram-бота')).toBeInTheDocument()
    expect(screen.getByText('Разработка мобильного приложения')).toBeInTheDocument()
    expect(screen.getByText('SEO и продвижение в ИИ')).toBeInTheDocument()
    expect(screen.getByText('Настройка и ведение рекламы в Яндекс.Директ')).toBeInTheDocument()
    expect(screen.getByText('от 15 тыс')).toBeInTheDocument()
    expect(screen.getByText('от 100 тыс')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Предыдущие услуги' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Следующие услуги' })).toBeInTheDocument()
  })

  it('renders the aftercare section', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Сайт под вашим контролем' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/не зависеть от разработчика/)).toBeInTheDocument()
    expect(screen.getAllByText('Сами меняете контент')).toHaveLength(2)
    expect(
      screen.getByText('тексты, цены, услуги, фото и контакты можно обновлять без программиста'),
    ).toBeInTheDocument()
    expect(screen.getAllByText('Гарантия от технических багов')).toHaveLength(2)
    expect(
      screen.getByText('если после запуска ломается наша техническая часть, исправляем'),
    ).toBeInTheDocument()
    expect(screen.getAllByText('SEO-настройка в подарок')).toHaveLength(2)
    expect(
      screen.getByText('готовим базовые мета-данные, индексацию и понятную структуру страниц'),
    ).toBeInTheDocument()
  })

  it('renders the level-up banner above the footer', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'ПОМОЖЕМ ВЫДЕЛИТЬ ВАС СРЕДИ КОНКУРЕНТОВ' }),
    ).toBeInTheDocument()
  })

  it('renders the project-specific footer', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    const footer = screen.getByRole('contentinfo', {
      name: 'Футер страницы разработки сайта',
    })

    expect(
      within(footer).getByRole('link', { name: 'Project 42 - к началу страницы' }),
    ).toHaveAttribute('href', '#top')
    expect(within(footer).getByRole('navigation', { name: 'По странице' })).toBeInTheDocument()
    expect(within(footer).getByRole('link', { name: 'Что входит' })).toHaveAttribute(
      'href',
      '#services',
    )
    expect(within(footer).getByRole('link', { name: 'Как работаем' })).toHaveAttribute(
      'href',
      '#process',
    )
    expect(within(footer).getByRole('link', { name: 'О студии' })).toHaveAttribute('href', '#about')
    expect(within(footer).getByRole('link', { name: 'К заявке' })).toHaveAttribute('href', '#cta')
    expect(
      within(footer).getByRole('link', { name: 'Политика конфиденциальности' }),
    ).toHaveAttribute('href', '/privacy-policy')
    expect(within(footer).getByRole('link', { name: 'Публичная оферта' })).toHaveAttribute(
      'href',
      '/offer',
    )
    expect(within(footer).getByRole('link', { name: 'project42studio@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:project42studio@gmail.com',
    )
    expect(within(footer).getByRole('link', { name: '+7 999 858 98 78' })).toHaveAttribute(
      'href',
      'https://wa.me/79998589878',
    )
    expect(within(footer).getByText('Самозанятый Нарчук Иван Валериевич')).toBeInTheDocument()
    expect(within(footer).getByRole('link', { name: 'Написать в Telegram' })).toHaveAttribute(
      'href',
      'https://t.me/ivann97n',
    )
    expect(within(footer).getByRole('link', { name: 'Разобрать задачу' })).toHaveAttribute(
      'href',
      '#cta',
    )
  })

  it('opens the consultation form on mobile and keeps desktop messenger links', async () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect
    const originalScrollY = window.scrollY
    let decisionBottom = window.innerHeight + 200

    const createRect = (bottom: number) =>
      ({
        bottom,
        height: 0,
        left: 0,
        right: 0,
        top: bottom,
        width: 0,
        x: 0,
        y: bottom,
        toJSON: () => ({}),
      }) as DOMRect

    Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
      if ((this as HTMLElement).id === 'decision-window') {
        return createRect(decisionBottom)
      }

      return originalGetBoundingClientRect.call(this)
    }

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 0,
      writable: true,
    })

    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(screen.queryByRole('button', { name: 'Открыть чат' })).not.toBeInTheDocument()

    decisionBottom = 120
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 620,
      writable: true,
    })

    await act(async () => {
      window.dispatchEvent(new Event('scroll'))
    })

    const desktopChatButton = await screen.findByRole('button', { name: 'Открыть чат' })
    const chatRoot = desktopChatButton.closest('div')

    expect(chatRoot).not.toBeNull()

    const consultationButton = within(chatRoot!).getByRole('link', {
      name: 'Получить консультацию',
    })
    expect(consultationButton).toHaveAttribute('href', '#cta')

    await userEvent.click(consultationButton)

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByLabelText('Как вас зовут?')).toBeInTheDocument()

    await userEvent.click(within(dialog).getByRole('button', { name: 'Закрыть' }))

    await userEvent.click(desktopChatButton)

    expect(screen.getByRole('button', { name: 'Закрыть чат' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('link', { name: 'Telegram' })).toHaveAttribute(
      'href',
      'https://t.me/ivann97n',
    )
    expect(screen.getByRole('link', { name: 'MAX' })).toHaveAttribute(
      'href',
      'https://max.ru/u/f9LHodD0cOJ3bESpnMANQoyejFdeTcoGRFmNOyMIWRGnFX8VmxGipv3OHNA',
    )
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      'https://wa.me/79998589878',
    )

    await userEvent.click(screen.getByRole('button', { name: 'Закрыть чат' }))

    expect(screen.queryByRole('link', { name: 'Telegram' })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Открыть чат' }))

    expect(screen.getByRole('link', { name: 'Telegram' })).toBeInTheDocument()

    await act(async () => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(screen.queryByRole('link', { name: 'Telegram' })).not.toBeInTheDocument()

    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: originalScrollY,
      writable: true,
    })
  })

  it('does not render the previous landing sections', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(
      screen.queryByRole('heading', { level: 1, name: razrabotkaConfig.hero.headingText }),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Основатель Project 42')).not.toBeInTheDocument()
    expect(screen.queryByText('Вопросы перед стартом')).not.toBeInTheDocument()
  })

  it('toggles the mobile menu button state', async () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    const menuButton = screen.getByRole('button', { name: 'Открыть меню' })

    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(menuButton)

    expect(screen.getByRole('button', { name: 'Закрыть меню' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })
})
