export type ArticleCategory = 'Разработка' | 'SEO' | 'Маркетинг' | 'Процессы'
export type ArticleCategorySlug = 'razrabotka' | 'seo' | 'marketing' | 'processy'

export type ArticleLink = {
  label: string
  href: string
}

export type ArticleAuthor = {
  name: string
  role: string
  bio: string
  url?: string
  sameAs?: string[]
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

export type ArticleTable = {
  headers: string[]
  rows: string[][]
}

export type ArticleCta = {
  kicker: string
  title: string
  accent: string
  text: string
  primary: ArticleLink
  secondary?: ArticleLink
  image: ArticleImage
}

export type ArticleSection = {
  heading: string
  paragraphs: ArticleParagraph[]
  list?: string[]
  table?: ArticleTable
  image?: ArticleImage
  variant?: 'highlight' | 'blueHighlight'
}

export type Article = {
  slug: string
  title: string
  description: string
  category: ArticleCategory
  categorySlug: ArticleCategorySlug
  publishedAt: string
  updatedAt?: string
  readingTime: string
  author: string
  authorProfile?: ArticleAuthor
  reviewedBy?: string
  evidence?: string[]
  sources?: ArticleLink[]
  keywords?: string[]
  coverImage?: string
  sourceUrl?: string
  sourceLabel?: string
  footerLinks?: ArticleLink[]
  cta?: ArticleCta
  sections: ArticleSection[]
}
