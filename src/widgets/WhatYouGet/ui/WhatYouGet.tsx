'use client'

import { useRef, type CSSProperties } from 'react'
import { Container, IconCard, SectionTitle, StarField } from '@/shared/ui'
import { useScrollReveal } from '@/shared/lib'
import type { ServiceIconItem } from '@/entities/ServicePage'
import styles from './WhatYouGet.module.scss'

type Props = {
  items: ServiceIconItem[]
  eyebrow?: string
  title?: string
  itemTitleClassName?: string
  itemDescriptionClassName?: string
}

export function WhatYouGet({
  items,
  eyebrow = 'Что вы получаете',
  title = 'Что входит в разработку',
  itemTitleClassName,
  itemDescriptionClassName,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  useScrollReveal(sectionRef, { threshold: 0.1 })

  return (
    <section ref={sectionRef} className={styles.root} aria-label={title}>
      <StarField />
      <Container>
        <SectionTitle eyebrow={eyebrow} align="center">
          {title}
        </SectionTitle>
        <ul className={styles.grid} role="list">
          {items.map((item, idx) => (
            <IconCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
              style={{ '--i': idx } as CSSProperties}
              titleClassName={itemTitleClassName}
              descriptionClassName={itemDescriptionClassName}
            />
          ))}
        </ul>
      </Container>
    </section>
  )
}
