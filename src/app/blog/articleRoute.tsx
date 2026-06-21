import type { Metadata } from 'next'
import type { Article } from '@/entities/Article'
import { ArticlePage } from '@/widgets/ArticlePage'
import { Header } from '@/widgets/Header'
import { RazrabotkaFooter } from '@/widgets/RazrabotkaPage'
import { getArticlePath } from '@/entities/Article'
import { siteConfig } from '@/shared/config/seo'

export function buildArticleMetadata(article: Article): Metadata {
  const canonicalPath = getArticlePath(article)
  const canonicalUrl = `${siteConfig.url}${canonicalPath}`
  const image = article.coverImage ?? '/og-image.jpg'

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${article.title} | ${siteConfig.name}`,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
      url: canonicalUrl,
      section: article.category,
      tags: article.keywords,
      images: [
        {
          url: image,
          width: 1536,
          height: 1024,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: article.title,
      description: article.description,
      images: [image],
    },
  }
}

function buildArticleSchema(article: Article) {
  const canonicalUrl = `${siteConfig.url}${getArticlePath(article)}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    inLanguage: 'ru-RU',
    articleSection: article.category,
    keywords: article.keywords,
    image: article.coverImage ? `${siteConfig.url}${article.coverImage}` : undefined,
    author: {
      '@type': 'Organization',
      name: article.author,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: canonicalUrl,
  }
}

function buildArticleBreadcrumbSchema(article: Article) {
  const canonicalUrl = `${siteConfig.url}${getArticlePath(article)}`

  return {
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
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  }
}

export function ArticleRouteView({ article }: { article: Article }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleSchema(article)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleBreadcrumbSchema(article)) }}
      />
      <Header />
      <main>
        <ArticlePage article={article} />
      </main>
      <RazrabotkaFooter />
    </>
  )
}
