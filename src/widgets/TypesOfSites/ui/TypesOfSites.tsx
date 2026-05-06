'use client'

import { useRef } from 'react'
import { Container, GlowBlob, Icon, SectionTitle, StarField } from '@/shared/ui'
import { useScrollReveal } from '@/shared/lib'
import type { TypeOfSite } from '@/entities/ServicePage'
import styles from './TypesOfSites.module.scss'

type Props = {
  items: TypeOfSite[]
  eyebrow?: string
  title?: string
}

export function TypesOfSites({
  items,
  eyebrow = 'Форматы',
  title = 'Какие сайты мы делаем',
}: Props) {
  const gridRef = useRef<HTMLUListElement>(null)
  useScrollReveal(gridRef, { threshold: 0.1 })

  return (
    <section className={styles.root} aria-label={title}>
      <StarField />
      <GlowBlob color="blue" size={900} />
      <Container>
        <SectionTitle eyebrow={eyebrow} align="center">
          {title}
        </SectionTitle>
        <ul ref={gridRef} className={styles.grid} role="list">
          {items.map((item, idx) => (
            <li
              key={item.title}
              className={styles.card}
              style={{ '--i': idx } as React.CSSProperties}
            >
              <span className={styles.iconWrap} aria-hidden="true">
                <Icon name={item.icon} size={28} />
              </span>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
              <span className={styles.price} aria-label={`Цена: ${item.price}`}>
                {item.price}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
