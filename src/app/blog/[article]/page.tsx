import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { articles, getArticleBySlug } from '@/entities/Article'
import { ArticleRouteView, buildArticleMetadata } from '../articleRoute'

type Props = {
  params: Promise<{ article: string }>
}

export function generateStaticParams() {
  return articles.map((article) => ({
    article: article.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { article: articleSlug } = await params
  const article = getArticleBySlug(articleSlug)

  if (!article) {
    return {
      title: 'Статья не найдена',
    }
  }

  return buildArticleMetadata(article)
}

export default async function ArticleRoute({ params }: Props) {
  const { article: articleSlug } = await params
  const article = getArticleBySlug(articleSlug)

  if (!article) {
    notFound()
  }

  return <ArticleRouteView article={article} />
}
