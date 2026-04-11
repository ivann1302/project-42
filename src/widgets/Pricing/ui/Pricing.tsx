import { Button, Container, Icon, SectionTitle, StarField, GlowBlob } from '@/shared/ui'
import { pricingPlans } from '@/entities/PricingPlan'
import styles from './Pricing.module.scss'

export function Pricing() {
  return (
    <section className={styles.root} id="pricing">
      <StarField />
      <GlowBlob color="blue" size={900} />
      <Container>
        <SectionTitle eyebrow="Прозрачные цены" align="center">
          Выберите формат работы
        </SectionTitle>
        <p className={styles.paymentNote}>
          Оплата поэтапно: 50% предоплата, 50% после запуска. Работаем по договору.
        </p>
        <ul className={styles.grid} role="list">
          {pricingPlans.map((plan) => (
            <li
              key={plan.id}
              className={[styles.card, plan.highlighted && styles.highlighted]
                .filter(Boolean)
                .join(' ')}
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
