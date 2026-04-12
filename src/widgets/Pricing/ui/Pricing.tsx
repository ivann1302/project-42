'use client'

import { useRef } from 'react'
import { Button, Container, Icon, SectionTitle, StarField, GlowBlob } from '@/shared/ui'
import { useScrollReveal } from '@/shared/lib'
import { pricingPlans as defaultPlans } from '@/entities/PricingPlan'
import type { PricingPlan } from '@/entities/PricingPlan'
import styles from './Pricing.module.scss'

type Props = {
  plans?: PricingPlan[]
  paymentNote?: string
  eyebrow?: string
  title?: string
}

export function Pricing({
  plans = defaultPlans,
  paymentNote = 'Оплата поэтапно: 50% предоплата, 50% после запуска. Работаем по договору.',
  eyebrow = 'Прозрачные цены',
  title = 'Выберите формат работы',
}: Props) {
  const gridRef = useRef<HTMLUListElement>(null)
  useScrollReveal(gridRef, { threshold: 0.1 })

  const getAnimIndex = (idx: number, highlighted?: boolean) => {
    if (highlighted) return 0
    const before = plans.slice(0, idx).filter((p) => !p.highlighted).length
    return before + 1
  }

  return (
    <section className={styles.root} id="pricing">
      <StarField />
      <GlowBlob color="blue" size={900} />
      <Container>
        <SectionTitle eyebrow={eyebrow} align="center">
          {title}
        </SectionTitle>
        <p className={styles.paymentNote}>{paymentNote}</p>
        <ul ref={gridRef} className={styles.grid} role="list">
          {plans.map((plan, idx) => (
            <li
              key={plan.id}
              className={[styles.card, plan.highlighted && styles.highlighted]
                .filter(Boolean)
                .join(' ')}
              style={{ '--i': getAnimIndex(idx, plan.highlighted) } as React.CSSProperties}
            >
              {plan.highlighted && <span className={styles.badge}>Популярный выбор</span>}
              <div className={styles.top}>
                <h3 className={styles.name}>{plan.name}</h3>
                <p className={styles.priceNote}>{plan.priceNote}</p>
                <div className={styles.price}>{plan.price}</div>
                <p className={styles.desc}>{plan.description}</p>
              </div>
              <ul className={styles.features} role="list">
                {plan.features.map((feature) => (
                  <li key={feature} className={styles.feature}>
                    <Icon name="check" size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                href="#cta"
                variant={plan.highlighted ? 'primary' : 'ghost'}
                className={styles.cta}
              >
                {plan.cta}
              </Button>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
