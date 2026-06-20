import type { Metadata } from 'next'
import { BlogPage } from '@/widgets/BlogPage'
import { Header } from '@/widgets/Header'
import { RazrabotkaFooter } from '@/widgets/RazrabotkaPage'
import { siteConfig } from '@/shared/config/seo'

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
      <RazrabotkaFooter />
    </>
  )
}
