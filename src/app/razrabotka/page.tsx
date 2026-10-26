import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { DevelopmentHeader } from './DevelopmentHeader'
import { DevelopmentHero } from './DevelopmentHero'
import { DevelopmentBlobBackdrop } from './DevelopmentBlobBackdrop'
import { DevelopmentIntro } from './DevelopmentIntro'
import { DevelopmentGallery } from './DevelopmentGallery'
import { DevelopmentBenefits } from './DevelopmentBenefits'
import { DevelopmentProcess } from './DevelopmentProcess'
import { DevelopmentPricing } from './DevelopmentPricing'
import { DevelopmentPromotion } from './DevelopmentPromotion'
import { DevelopmentTestimonials } from './DevelopmentTestimonials'
import { DevelopmentCta } from './DevelopmentCta'
import { DevelopmentFaq } from './DevelopmentFaq'
import { DevelopmentFooter } from './DevelopmentFooter'
import { DevelopmentMotion } from './DevelopmentMotion'
import { DevelopmentMobileCta } from './DevelopmentMobileCta'
import { DevelopmentAutoContact } from './DevelopmentAutoContact'
import styles from './page.module.scss'

const golos = localFont({
  src: '../../../public/fonts/golos-text-variable.ttf',
  weight: '400 900',
  display: 'swap',
  variable: '--font-development',
})

export const metadata: Metadata = {
  title: 'Разработка',
}

export default function DevelopmentPage() {
  return (
    <DevelopmentMotion className={`${golos.variable} ${styles.theme}`}>
      <main aria-label="Разработка">
        <div className={styles.heroFlow}>
          <section className={styles.hero} id="top" aria-label="Разработка — главный экран">
            <DevelopmentHeader />
            <DevelopmentBlobBackdrop />
            <DevelopmentHero />
          </section>
          <DevelopmentIntro />
        </div>
        <DevelopmentGallery />
        <DevelopmentBenefits />
        <DevelopmentProcess />
        <DevelopmentPricing />
        <DevelopmentPromotion />
        <DevelopmentTestimonials />
        <DevelopmentCta />
        <DevelopmentFaq />
      </main>
      <DevelopmentFooter />
      <DevelopmentMobileCta />
      <DevelopmentAutoContact />
    </DevelopmentMotion>
  )
}
