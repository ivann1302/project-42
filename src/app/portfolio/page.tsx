import type { Metadata } from 'next'
import { Header } from '@/widgets/Header'
import { PortfolioPage } from '@/widgets/PortfolioPage'
import { RazrabotkaFooter } from '@/widgets/RazrabotkaPage'
import { siteConfig } from '@/shared/config/seo'

const portfolioDescription = `Проекты веб-студии ${siteConfig.name}: корпоративные сайты, лендинги, интерфейсы, SEO-структура, аналитика и запуск digital-продуктов.`

export const metadata: Metadata = {
  title: 'Портфолио веб-студии',
  description: portfolioDescription,
  keywords: [
    'портфолио веб-студии',
    'кейсы разработки сайтов',
    'примеры лендингов',
    'корпоративные сайты',
    'сайты для бизнеса',
  ],
  alternates: {
    canonical: `${siteConfig.url}/portfolio`,
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: `${siteConfig.url}/portfolio`,
    siteName: siteConfig.name,
    title: `Портфолио | ${siteConfig.name}`,
    description: portfolioDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `Портфолио ${siteConfig.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: `Портфолио | ${siteConfig.name}`,
    description: portfolioDescription,
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
      name: 'Портфолио',
      item: `${siteConfig.url}/portfolio`,
    },
  ],
}

const portfolioSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: `Портфолио ${siteConfig.name}`,
  description: portfolioDescription,
  url: `${siteConfig.url}/portfolio`,
  inLanguage: 'ru-RU',
  publisher: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  about: siteConfig.services,
}

export default function PortfolioRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
      <Header />
      <main>
        <PortfolioPage />
      </main>
      <RazrabotkaFooter />
    </>
  )
}
