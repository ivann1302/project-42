import type { Metadata } from 'next'
import { Inter, Syne } from 'next/font/google'
import { siteConfig } from '@/shared/config/seo'
import '@/shared/styles/globals.scss'

const fontBody = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
  display: 'swap',
})

const fontDisplay = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${fontBody.variable} ${fontDisplay.variable}`}>
      <body>{children}</body>
    </html>
  )
}
