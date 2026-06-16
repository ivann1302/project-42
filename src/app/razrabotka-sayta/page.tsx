import type { Metadata } from 'next'
import { RazrabotkaPage } from '@/widgets/RazrabotkaPage'
import { razrabotkaConfig } from '@/entities/ServicePage'
import { siteConfig } from '@/shared/config/seo'

export const metadata: Metadata = {
  title: razrabotkaConfig.seo.title,
  description: razrabotkaConfig.seo.description,
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
    canonical: `${siteConfig.url}/razrabotka-sayta`,
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: `${siteConfig.url}/razrabotka-sayta`,
    siteName: siteConfig.name,
    title: razrabotkaConfig.seo.title,
    description: razrabotkaConfig.seo.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Разработка лендингов под ключ — Project 42',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: razrabotkaConfig.seo.title,
    description: razrabotkaConfig.seo.description,
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
      name: 'Разработка лендингов',
      item: `${siteConfig.url}/razrabotka-sayta`,
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: razrabotkaConfig.faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

function getOfferPriceFields(price: string) {
  const numericPrice = price.match(/\d[\d\s]*/u)?.[0].replace(/\s/g, '')

  if (!numericPrice) {
    return {
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'RUB',
        description: price,
      },
    }
  }

  return {
    price: numericPrice,
    priceCurrency: 'RUB',
    priceSpecification: {
      '@type': 'PriceSpecification',
      minPrice: numericPrice,
      priceCurrency: 'RUB',
    },
  }
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Разработка лендингов под ключ',
  provider: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  description: razrabotkaConfig.seo.description,
  url: `${siteConfig.url}/razrabotka-sayta`,
  offers: razrabotkaConfig.pricing.map((plan) => ({
    '@type': 'Offer',
    name: plan.name,
    description: plan.description,
    ...getOfferPriceFields(plan.price),
    url: `${siteConfig.url}/razrabotka-sayta`,
  })),
}

export default function RazrabotkaPageRoute() {
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
      <main>
        <RazrabotkaPage config={razrabotkaConfig} />
      </main>
    </>
  )
}
