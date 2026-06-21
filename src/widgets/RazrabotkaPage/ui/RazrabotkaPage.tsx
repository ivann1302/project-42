import type { RazrabotkaPageConfig } from '@/entities/ServicePage'
import { RazrabotkaChatButton } from './RazrabotkaChatButton'
import { RazrabotkaAftercareSection } from './RazrabotkaAftercareSection'
import { DecisionWindowSection } from './DecisionWindowSection'
import { RazrabotkaBlogCarouselSection } from './RazrabotkaBlogCarouselSection'
import { RazrabotkaCasesSection } from './RazrabotkaCasesSection'
import { RazrabotkaCtaSection } from './RazrabotkaCtaSection'
import { RazrabotkaFounderSection } from './RazrabotkaFounderSection'
import { RazrabotkaHero } from './RazrabotkaHero'
import { RazrabotkaLevelUpBanner } from './RazrabotkaLevelUpBanner'
import { RazrabotkaQuizSection } from './RazrabotkaQuizSection'
import { RazrabotkaServicesCarouselSection } from './RazrabotkaServicesCarouselSection'
import { RazrabotkaTestimonialsSection } from './RazrabotkaTestimonialsSection'
import { WhatWeDoSection } from './WhatWeDoSection'
import { WorkProcessSection } from './WorkProcessSection'
import { RazrabotkaFooter } from './RazrabotkaFooter'
import { RazrabotkaHeader } from './RazrabotkaHeader'
import styles from './RazrabotkaPage.module.scss'

type Props = {
  config: RazrabotkaPageConfig
}

export function RazrabotkaPage({ config }: Props) {
  void config

  return (
    <div className={styles.pageCanvas} data-testid="razrabotka-page-canvas">
      <RazrabotkaHeader />
      <main>
        <RazrabotkaHero />
        <DecisionWindowSection />
        <WhatWeDoSection />
        <WorkProcessSection />
        <RazrabotkaCasesSection />
        <RazrabotkaTestimonialsSection />
        <RazrabotkaServicesCarouselSection />
        <RazrabotkaFounderSection />
        <RazrabotkaCtaSection />
        <RazrabotkaAftercareSection />
        <RazrabotkaQuizSection />
        <RazrabotkaBlogCarouselSection />
        <RazrabotkaLevelUpBanner />
      </main>
      <RazrabotkaChatButton />
      <RazrabotkaFooter usePageAnchors />
      <RazrabotkaLevelUpBanner placement="mobile" decorative />
    </div>
  )
}
