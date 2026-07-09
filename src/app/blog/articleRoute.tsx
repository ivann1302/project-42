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
  const authorUrl = article.authorProfile?.url
    ? new URL(article.authorProfile.url, siteConfig.url).toString()
    : siteConfig.url

  return {
    title: article.seoTitle ?? article.title,
    description: article.description,
    authors: [{ name: authorName, url: authorUrl }],
    creator: authorName,
    publisher: siteConfig.name,
    keywords: article.keywords,
    category: article.category,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.ogTitle ?? `${article.title} | ${siteConfig.name}`,
      description: article.ogDescription ?? article.description,
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
      title: article.ogTitle ?? article.seoTitle ?? article.title,
      description: article.ogDescription ?? article.description,
      images: [image],
    },
    other: {
      'reviewed-by': article.reviewedBy ?? siteConfig.name,
      'last-reviewed': article.updatedAt ?? article.publishedAt,
      'author-role': article.authorProfile?.role ?? siteConfig.name,
      'author-profile': authorUrl,
      'content-evidence': article.evidence?.join('; ') ?? siteConfig.description,
      'content-sources': article.sources?.map((source) => source.href).join('; ') ?? siteConfig.url,
      'eeat-experience': article.evidence?.join('; ') ?? siteConfig.description,
      'eeat-publisher': siteConfig.name,
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
    '@id': `${canonicalUrl}#article`,
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
          knowsAbout: article.keywords,
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
      '@id': `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      email: siteConfig.email,
      founder: {
        '@type': 'Person',
        name: siteConfig.founderName,
      },
      sameAs: siteConfig.sameAs,
    },
    editor: article.reviewedBy
      ? {
          '@type': 'Organization',
          name: article.reviewedBy,
          url: siteConfig.url,
        }
      : undefined,
    accountablePerson: {
      '@type': 'Person',
      name: siteConfig.founderName,
      url: siteConfig.url,
      sameAs: siteConfig.sameAs,
    },
    copyrightHolder: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    citation: article.sources?.map((source) => source.href),
    isBasedOn: article.evidence?.map((item) => ({
      '@type': 'CreativeWork',
      name: item,
    })),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
      url: canonicalUrl,
      reviewedBy: article.reviewedBy
        ? {
            '@type': 'Organization',
            name: article.reviewedBy,
            url: siteConfig.url,
          }
        : undefined,
      dateModified: article.updatedAt ?? article.publishedAt,
    },
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

function buildArticleFaqSchema(article: Article) {
  if (!article.faq?.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function ArticleRouteView({ article }: { article: Article }) {
  const faqSchema = buildArticleFaqSchema(article)

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
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}
      <Header />
      <main>
        <ArticlePage article={article} />
      </main>
      <RazrabotkaFooter />
    </>
  )
}
