export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'
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
