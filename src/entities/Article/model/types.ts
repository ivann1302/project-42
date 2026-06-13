export type ArticleCategory = 'Разработка' | 'SEO' | 'Маркетинг' | 'Процессы'

export type ArticleSection = {
  heading: string
  paragraphs: string[]
}

export type Article = {
  slug: string
  title: string
  description: string
  category: ArticleCategory
  publishedAt: string
  readingTime: string
  author: string
  accent: 'purple' | 'blue' | 'mint'
  highlights: string[]
  sections: ArticleSection[]
}
