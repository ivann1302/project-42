import type { Metadata } from 'next'
import { GeoAeoPage } from '@/widgets/GeoAeoPage'
import { geoAeoConfig } from '@/entities/ServicePage'
import { siteConfig } from '@/shared/config/seo'

const pageUrl = `${siteConfig.url}/geo-aeo-prodvizhenie`

export const metadata: Metadata = {
  title: geoAeoConfig.seo.title,
  description: geoAeoConfig.seo.description,
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
    title: geoAeoConfig.seo.title,
    description: geoAeoConfig.seo.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GEO/AEO-продвижение сайта в нейросетях — Project 42',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: geoAeoConfig.seo.title,
    description: geoAeoConfig.seo.description,
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
      name: 'GEO/AEO-продвижение сайта в нейросетях',
      item: pageUrl,
    },
  ],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'GEO/AEO-продвижение сайта в нейросетях',
  serviceType: 'GEO/AEO-продвижение',
  provider: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  description: geoAeoConfig.seo.description,
  url: pageUrl,
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: geoAeoConfig.faq.items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export default function GeoAeoProdvizheniePageRoute() {
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
      <GeoAeoPage config={geoAeoConfig} />
    </>
  )
}
