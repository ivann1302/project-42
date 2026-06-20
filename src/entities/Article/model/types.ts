export type ArticleCategory = 'Разработка' | 'SEO' | 'Маркетинг' | 'Процессы'

export type ArticleLink = {
  label: string
  href: string
}

export type ArticleParagraph =
  | string
  | {
      text: string
      links: ArticleLink[]
    }

export type ArticleImage = {
  src: string
  alt: string
  caption?: string
}

export type ArticleSection = {
  heading: string
  paragraphs: ArticleParagraph[]
  list?: string[]
  image?: ArticleImage
  variant?: 'highlight'
}

export type Article = {
  slug: string
  title: string
  description: string
  category: ArticleCategory
  publishedAt: string
  readingTime: string
  author: string
  coverImage?: string
  sourceUrl?: string
  sourceLabel?: string
  footerLinks?: ArticleLink[]
  sections: ArticleSection[]
}
