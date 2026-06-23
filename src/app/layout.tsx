import type { Metadata } from 'next'
import Script from 'next/script'
import { Suspense } from 'react'
import { siteConfig } from '@/shared/config/seo'
import { YANDEX_METRIKA_ID } from '@/shared/lib/metrika'
import { CookieNotice } from '@/shared/ui/CookieNotice'
import { DesktopCursor } from '@/shared/ui/DesktopCursor'
import { LeadAttribution } from '@/shared/ui/LeadAttribution'
import { YandexMetrika } from '@/shared/ui/YandexMetrika'
import '@/shared/styles/globals.scss'

const organizationId = `${siteConfig.url}/#organization`
const websiteId = `${siteConfig.url}/#website`
const professionalServiceId = `${siteConfig.url}/#professional-service`

const organizationSchema = {
  '@type': 'Organization',
  '@id': organizationId,
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  url: siteConfig.url,
  email: siteConfig.email,
  description: siteConfig.description,
  founder: { '@type': 'Person', name: siteConfig.founderName },
  sameAs: siteConfig.sameAs,
  serviceType: siteConfig.services,
}

const websiteSchema = {
  '@type': 'WebSite',
  '@id': websiteId,
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: 'ru-RU',
  description: siteConfig.description,
  publisher: { '@id': organizationId },
}

const professionalServiceSchema = {
  '@type': ['ProfessionalService', 'LocalBusiness'],
  '@id': professionalServiceId,
  name: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
  image: `${siteConfig.url}/og-image.jpg`,
  description: siteConfig.description,
  founder: { '@type': 'Person', name: siteConfig.founderName },
  address: {
    '@type': 'PostalAddress',
    addressLocality: siteConfig.addressLocality,
    addressCountry: siteConfig.addressCountry,
  },
  areaServed: {
    '@type': 'Country',
    name: 'Россия',
  },
  sameAs: siteConfig.sameAs,
  knowsAbout: siteConfig.keywords,
  makesOffer: siteConfig.services.map((service) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: service,
    },
  })),
}

const siteSchema = {
  '@context': 'https://schema.org',
  '@graph': [organizationSchema, websiteSchema, professionalServiceSchema],
}

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
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta name="color-scheme" content="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body>
        {children}
        <DesktopCursor />
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}', 'ym');

            window.dataLayer = window.dataLayer || [];
            ym(${YANDEX_METRIKA_ID}, 'init', {
              ssr: true,
              webvisor: true,
              clickmap: true,
              ecommerce: 'dataLayer',
              referrer: document.referrer,
              url: location.href,
              accurateTrackBounce: true,
              trackLinks: true
            });
          `}
        </Script>
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
        <Suspense fallback={null}>
          <YandexMetrika />
        </Suspense>
        <LeadAttribution />
        <CookieNotice />
      </body>
    </html>
  )
}
