import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticlePage } from '@/widgets/ArticlePage'
import { articles, getArticleBySlug } from '@/entities/Article'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { siteConfig } from '@/shared/config/seo'
import { MobileConsultationButton } from '@/shared/ui'

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Статья не найдена',
    }
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: `${article.title} | ${siteConfig.name}`,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
      url: `/blog/${article.slug}`,
    },
  }
}

export default async function ArticleRoute({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${article.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header />
      <main>
        <ArticlePage article={article} />
      </main>
      <Footer />
      <MobileConsultationButton />
    </>
  )
}
