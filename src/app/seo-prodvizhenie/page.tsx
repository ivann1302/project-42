import type { Metadata } from 'next'
import { Header } from '@/widgets/Header'
import { RazrabotkaFooter } from '@/widgets/RazrabotkaPage'
import { SeoPage } from '@/widgets/SeoPage'
import { seoConfig } from '@/entities/ServicePage'
import { siteConfig } from '@/shared/config/seo'

export const metadata: Metadata = {
  title: seoConfig.seo.title,
  description: seoConfig.seo.description,
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
    canonical: `${siteConfig.url}/seo-prodvizhenie`,
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: `${siteConfig.url}/seo-prodvizhenie`,
    siteName: siteConfig.name,
    title: seoConfig.seo.title,
    description: seoConfig.seo.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO-продвижение и GEO-оптимизация — Project 42',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: seoConfig.seo.title,
    description: seoConfig.seo.description,
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
      name: 'SEO-продвижение',
      item: `${siteConfig.url}/seo-prodvizhenie`,
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: seoConfig.faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'SEO-продвижение и GEO-оптимизация',
  provider: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  description: seoConfig.seo.description,
  url: `${siteConfig.url}/seo-prodvizhenie`,
  offers: seoConfig.pricing.map((plan) => ({
    '@type': 'Offer',
    name: plan.name,
    description: plan.description,
    price: plan.price,
    priceCurrency: 'RUB',
    url: `${siteConfig.url}/seo-prodvizhenie`,
  })),
}

export default function SeoProdvizheniePageRoute() {
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
      <Header />
      <main>
        <SeoPage config={seoConfig} />
      </main>
      <RazrabotkaFooter />
    </>
  )
}
