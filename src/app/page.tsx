import type { Metadata } from 'next'
import {
  RazrabotkaCtaSection,
  RazrabotkaFooter,
  RazrabotkaLevelUpBanner,
} from '@/widgets/RazrabotkaPage'
import { Header } from '@/widgets/Header'
import { DesktopCursor } from '@/shared/ui'
import { siteConfig } from '@/shared/config/seo'
import { HomeHero } from './HomeHero'
import { HomeImpact } from './HomeImpact'
import { HomeServices } from './HomeServices'
import styles from './page.module.scss'

const homeDescription =
  'Project 42 делает сайты под бизнес-задачи: дизайн, разработка на Next.js, SEO, GEO-оптимизация, аналитика и поддержка после запуска.'

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — разработка сайтов, SEO и GEO-оптимизация`,
  },
  description: homeDescription,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — разработка сайтов, SEO и GEO-оптимизация`,
    description: homeDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — разработка сайтов, SEO и GEO-оптимизация`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: `${siteConfig.name} — разработка сайтов, SEO и GEO-оптимизация`,
    description: homeDescription,
    images: ['/og-image.jpg'],
  },
}

export default function HomePage() {
  return (
    <>
      <DesktopCursor />
      <Header />
      <main className={styles.main}>
        <HomeHero />
        <HomeImpact />
        <HomeServices />
        <RazrabotkaCtaSection light />
        <RazrabotkaLevelUpBanner />
      </main>
      <RazrabotkaFooter />
      <RazrabotkaLevelUpBanner placement="mobile" decorative />
    </>
  )
}
