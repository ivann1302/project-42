import type { Metadata } from 'next'
import {
  AeoProdvizheniePage,
  aeoProdvizhenieFaqItems,
  aeoProdvizhenieRelatedLinks,
  aeoProdvizhenieSeo,
} from '@/widgets/AeoProdvizheniePage'
import { aiVisibilityTopics } from '@/shared/config/seoCluster'
import { siteConfig } from '@/shared/config/seo'

const pageUrl = `${siteConfig.url}/aeo-prodvizhenie`
const aeoTopics = Array.from(new Set([...aeoProdvizhenieSeo.keywords, ...aiVisibilityTopics]))
const relatedPageUrls = aeoProdvizhenieRelatedLinks.map((link) => `${siteConfig.url}${link.href}`)

export const metadata: Metadata = {
  title: aeoProdvizhenieSeo.title,
  description: aeoProdvizhenieSeo.description,
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
    canonical: pageUrl,
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: pageUrl,
    siteName: siteConfig.name,
    title: aeoProdvizhenieSeo.ogTitle,
    description: aeoProdvizhenieSeo.ogDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AEO-продвижение сайта под ответы — Project 42',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: aeoProdvizhenieSeo.ogTitle,
    description: aeoProdvizhenieSeo.ogDescription,
    images: ['/og-image.jpg'],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Главная',
      item: siteConfig.url,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'AEO-продвижение сайта',
      item: pageUrl,
    },
  ],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${pageUrl}#service`,
  name: 'AEO-продвижение сайта',
  alternateName: ['Answer Engine Optimization', 'AEO-оптимизация', 'Оптимизация сайта под ответы'],
  serviceType: 'AEO-оптимизация',
  category: 'DigitalMarketingService',
  provider: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    sameAs: siteConfig.sameAs,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.addressLocality,
      addressCountry: siteConfig.addressCountry,
    },
  },
  areaServed: [
    {
      '@type': 'Country',
      name: 'Россия',
    },
    {
      '@type': 'City',
      name: siteConfig.addressLocality,
    },
  ],
  audience: {
    '@type': 'BusinessAudience',
    audienceType: 'Владельцы бизнеса, маркетологи и SEO-специалисты',
  },
  description: aeoProdvizhenieSeo.description,
  keywords: aeoTopics.join(', '),
  serviceOutput: [
    'карта вопросов клиентов',
    'структура AEO-блоков',
    'FAQ и короткие ответы',
    'микроразметка FAQPage и Service',
    'перелинковка с SEO и GEO-страницами',
  ],
  offers: {
    '@type': 'Offer',
    url: pageUrl,
    availability: 'https://schema.org/InStock',
    priceCurrency: 'RUB',
    eligibleRegion: {
      '@type': 'Country',
      name: 'Россия',
    },
  },
  url: pageUrl,
  mainEntityOfPage: pageUrl,
  potentialAction: {
    '@type': 'CommunicateAction',
    name: 'Получить AEO-аудит',
    target: `mailto:${siteConfig.email}`,
  },
}

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${pageUrl}#webpage`,
  url: pageUrl,
  name: aeoProdvizhenieSeo.title,
  description: aeoProdvizhenieSeo.description,
  inLanguage: 'ru-RU',
  isPartOf: {
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  about: aeoTopics.map((topic) => ({
    '@type': 'Thing',
    name: topic,
  })),
  relatedLink: relatedPageUrls,
  mainEntity: {
    '@id': `${pageUrl}#service`,
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: aeoProdvizhenieFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export default function AeoProdvizheniePageRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <AeoProdvizheniePage />
    </>
  )
}
