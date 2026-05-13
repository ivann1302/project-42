import { Container, SectionTitle, StarField } from '@/shared/ui'
import styles from './RazrabotkaPage.module.scss'

type Props = {
  benefits: string[]
}

export function BenefitsSection({ benefits }: Props) {
  return (
    <section
      className={styles.benefits}
      aria-labelledby="landing-benefits-title"
      data-feedback-trigger
    >
      <StarField />
      <Container className={styles.sectionContent}>
        <SectionTitle eyebrow="Что вы получите" align="center">
          <span id="landing-benefits-title">Результат после запуска</span>
        </SectionTitle>
        <ul className={styles.benefitsList} role="list">
          {benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
