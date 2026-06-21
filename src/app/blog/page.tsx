import type { Metadata } from 'next'
import { articles, getArticlePath } from '@/entities/Article'
import { BlogPage } from '@/widgets/BlogPage'
import { Header } from '@/widgets/Header'
import { RazrabotkaFooter } from '@/widgets/RazrabotkaPage'
import { siteConfig } from '@/shared/config/seo'

const blogDescription = `Статьи ${siteConfig.name} о разработке сайтов, SEO, GEO-оптимизации, маркетинге, защите заявок и запуске проектов.`

export const metadata: Metadata = {
  title: 'Блог о разработке сайтов, SEO и маркетинге',
  description: blogDescription,
  keywords: [
    'блог веб-студии',
    'разработка сайтов',
    'SEO продвижение',
    'GEO оптимизация',
    'AI поиск',
    'защита заявок с сайта',
    'маркетинг для сайта',
  ],
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    title: `Блог | ${siteConfig.name}`,
    description: blogDescription,
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `Блог ${siteConfig.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: `Блог | ${siteConfig.name}`,
    description: blogDescription,
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
      name: 'Блог',
      item: `${siteConfig.url}/blog`,
    },
  ],
}

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: `Блог ${siteConfig.name}`,
  description: blogDescription,
  url: `${siteConfig.url}/blog`,
  inLanguage: 'ru-RU',
  publisher: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  blogPost: articles.map((article) => ({
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    url: `${siteConfig.url}${getArticlePath(article)}`,
    image: article.coverImage ? `${siteConfig.url}${article.coverImage}` : undefined,
    articleSection: article.category,
    keywords: article.keywords,
    author: {
      '@type': 'Organization',
      name: article.author,
    },
  })),
}

export default function BlogRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Header />
      <main>
        <BlogPage />
      </main>
      <RazrabotkaFooter />
    </>
  )
}
