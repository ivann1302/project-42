export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'
import { articles, getArticlePath } from '@/entities/Article'
import { draftPages } from '@/entities/DraftPage'
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
      url: `${siteConfig.url}/geo-aeo-prodvizhenie`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/geo-prodvizhenie`,
      lastModified: new Date('2026-07-06'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/ai-seo-prodvizhenie`,
      lastModified: new Date('2026-07-06'),
      changeFrequency: 'monthly',
      priority: 0.86,
    },
    {
      url: `${siteConfig.url}/aeo-prodvizhenie`,
      lastModified: new Date('2026-07-06'),
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date('2026-06-04'),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    ...articles.map((article) => ({
      url: `${siteConfig.url}${getArticlePath(article)}`,
      lastModified: new Date(article.updatedAt ?? article.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
    ...draftPages.map((page) => ({
      url: `${siteConfig.url}/${page.slug}`,
      lastModified: new Date('2026-07-08'),
      changeFrequency: 'monthly' as const,
      priority: page.kind === 'service' ? 0.62 : 0.56,
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
