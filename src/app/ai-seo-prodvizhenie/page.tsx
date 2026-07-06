import type { Metadata } from 'next'
import {
  AiSeoProdvizheniePage,
  aiSeoProdvizhenieFaqItems,
  aiSeoProdvizhenieRelatedLinks,
  aiSeoProdvizhenieSeo,
} from '@/widgets/AiSeoProdvizheniePage'
import { aiVisibilityTopics } from '@/shared/config/seoCluster'
import { siteConfig } from '@/shared/config/seo'

const pageUrl = `${siteConfig.url}/ai-seo-prodvizhenie`
const aiSeoTopics = Array.from(new Set([...aiSeoProdvizhenieSeo.keywords, ...aiVisibilityTopics]))
const relatedPageUrls = aiSeoProdvizhenieRelatedLinks.map((link) => `${siteConfig.url}${link.href}`)

export const metadata: Metadata = {
  title: aiSeoProdvizhenieSeo.title,
  description: aiSeoProdvizhenieSeo.description,
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
    title: aiSeoProdvizhenieSeo.ogTitle,
    description: aiSeoProdvizhenieSeo.ogDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI SEO-продвижение сайтов под ИИ-поиск — Project 42',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: aiSeoProdvizhenieSeo.ogTitle,
    description: aiSeoProdvizhenieSeo.ogDescription,
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
      name: 'AI SEO-продвижение сайтов',
      item: pageUrl,
    },
  ],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${pageUrl}#service`,
  name: 'AI SEO-продвижение сайтов',
  alternateName: ['SEO под ИИ-поиск', 'SEO-продвижение с ИИ', 'AI SEO'],
  serviceType: 'AI SEO-продвижение',
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
  description: aiSeoProdvizhenieSeo.description,
  keywords: aiSeoTopics.join(', '),
  serviceOutput: [
    'AI SEO-аудит сайта',
    'техническая проверка индексации',
    'структура страниц под SEO, AEO и GEO',
    'контент-план под вопросы клиентов',
    'аналитика видимости и заявок',
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
    name: 'Заказать AI SEO-аудит',
    target: `mailto:${siteConfig.email}`,
  },
}

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${pageUrl}#webpage`,
  url: pageUrl,
  name: aiSeoProdvizhenieSeo.title,
  description: aiSeoProdvizhenieSeo.description,
  inLanguage: 'ru-RU',
  isPartOf: {
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  about: aiSeoTopics.map((topic) => ({
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
  mainEntity: aiSeoProdvizhenieFaqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export default function AiSeoProdvizheniePageRoute() {
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
      <AiSeoProdvizheniePage />
    </>
  )
}
