import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { razrabotkaConfig } from '@/entities/ServicePage'
import { RazrabotkaPage } from './RazrabotkaPage'

describe('RazrabotkaPage', () => {
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
        name: 'Создаём сайты которые продают',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Разработка лендинга от 5 дней')).toBeInTheDocument()
    expect(
      screen.getByText('Если вам нужен результат, а не просто красивый дизайн, то вы по адресу.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Получить консультацию/ })).toHaveAttribute(
      'href',
      '#cta',
    )
    expect(screen.getByRole('link', { name: /Наши работы/ })).toHaveAttribute('href', '#projects')
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

  it('renders the what we do section', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Что мы делаем?' })).toBeInTheDocument()
    expect(screen.getByText(/понятно донесёт до вашего клиента/)).toBeInTheDocument()
    expect(screen.getByText('В каждый лендинг входит')).toBeInTheDocument()
    expect(screen.getByText(/GEO\/AEO/)).toBeInTheDocument()
    expect(screen.getByText('Мобильная версия сайта')).toBeInTheDocument()
    expect(screen.getByText(/перехвата лидов/)).toBeInTheDocument()
    expect(screen.getByText('Цена под ключ')).toBeInTheDocument()
    expect(screen.getByText('25 тыс.')).toBeInTheDocument()
    expect(screen.getByText('За одностраничный сайт')).toBeInTheDocument()
    expect(screen.getByText('Оплата 50/50')).toBeInTheDocument()
  })

  it('renders the work process section', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Как мы работаем' })).toBeInTheDocument()
    expect(screen.getByText('Анализ ниши и конкурентов')).toBeInTheDocument()
    expect(screen.getByText('Создание прототипа и дизайна')).toBeInTheDocument()
    expect(screen.getByText('Разработка сайта и SEO')).toBeInTheDocument()
    expect(screen.getAllByText('01').length).toBeGreaterThan(0)
    expect(screen.getAllByText('02').length).toBeGreaterThan(0)
    expect(screen.getAllByText('03').length).toBeGreaterThan(0)
  })

  it('renders the cases section', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Наши кейсы' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Смотреть все кейсы' })).toHaveAttribute(
      'href',
      '/portfolio',
    )
    expect(screen.getByText('ROSA')).toBeInTheDocument()
    expect(screen.getAllByText('Корпоративный сайт строительной компании').length).toBeGreaterThan(
      0,
    )
    expect(screen.getByText('TrueTell')).toBeInTheDocument()
    expect(screen.getAllByText('Лендинг TrueTell').length).toBeGreaterThan(0)
    expect(screen.getByText('Красим.ру')).toBeInTheDocument()
    expect(
      screen.getAllByText('Лендинг для Красим.ру и настройка рекламы в Яндекс.Директ').length,
    ).toBeGreaterThan(0)
    expect(screen.getByText('Sosedi')).toBeInTheDocument()
    expect(screen.getAllByText('Промо сайт приложения Sosedi').length).toBeGreaterThan(0)
  })

  it('renders the founder message section', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Привет' })).toBeInTheDocument()
    expect(screen.getByText(/Мы студия разработки Project 42/)).toBeInTheDocument()
    expect(screen.getByText(/нижней границе рынка/)).toBeInTheDocument()
    expect(screen.getByAltText('Иван, основатель Project 42')).toBeInTheDocument()
    expect(screen.getByText('Иван - основатель Project 42')).toBeInTheDocument()
  })

  it('renders the quick consultation quiz', async () => {
    const observerCallbacks: Array<(entries: IntersectionObserverEntry[]) => void> = []
    const originalIntersectionObserver = global.IntersectionObserver

    global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      observerCallbacks.push(callback)

      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
      }
    })

    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await act(async () => {
      observerCallbacks.forEach((callback) => {
        callback([{ isIntersecting: true } as IntersectionObserverEntry])
      })
    })

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Мы проконсультируем вас в течение дня',
      }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Как вас зовут?')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Как вас зовут?'), 'Иван')
    await userEvent.click(screen.getByRole('button', { name: 'Далее' }))

    expect(screen.getByLabelText('Сфера деятельности')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Сфера деятельности'), 'Разработка')
    await userEvent.click(screen.getByRole('button', { name: 'Далее' }))

    expect(screen.getByLabelText('Ваш ник в Telegram')).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('WhatsApp'))

    expect(screen.getByLabelText('Ваш телефон')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Получить консультацию' })).toBeInTheDocument()

    global.IntersectionObserver = originalIntersectionObserver
  })

  it('opens the consultation quiz from CTA links', async () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('link', { name: /Получить консультацию/ }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText('Как вас зовут?')).toBeInTheDocument()
  })

  it('renders the new CTA section', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Давайте обсудим ваш проект' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Готовы к результатам?')).toBeInTheDocument()
    expect(screen.getByText(/бесплатную консультацию/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Оставить заявку/ })).toHaveAttribute(
      'href',
      '#contacts',
    )
    expect(screen.getByRole('link', { name: /Смотреть кейсы/ })).toHaveAttribute(
      'href',
      '#projects',
    )
  })

  it('renders the level-up banner above the footer', () => {
    render(<RazrabotkaPage config={razrabotkaConfig} />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'ВЫВЕДЕМ ВАШ БИЗНЕС НА НОВЫЙ УРОВЕНЬ' }),
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
    expect(within(footer).getByRole('link', { name: '+7 995 557 15 89' })).toHaveAttribute(
      'href',
      'https://wa.me/79955571589',
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

  it('shows the floating messenger chat after the decision section', async () => {
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

    expect(await screen.findByRole('button', { name: 'Открыть чат' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Открыть чат' }))

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
      'https://wa.me/79955571589',
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
