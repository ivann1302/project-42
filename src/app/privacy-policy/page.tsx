import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/seo'
import { PrivacyPolicyContent } from './PrivacyPolicyContent'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description:
    'Политика конфиденциальности Project 42: обработка персональных данных, cookies, Яндекс Метрика и контакты оператора.',
  alternates: {
    canonical: `${siteConfig.url}/privacy-policy`,
  },
  openGraph: {
    type: 'article',
    locale: siteConfig.locale,
    url: `${siteConfig.url}/privacy-policy`,
    siteName: siteConfig.name,
    title: 'Политика конфиденциальности',
    description: 'Информация об обработке персональных данных пользователей сайта Project 42.',
  },
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />
}
