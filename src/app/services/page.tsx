import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/seo'

export const metadata: Metadata = {
  title: 'Услуги',
  description: `UI/UX дизайн, веб-разработка, мобильные приложения, SEO — ${siteConfig.name}`,
}

export default function ServicesPage() {
  return <main>{/* Services page sections */}</main>
}
