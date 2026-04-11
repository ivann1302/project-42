import { faqItems } from '@/entities/FaqItem'
import { testimonials } from '@/entities/Testimonial'
import { Header } from '@/widgets/Header'
import { Hero } from '@/widgets/Hero'
import { WhyUs } from '@/widgets/WhyUs'
import { Services } from '@/widgets/Services'
import { HowItWorks } from '@/widgets/HowItWorks'
import { Portfolio } from '@/widgets/Portfolio'
import { Stats } from '@/widgets/Stats'
import { Testimonials } from '@/widgets/Testimonials'
import { Pricing } from '@/widgets/Pricing'
import { DirectorMessage } from '@/widgets/DirectorMessage'
import { Cta } from '@/widgets/Cta'
import { Faq } from '@/widgets/Faq'
import { WhatWeDontDo } from '@/widgets/WhatWeDontDo'
import { Footer } from '@/widgets/Footer'

const reviewsSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Project 42',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: String(testimonials.length),
    bestRating: '5',
    worstRating: '1',
  },
  review: testimonials.map((t) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: t.author },
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: t.text,
  })),
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />
      <Header />
      <main>
        <Hero />
        <WhyUs />
        <Services />
        <HowItWorks />
        <Portfolio />
        <Stats />
        <Testimonials />
        <DirectorMessage />
        <WhatWeDontDo />
        <Pricing />
        <Cta />
        <Faq />
      </main>
      <Footer />
    </>
  )
}
