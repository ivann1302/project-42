export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'
import { articles, getArticlePath } from '@/entities/Article'
import { siteConfig } from '@/shared/config/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date('2026-04-11'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/portfolio`,
      lastModified: new Date('2026-04-11'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/razrabotka-sayta`,
      lastModified: new Date('2026-06-16'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/seo-prodvizhenie`,
      lastModified: new Date('2026-06-16'),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date('2026-06-04'),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    ...articles.map((article) => ({
      url: `${siteConfig.url}${getArticlePath(article)}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
    {
      url: `${siteConfig.url}/privacy-policy`,
      lastModified: new Date('2026-05-27'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${siteConfig.url}/offer`,
      lastModified: new Date('2026-05-27'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]
}
