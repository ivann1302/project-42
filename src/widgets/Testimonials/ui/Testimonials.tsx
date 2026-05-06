import type { CSSProperties } from 'react'
import { Container, GlowBlob, Icon, ScrollReveal, SectionTitle, StarField } from '@/shared/ui'
import { testimonials as defaultTestimonials } from '@/entities/Testimonial'
import type { Testimonial } from '@/entities/Testimonial'
import styles from './Testimonials.module.scss'

type Props = {
  items?: Testimonial[]
  eyebrow?: string
  title?: string
}

export function Testimonials({
  items = defaultTestimonials,
  eyebrow = 'Что говорят клиенты',
  title = 'Отзывы',
}: Props) {
  return (
    <section className={styles.root}>
      <StarField />
      <GlowBlob color="purple" size={937} x={50} y={46} />
      <Container>
        <SectionTitle eyebrow={eyebrow} align="center">
          {title}
        </SectionTitle>
        <ScrollReveal as="ul" className={styles.grid} role="list" threshold={0.1}>
          {items.map((t, idx) => (
            <li key={t.id} className={styles.card} style={{ '--i': idx } as CSSProperties}>
              <div className={styles.stars} role="img" aria-label="5 из 5 звёзд">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" size={14} />
                ))}
              </div>
              <p className={styles.text}>{t.text}</p>
              <div className={styles.author}>
                <div className={styles.avatar} aria-hidden="true">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className={styles.name}>{t.author}</div>
                  <div className={styles.role}>
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ScrollReveal>
      </Container>
    </section>
  )
}
