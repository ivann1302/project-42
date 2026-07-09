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
  const authorName = article.authorProfile?.name ?? article.author

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${article.title} | ${siteConfig.name}`,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [authorName],
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
  const authorProfile = article.authorProfile
  const authorUrl = authorProfile?.url
    ? new URL(authorProfile.url, siteConfig.url).toString()
    : siteConfig.url

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    inLanguage: 'ru-RU',
    articleSection: article.category,
    keywords: article.keywords,
    about: article.keywords?.slice(0, 8).map((keyword) => ({
      '@type': 'Thing',
      name: keyword,
    })),
    image: article.coverImage ? `${siteConfig.url}${article.coverImage}` : undefined,
    author: authorProfile
      ? {
          '@type': 'Person',
          name: authorProfile.name,
          jobTitle: authorProfile.role,
          description: authorProfile.bio,
          url: authorUrl,
          sameAs: authorProfile.sameAs,
        }
      : {
          '@type': 'Organization',
          name: article.author,
          url: siteConfig.url,
        },
    reviewedBy: article.reviewedBy
      ? {
          '@type': 'Organization',
          name: article.reviewedBy,
          url: siteConfig.url,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      sameAs: siteConfig.sameAs,
    },
    citation: article.sources?.map((source) => source.href),
    isBasedOn: article.evidence?.map((item) => ({
      '@type': 'CreativeWork',
      name: item,
    })),
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
