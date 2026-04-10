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

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhyUs />
        <Services />
        <HowItWorks />
        <WhatWeDontDo />
        <Portfolio />
        <Stats />
        <Testimonials />
        <DirectorMessage />
        <Pricing />
        <Cta />
        <Faq />
      </main>
      <Footer />
    </>
  )
}
