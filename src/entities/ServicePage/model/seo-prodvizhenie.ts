import type {
  HeroConfig,
  HowItWorksStep,
  StatItem,
  CtaConfig,
  SeoConfig,
  ServiceIconItem,
} from './types'
import type { FaqItem } from '@/entities/FaqItem'
import type { PricingPlan } from '@/entities/PricingPlan'

export type WhyNowItem = {
  icon: ServiceIconItem['icon']
  title: string
  description: string
}

export type WhatIncludesColumn = {
  label: string
  items: string[]
}

export type CaseItem = {
  id: string
  title: string
  niche: string
  metricsBefore: string
  metricsAfter: string
  duration: string
  tags: string[]
}

export type SeoPageConfig = {
  hero: HeroConfig
  whyNow: { eyebrow: string; title: string; sub: string; items: WhyNowItem[] }
  whatIncludes: { eyebrow: string; title: string; columns: WhatIncludesColumn[] }
  steps: HowItWorksStep[]
  cases: CaseItem[]
  stats: StatItem[]
  pricing: PricingPlan[]
  paymentNote: string
  faqItems: FaqItem[]
  cta: CtaConfig
  seo: SeoConfig
}

export const seoConfig: SeoPageConfig = {
  hero: {
    eyebrow: '— Project 42',
    headingText: 'SEO-продвижение и GEO-оптимизация',
    sub: 'Рост в Google и Яндексе, плюс GEO (Generative Engine Optimization) — оптимизация под AI-поисковики: ChatGPT, Perplexity, Google AI Overviews.',
    ctaPrimary: { label: 'Получить SEO-аудит', href: '#cta' },
    ctaSecondary: { label: 'Смотреть кейсы', href: '#cases' },
  },

  whyNow: {
    eyebrow: 'Почему сейчас',
    title: 'AI меняет правила поиска',
    sub: 'Более 40% запросов в Google уже обрабатывает AI Overviews. ChatGPT и Perplexity рекомендуют бренды напрямую. Кто попадёт туда сейчас — получит преимущество на годы вперёд.',
    items: [
      {
        icon: 'globe',
        title: 'Google AI Overviews',
        description: 'AI-блок в выдаче заменяет первые позиции. Важно попасть именно в него.',
      },
      {
        icon: 'zap',
        title: 'ChatGPT и Perplexity',
        description: 'Пользователи спрашивают у AI, что купить. Ваш бренд должен быть в ответе.',
      },
      {
        icon: 'searchUp',
        title: 'Классический SEO жив',
        description:
          'Органика по-прежнему даёт лучший ROI. AI-трафик — дополнительный канал, не замена.',
      },
    ],
  },

  whatIncludes: {
    eyebrow: 'Что входит',
    title: 'SEO + GEO — полный цикл',
    columns: [
      {
        label: 'SEO-продвижение',
        items: [
          'Технический аудит и исправление ошибок',
          'Сбор семантического ядра',
          'Оптимизация мета-тегов и структуры',
          'Контентная стратегия и тексты',
          'Ссылочное продвижение',
          'Ежемесячная отчётность',
        ],
      },
      {
        label: 'GEO-оптимизация (AI-поисковики)',
        items: [
          'Анализ AI-цитируемости сайта',
          'Оптимизация контента под AI-ответы',
          'Настройка llms.txt и robots.txt',
          'Schema.org разметка для AI-парсеров',
          'Мониторинг упоминаний в AI-поисковиках',
          'Отчёт по AI-трафику',
        ],
      },
    ],
  },

  steps: [
    {
      num: '01',
      title: 'Аудит',
      description:
        'Анализируем текущее состояние: технические ошибки, позиции, конкуренты, AI-цитируемость.',
    },
    {
      num: '02',
      title: 'Стратегия',
      description: 'Формируем план: ключевые слова, приоритетные страницы, GEO-точки входа.',
    },
    {
      num: '03',
      title: 'Внедрение',
      description: 'Исправляем ошибки, оптимизируем контент, запускаем ссылочную и GEO-работу.',
    },
    {
      num: '04',
      title: 'Рост',
      description:
        'Ежемесячный мониторинг позиций, трафика и AI-упоминаний. Корректируем стратегию.',
    },
  ],

  cases: [
    {
      id: 'case-rosa',
      title: 'Сайт компании Rosa',
      niche: 'Производство',
      metricsBefore: 'Трафик: 120 / мес, позиции: 50+',
      metricsAfter: 'Трафик: 890 / мес, позиции: топ-10 по 40 запросам',
      duration: '4 месяца',
      tags: ['SEO', 'Контент', 'Ссылки'],
    },
    {
      id: 'case-audio',
      title: 'Мастер аудиотехники',
      niche: 'Услуги',
      metricsBefore: 'Трафик: 0 (новый сайт)',
      metricsAfter: 'Трафик: 340 / мес, заявки с органики',
      duration: '3 месяца',
      tags: ['SEO', 'GEO', 'Schema'],
    },
  ],

  stats: [
    { value: 7, prefix: '×', suffix: '', label: 'рост трафика — лучший кейс' },
    { value: 100, prefix: '', suffix: '%', label: 'клиентов получили рост трафика' },
    { value: 3, prefix: '', suffix: '', label: 'месяца до первых результатов', static: true },
    { value: 2, prefix: '', suffix: '', label: 'канала трафика: SEO и GEO' },
  ],

  pricing: [
    {
      id: 'seo-start',
      name: 'SEO Старт',
      price: 'от 14 900 ₽/мес',
      priceNote: 'Для небольших сайтов',
      description: 'Базовое SEO: аудит, семантика и оптимизация.',
      features: [
        'Технический аудит',
        'Семантика до 100 запросов',
        'Мета-теги и рекомендации',
        'Контентные рекомендации',
      ],
      cta: 'Начать продвижение',
    },
    {
      id: 'seo-pro',
      name: 'SEO + GEO',
      price: 'от 29 900 ₽/мес',
      priceNote: 'Полный цикл — самый популярный',
      description: 'SEO и GEO-оптимизация под AI-поиск.',
      features: [
        'Всё из тарифа «Старт»',
        'GEO-оптимизация контента',
        'llms.txt, Schema и ссылки',
        'Контент-стратегия',
      ],
      highlighted: true,
      cta: 'Начать продвижение',
    },
    {
      id: 'seo-custom',
      name: 'Индивидуально',
      price: 'По запросу',
      priceNote: 'Для крупных проектов',
      description: 'E-commerce, порталы и мультирегиональные проекты.',
      features: ['Полный SEO и GEO-аудит', 'Индивидуальная стратегия', 'Команда под проект'],
      cta: 'Обсудить задачу',
    },
  ],
  paymentNote: 'Ежемесячная оплата. Работаем по договору с фиксированными KPI.',

  faqItems: [
    {
      id: 'seo-result-time',
      question: 'Через сколько будут результаты SEO?',
      answer:
        'Первые изменения в позициях — через 4–8 недель. Ощутимый рост трафика — через 3–4 месяца. SEO — долгосрочный инструмент: чем дольше работаем, тем устойчивее результат.',
    },
    {
      id: 'seo-vs-ads',
      question: 'SEO или реклама — что лучше?',
      answer:
        'SEO даёт органический трафик без оплаты за клик. Реклама — моментальный результат, но платите каждый день. Оптимально: реклама на старте, SEO — для долгосрочного роста. Мы умеем и то, и другое.',
    },
    {
      id: 'geo-what',
      question: 'Что такое GEO-оптимизация?',
      answer:
        'GEO (Generative Engine Optimization) — это оптимизация сайта под AI-поисковики: Google AI Overviews, ChatGPT, Perplexity. Они цитируют авторитетные источники в своих ответах. Мы помогаем вашему сайту стать одним из них.',
    },
    {
      id: 'seo-guarantee',
      question: 'Даёте ли вы гарантии позиций?',
      answer:
        'Никакое агентство не может гарантировать конкретные позиции — это нарушает правила поисковиков. Мы гарантируем прозрачную работу, отчётность и рост показателей. Если за 3 месяца нет прогресса — пересматриваем стратегию бесплатно.',
    },
    {
      id: 'seo-content',
      question: 'Нужно ли создавать новый контент?',
      answer:
        'Да, контент — основа SEO. Мы разрабатываем контент-стратегию, даём ТЗ для текстов или пишем сами. Для GEO особенно важно: AI цитирует экспертный, структурированный контент.',
    },
    {
      id: 'seo-cancel',
      question: 'Можно ли отказаться в любой момент?',
      answer:
        'Да, работаем без принудительных длительных контрактов. Минимальный срок — 3 месяца (столько нужно для первых устойчивых результатов). После — продолжаем по взаимному желанию.',
    },
  ],

  cta: {
    eyebrow: 'Готовы к росту?',
    heading: 'Получите бесплатный\nSEO-аудит',
    sub: 'Разберём текущее состояние сайта, найдём точки роста и покажем, чего можно добиться за 3 месяца.',
    buttonText: 'Получить аудит',
    modalTitle: 'Получить SEO-аудит',
  },

  seo: {
    title: 'SEO-продвижение и GEO-оптимизация сайтов — Project 42',
    description:
      'Продвижение в Google, Яндексе и AI-поисковиках (ChatGPT, Perplexity). Рост органического трафика и присутствие в AI Overviews.',
  },
}
