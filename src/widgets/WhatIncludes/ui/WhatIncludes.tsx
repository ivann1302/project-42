import { Container, Icon, ScrollReveal, SectionTitle, StarField } from '@/shared/ui'
import type { WhatIncludesColumn } from '@/entities/ServicePage'
import styles from './WhatIncludes.module.scss'

type Props = {
  eyebrow: string
  title: string
  columns: WhatIncludesColumn[]
}

export function WhatIncludes({ eyebrow, title, columns }: Props) {
  return (
    <section className={styles.root}>
      <StarField />
      <Container>
        <SectionTitle eyebrow={eyebrow} align="center">
          {title}
        </SectionTitle>
        <ScrollReveal className={styles.grid} threshold={0.1}>
          {columns.map((col, colIdx) => (
            <div
              key={col.label}
              className={styles.column}
              style={{ '--i': colIdx } as React.CSSProperties}
            >
              <h3 className={styles.colLabel}>{col.label}</h3>
              <ul className={styles.list} role="list">
                {col.items.map((item) => (
                  <li key={item} className={styles.item}>
                    <Icon name="check" size={16} className={styles.checkIcon} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollReveal>
      </Container>
    </section>
  )
}
