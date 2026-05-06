import type { Service } from './types'

export const services: Service[] = [
  {
    id: 'design',
    icon: 'monitor',
    title: 'Дизайн',
    description:
      'UX-исследование, прототипирование, UI-дизайн и дизайн-система. Интерфейс, который работает на конверсию.',
  },
  {
    id: 'development',
    icon: 'code',
    title: 'Разработка лендингов',
    description:
      'Быстрые посадочные страницы на современном стеке. Адаптив, формы, аналитика, интеграции и чистый код без замков.',
    href: '/razrabotka-sayta',
  },
  {
    id: 'seo',
    icon: 'searchUp',
    title: 'SEO',
    description:
      'Технический аудит, контентная стратегия, рост в органическом поиске. Работаем на долгосрочный результат.',
    href: '/seo-prodvizhenie',
  },
  {
    id: 'geo',
    icon: 'globe',
    title: 'GEO-оптимизация',
    description:
      'GEO (Generative Engine Optimization) — оптимизация контента под AI-поисковики: ChatGPT, Perplexity, Google AI Overviews. Новый канал трафика уже сейчас.',
    href: '/seo-prodvizhenie',
  },
  {
    id: 'yandex-direct',
    icon: 'target',
    title: 'Яндекс.Директ',
    description:
      'Настройка и запуск рекламных кампаний в Яндекс.Директ. Целевой трафик с первого дня без лишних расходов.',
  },
  {
    id: 'support',
    icon: 'headset',
    title: 'Поддержка и развитие',
    description:
      'Мониторинг, обновления, доработки и масштабирование. Остаёмся рядом столько, сколько нужно.',
  },
]
