import { Container, Icon, SectionTitle } from '@/shared/ui'
import { testimonials } from '@/entities/Testimonial'
import styles from './Testimonials.module.scss'

export function Testimonials() {
  return (
    <section className={styles.root}>
      <Container>
        <SectionTitle eyebrow="Что говорят клиенты" align="center">
          Отзывы
        </SectionTitle>
        <ul className={styles.grid} role="list">
          {testimonials.map((t) => (
            <li key={t.id} className={styles.card}>
              <div className={styles.stars} aria-label="5 из 5 звёзд">
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
        </ul>
      </Container>
    </section>
  )
}
