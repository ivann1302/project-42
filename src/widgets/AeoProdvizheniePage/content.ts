import { aiVisibilityClusterLinks } from '@/shared/config/seoCluster'

export const aeoProdvizhenieSeo = {
  title: 'AEO-продвижение сайта — Answer Engine Optimization',
  description:
    'AEO-оптимизация сайта под ответы: FAQ, короткие формулировки, структура, микроразметка и связка SEO, AEO, GEO для продвижения в ИИ.',
  ogTitle: 'AEO-продвижение сайта под ответы и AI-поиск',
  ogDescription:
    'Соберем вопросы клиентов, перестроим страницы услуг, добавим FAQ и короткие ответы, чтобы сайт лучше работал в поиске и AI-блоках.',
  keywords: [
    'aeo answer engine optimization',
    'aeo оптимизация',
    'aeo продвижение',
    'geo aeo',
    'seo aeo geo',
    'seo и aeo',
    'продвижение в ии',
    'продвижение сайта в ии',
    'где заказать geo aeo оптимизацию в россии',
  ],
}

export const aeoProdvizhenieNavLinks = [
  { label: 'Что это', href: '#about' },
  { label: 'Отличия', href: '#difference' },
  { label: 'Что входит', href: '#scope' },
  { label: 'Связка', href: '#cluster' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Контакты', href: '#cta' },
] as const

export const aeoProdvizhenieFooterLinks = [
  { label: 'Что такое AEO', href: '#about' },
  { label: 'SEO и AEO', href: '#difference' },
  { label: 'Что входит', href: '#scope' },
  { label: 'SEO/AEO/GEO', href: '#cluster' },
  { label: 'FAQ', href: '#faq' },
  { label: 'К заявке', href: '#cta' },
] as const

export const aeoProdvizhenieRelatedLinks = aiVisibilityClusterLinks.filter(
  (link) => link.href !== '/aeo-prodvizhenie',
)

export const aeoProdvizhenieScopeItems = [
  {
    title: 'Вопросы клиентов',
    text: 'Собираем реальные формулировки, по которым люди выбирают услугу, сравнивают подрядчиков и уточняют условия.',
  },
  {
    title: 'Короткие ответы',
    text: 'Добавляем на страницы понятные определения, блоки вопрос-ответ и первые абзацы без лишнего тумана.',
  },
  {
    title: 'FAQ и разметка',
    text: 'Усиливаем страницы FAQ-блоками, BreadcrumbList, Service и FAQPage, если такая разметка уместна.',
  },
  {
    title: 'Связка SEO, AEO, GEO',
    text: 'Строим маршрут от классического поиска к ответам и дальше к видимости бренда в AI-системах.',
  },
] as const

export const aeoProdvizhenieResultItems = [
  'карта вопросов и интентов клиентов',
  'структура AEO-блоков для страниц услуг',
  'короткие ответы для поиска и AI-блоков',
  'FAQ и микроразметка без переспама',
  'перелинковка с GEO-продвижением в ИИ',
] as const

export const aeoProdvizhenieFaqItems = [
  {
    question: 'Что такое AEO Answer Engine Optimization?',
    answer:
      'AEO, или Answer Engine Optimization, помогает страницам сайта отвечать на вопросы пользователя коротко и структурно. Это не замена SEO, а слой для ответов, FAQ, сниппетов и AI-поиска.',
  },
  {
    question: 'Чем SEO и AEO отличаются?',
    answer:
      'SEO помогает странице попасть в поисковую выдачу, а AEO помогает этой странице стать понятным ответом. Поэтому связка SEO и AEO особенно полезна для страниц услуг.',
  },
  {
    question: 'Какие блоки нужны для AEO-оптимизации?',
    answer:
      'Обычно нужны короткое определение услуги, ответы на вопросы о цене, сроках, этапах, ограничениях, FAQ, понятные H2/H3 и внутренняя перелинковка с близкими страницами.',
  },
  {
    question: 'Как связаны SEO, AEO, GEO и продвижение в ИИ?',
    answer:
      'SEO отвечает за техническую и поисковую базу, AEO - за ответы на страницах, GEO - за видимость бренда в генеративных системах. Вместе это работает как подготовка сайта к продвижению в ИИ.',
  },
  {
    question: 'Где заказать GEO/AEO-оптимизацию в России?',
    answer:
      'В Project 42 можно начать с AEO-аудита страниц: мы проверим структуру, FAQ, микроразметку и связь с GEO-продвижением. После этого станет понятно, какие страницы стоит доработать первыми.',
  },
  {
    question: 'Можно ли сделать продвижение сайта в топы с ИИ?',
    answer:
      'Мы не обещаем попадание в топы с ИИ: такие гарантии некорректны. Зато можно усилить сайт так, чтобы поиску и AI-системам было проще понять услуги, факты, ответы и доказательства.',
  },
  {
    question: 'Нужна ли AEO-оптимизация, если уже есть SEO?',
    answer:
      'Да, если страницы услуг не отвечают на конкретные вопросы клиентов. SEO помогает странице быть найденной, а AEO повышает шанс, что страницу поймут как готовый ответ.',
  },
] as const
