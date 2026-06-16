'use client'

import { useRef } from 'react'
import { Container, SectionTitle, StarField } from '@/shared/ui'
import { useScrollReveal } from '@/shared/lib'
import type { CaseItem } from '@/entities/ServicePage'
import styles from './Cases.module.scss'

type Props = {
  items: CaseItem[]
  eyebrow?: string
  title?: string
}

export function Cases({ items, eyebrow = 'Результаты', title = 'Кейсы' }: Props) {
  const gridRef = useRef<HTMLUListElement>(null)
  useScrollReveal(gridRef, { threshold: 0.1 })

  return (
    <section className={styles.root} id="cases">
      <StarField />
      <Container>
        <SectionTitle eyebrow={eyebrow} align="center" headingClassName={styles.sectionHeading}>
          {title}
        </SectionTitle>
        <ul ref={gridRef} className={styles.grid} role="list">
          {items.map((item, idx) => (
            <li key={item.id} className={styles.card} style={{ '--i': idx } as React.CSSProperties}>
              <div className={styles.header}>
                <h3 className={styles.title}>{item.title}</h3>
                <span className={styles.niche}>{item.niche}</span>
              </div>
              <div className={styles.metrics}>
                <div className={styles.metricBlock}>
                  <span className={styles.metricLabel}>Было</span>
                  <span className={styles.metricValue}>{item.metricsBefore}</span>
                </div>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
                <div className={styles.metricBlock}>
                  <span className={styles.metricLabel}>Стало</span>
                  <span className={`${styles.metricValue} ${styles.metricValueGood}`}>
                    {item.metricsAfter}
                  </span>
                </div>
              </div>
              <div className={styles.footer}>
                <span className={styles.duration}>Срок: {item.duration}</span>
                <ul className={styles.tags} role="list">
                  {item.tags.map((tag) => (
                    <li key={tag} className={styles.tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
