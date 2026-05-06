'use client'

import { useRef } from 'react'
import { Container, GlowBlob, Icon, SectionTitle, StarField } from '@/shared/ui'
import { useScrollReveal } from '@/shared/lib'
import type { WhyNowItem } from '@/entities/ServicePage'
import styles from './WhyNow.module.scss'

type Props = {
  eyebrow: string
  title: string
  sub: string
  items: WhyNowItem[]
}

export function WhyNow({ eyebrow, title, sub, items }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  useScrollReveal(sectionRef, { threshold: 0.1 })

  return (
    <section ref={sectionRef} className={styles.root}>
      <StarField />
      <GlowBlob color="purple" size={500} />
      <Container>
        <SectionTitle eyebrow={eyebrow} align="center">
          {title}
        </SectionTitle>
        <p className={styles.sub}>{sub}</p>
        <ul className={styles.grid} role="list">
          {items.map((item, idx) => (
            <li
              key={item.title}
              className={styles.card}
              style={{ '--i': idx } as React.CSSProperties}
            >
              <span className={styles.iconWrap} aria-hidden="true">
                <Icon name={item.icon} size={28} />
              </span>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
