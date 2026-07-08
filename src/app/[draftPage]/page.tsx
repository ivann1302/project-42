import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDraftPageBySlug, draftPages } from '@/entities/DraftPage'
import { DraftPageView } from '@/widgets/DraftPage'
import { Header } from '@/widgets/Header'
import { RazrabotkaFooter } from '@/widgets/RazrabotkaPage'
import { SmallBusinessPage } from '@/widgets/SmallBusinessPage'
import { siteConfig } from '@/shared/config/seo'

type Props = {
  params: Promise<{ draftPage: string }>
}

const smallBusinessSlug = 'sayt-dlya-malogo-biznesa'

const smallBusinessFaq = [
  {
    question: 'Можно ли сделать недорогой сайт для малого бизнеса?',
    answer:
      'Да, если начинать с понятной первой версии: главная страница, услуги, контакты, форма заявки, аналитика и базовая SEO-структура. Сложные разделы можно добавлять позже.',
  },
  {
    question: 'Чем такой сайт отличается от конструктора?',
    answer:
      'Конструктор подходит для быстрого старта. Собственный сайт удобнее, когда нужны скорость, SEO-структура, интеграции, защита заявок, гибкие страницы услуг и развитие без ограничений платформы.',
  },
  {
    question: 'Сколько времени занимает разработка?',
    answer:
      'Обычно первая рабочая версия сайта малого бизнеса занимает от 2 до 5 недель. Срок зависит от количества услуг, материалов, интеграций и готовности текстов.',
  },
  {
    question: 'Нужно ли сразу делать много страниц?',
    answer:
      'Нет. Лучше начать с сильной основы и нескольких важных страниц услуг, а затем расширять структуру по спросу, рекламе и SEO-данным.',
  },
]

export function generateStaticParams() {
  return draftPages.map((page) => ({
    draftPage: page.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { draftPage: slug } = await params
  const page = getDraftPageBySlug(slug)

  if (!page) {
    return {
      title: 'Страница не найдена',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return {
    title:
      page.slug === smallBusinessSlug ? 'Сайт для малого бизнеса под заявки и доверие' : page.title,
    description:
      page.slug === smallBusinessSlug
        ? 'Создание сайта для малого бизнеса: услуги, цены, отзывы, заявки, SEO, реклама, мессенджеры, Яндекс.Метрика, UTM и Telegram-уведомления.'
        : page.description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    alternates: {
      canonical: `${siteConfig.url}/${page.slug}`,
    },
    openGraph: {
      type: page.kind === 'article' ? 'article' : 'website',
      locale: siteConfig.locale,
      url: `${siteConfig.url}/${page.slug}`,
      siteName: siteConfig.name,
      title: page.title,
      description: page.description,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: page.title,
      description: page.description,
      images: ['/og-image.jpg'],
    },
  }
}

export default async function DraftPageRoute({ params }: Props) {
  const { draftPage: slug } = await params
  const page = getDraftPageBySlug(slug)

  if (!page) {
    notFound()
  }

  const isSmallBusinessPage = page.slug === smallBusinessSlug
  const canonicalUrl = `${siteConfig.url}/${page.slug}`

  const smallBusinessSchemas = isSmallBusinessPage
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Создание сайта для малого бизнеса',
          description:
            'Разработка сайта для малого бизнеса: структура услуг, заявки, аналитика, SEO, мессенджеры и доверительные блоки.',
          provider: {
            '@type': 'Organization',
            name: siteConfig.name,
            url: siteConfig.url,
            sameAs: siteConfig.sameAs,
          },
          areaServed: {
            '@type': 'Country',
            name: 'Россия',
          },
          url: canonicalUrl,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'RUB',
            availability: 'https://schema.org/InStock',
            description: 'Стоимость рассчитывается после оценки задач и структуры сайта.',
            url: canonicalUrl,
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: smallBusinessFaq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        },
      ]
    : []

  return (
    <>
      {smallBusinessSchemas.map((schema) => (
        <script
          key={schema['@type']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {isSmallBusinessPage ? (
        <SmallBusinessPage />
      ) : (
        <>
          <Header />
          <main>
            <DraftPageView page={page} />
          </main>
          <RazrabotkaFooter />
        </>
      )}
    </>
  )
}
