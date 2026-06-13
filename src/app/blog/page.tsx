import type { Metadata } from 'next'
import { BlogPage } from '@/widgets/BlogPage'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { siteConfig } from '@/shared/config/seo'
import { MobileConsultationButton } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'Блог',
  description: `Статьи ${siteConfig.name} о разработке сайтов, SEO, маркетинге и запуске проектов.`,
  openGraph: {
    title: `Блог | ${siteConfig.name}`,
    description: `Статьи ${siteConfig.name} о разработке сайтов, SEO, маркетинге и запуске проектов.`,
    url: '/blog',
  },
}

export default function BlogRoute() {
  return (
    <>
      <Header />
      <main>
        <BlogPage />
      </main>
      <Footer />
      <MobileConsultationButton />
    </>
  )
}
