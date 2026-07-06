import type { Metadata } from 'next'
import {
  GeoProdvizheniePage,
  geoProdvizhenieFaqItems,
  geoProdvizhenieRelatedLinks,
  geoProdvizhenieSeo,
} from '@/widgets/GeoProdvizheniePage'
import { aiVisibilityTopics } from '@/shared/config/seoCluster'
import { siteConfig } from '@/shared/config/seo'

const pageUrl = `${siteConfig.url}/geo-prodvizhenie`
const geoTopics = Array.from(new Set([...geoProdvizhenieSeo.keywords, ...aiVisibilityTopics]))
const relatedPageUrls = geoProdvizhenieRelatedLinks.map((link) => `${siteConfig.url}${link.href}`)

export const metadata: Metadata = {
  title: geoProdvizhenieSeo.title,
  description: geoProdvizhenieSeo.description,
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
    title: geoProdvizhenieSeo.ogTitle,
    description: geoProdvizhenieSeo.ogDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GEO-продвижение в нейросетях — Project 42',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: geoProdvizhenieSeo.ogTitle,
    description: geoProdvizhenieSeo.ogDescription,
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
      name: 'GEO-продвижение в нейросетях',
      item: pageUrl,
    },
  ],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${pageUrl}#service`,
  name: 'GEO-продвижение в нейросетях и AI-поиске',
  alternateName: ['Generative Engine Optimization', 'GEO-оптимизация', 'Продвижение в ИИ'],
  serviceType: 'GEO-продвижение',
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
    audienceType: 'Владельцы бизнеса и маркетологи',
  },
  description: geoProdvizhenieSeo.description,
  keywords: geoTopics.join(', '),
  serviceOutput: [
    'GEO-аудит сайта',
    'карта промптов и вопросов клиентов',
    'структура страниц под AI-поиск',
    'контент-план для нейросетей',
    'аналитика заявок из AI-источников',
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
    name: 'Получить GEO-аудит',
    target: `mailto:${siteConfig.email}`,
  },
}

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${pageUrl}#webpage`,
  url: pageUrl,
  name: geoProdvizhenieSeo.title,
  description: geoProdvizhenieSeo.description,
  inLanguage: 'ru-RU',
  isPartOf: {
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  about: geoTopics.map((topic) => ({
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
  mainEntity: geoProdvizhenieFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export default function GeoProdvizheniePageRoute() {
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
      <GeoProdvizheniePage />
    </>
  )
}
