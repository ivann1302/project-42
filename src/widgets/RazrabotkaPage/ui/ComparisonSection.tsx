import type { CSSProperties } from 'react'
import { WhatYouGet } from '@/widgets/WhatYouGet'
import { Container, GlowBlob, Icon, ScrollReveal, SectionTitle, StarField } from '@/shared/ui'
import type { IconName } from '@/shared/ui'
import type { RazrabotkaPageConfig } from '@/entities/ServicePage'
import styles from './RazrabotkaPage.module.scss'

type Props = {
  comparison: RazrabotkaPageConfig['comparison']
  whatYouGet: RazrabotkaPageConfig['whatYouGet']
}

const comparisonIcons: IconName[] = ['target', 'eye', 'zap', 'layers', 'searchUp', 'code']

export function ComparisonSection({ comparison, whatYouGet }: Props) {
  const mutedComparison = comparison.find((column) => column.muted) ?? comparison[0]
  const accentComparison =
    comparison.find((column) => !column.muted) ?? comparison[1] ?? comparison[0]

  return (
    <section className={styles.comparison} aria-labelledby="landing-comparison-title">
      <StarField />
      <GlowBlob size={900} y={50} className={styles.comparisonBlob} />
      <Container className={styles.sectionContent}>
        <SectionTitle eyebrow="Сравнение" align="center">
          <span id="landing-comparison-title">Почему наш подход лучше сайта на конструкторе?</span>
        </SectionTitle>
        <ScrollReveal className={styles.comparisonGrid} threshold={0.15}>
          <div className={styles.comparisonColMuted}>
            <div className={styles.comparisonHeader}>{mutedComparison.title}</div>
            {mutedComparison.items.map((item, index) => (
              <div
                key={item}
                className={styles.comparisonRow}
                style={{ '--i': index } as CSSProperties}
              >
                <span className={styles.comparisonDot} aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className={styles.comparisonDivider} aria-hidden="true">
            <div className={styles.comparisonDividerLine} />
            <div className={styles.comparisonBadge}>VS</div>
            <div className={styles.comparisonDividerLine} />
          </div>

          <div className={styles.comparisonColAccent}>
            <div className={styles.comparisonHeader}>{accentComparison.title}</div>
            {accentComparison.items.map((item, index) => (
              <div
                key={item}
                className={styles.comparisonRow}
                style={{ '--i': index } as CSSProperties}
              >
                <span>{item}</span>
                <Icon
                  name={comparisonIcons[index % comparisonIcons.length]}
                  size={22}
                  className={styles.comparisonIcon}
                />
              </div>
            ))}
          </div>
        </ScrollReveal>
        <WhatYouGet
          items={whatYouGet}
          eyebrow="Преимущества"
          title="Почему наш лендинг  будет лучше чем у ваших конкурентов?"
          itemTitleClassName={styles.comparisonBenefitTitle}
          itemDescriptionClassName={styles.comparisonBenefitDescription}
        />
      </Container>
    </section>
  )
}
