import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { articles, getArticleByCategoryAndSlug } from '@/entities/Article'
import { ArticleRouteView, buildArticleMetadata } from '../../articleRoute'

type Props = {
  params: Promise<{ slug: string; article: string }>
}

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.categorySlug,
    article: article.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, article: articleSlug } = await params
  const article = getArticleByCategoryAndSlug(slug, articleSlug)

  if (!article) {
    return {
      title: 'Статья не найдена',
    }
  }

  return buildArticleMetadata(article)
}

export default async function NestedArticleRoute({ params }: Props) {
  const { slug, article: articleSlug } = await params
  const article = getArticleByCategoryAndSlug(slug, articleSlug)

  if (!article) {
    notFound()
  }

  return <ArticleRouteView article={article} />
}
