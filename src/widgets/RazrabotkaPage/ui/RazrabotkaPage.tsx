import { Hero } from '@/widgets/Hero'
import { HowItWorks } from '@/widgets/HowItWorks'
import { Portfolio } from '@/widgets/Portfolio'
import { Stats } from '@/widgets/Stats'
import { Pricing } from '@/widgets/Pricing'
import { Cta } from '@/widgets/Cta'
import type { RazrabotkaPageConfig } from '@/entities/ServicePage'
import styles from './RazrabotkaPage.module.scss'
import { AboutSection } from './AboutSection'
import { BenefitsSection } from './BenefitsSection'
import { ComparisonSection } from './ComparisonSection'
import { MobileSitesCarousel } from './MobileSitesCarousel'
import { SupportSection } from './SupportSection'

type Props = {
  config: RazrabotkaPageConfig
}

export function RazrabotkaPage({ config }: Props) {
  return (
    <div className={styles.pageCanvas}>
      <Hero
        eyebrow={config.hero.eyebrow}
        headingText={config.hero.headingText}
        gradientSubheading={config.hero.gradientSubheading}
        gradientSubheadingSecondary={config.hero.gradientSubheadingSecondary}
        sub={config.hero.sub}
        ctaPrimary={{ ...config.hero.ctaPrimary, opensForm: true }}
        ctaSecondary={config.hero.ctaSecondary}
        visual={<MobileSitesCarousel />}
      />
      <AboutSection aboutText={config.about[1]} />
      <BenefitsSection benefits={config.benefits} />
      <ComparisonSection comparison={config.comparison} whatYouGet={config.whatYouGet} />
      <HowItWorks
        eyebrow="Как мы работаем"
        title="От задачи до первых заявок"
        steps={config.steps}
        floatingBlobs
      />
      <Portfolio desktopCarousel />
      <Stats items={config.stats} />
      <Pricing plans={config.pricing} paymentNote={config.paymentNote} />
      <SupportSection support={config.support} />
      <Cta
        eyebrow={config.cta.eyebrow}
        heading={config.cta.heading}
        sub={config.cta.sub}
        buttonText={config.cta.buttonText}
        modalTitle={config.cta.modalTitle}
      />
    </div>
  )
}
