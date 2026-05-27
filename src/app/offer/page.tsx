import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/seo'
import { OfferContent } from './OfferContent'

export const metadata: Metadata = {
  title: 'Договор-оферта',
  description:
    'Договор-оферта Project 42 на оказание digital-услуг: порядок работ, оплата, гарантии, поддержка и реквизиты Исполнителя.',
  alternates: {
    canonical: `${siteConfig.url}/offer`,
  },
  openGraph: {
    type: 'article',
    locale: siteConfig.locale,
    url: `${siteConfig.url}/offer`,
    siteName: siteConfig.name,
    title: 'Договор-оферта',
    description: 'Условия оказания digital-услуг Project 42.',
  },
}

export default function OfferPage() {
  return <OfferContent />
}
