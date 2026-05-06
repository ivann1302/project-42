import type { CSSProperties } from 'react'
import { Container, GlowBlob, Icon, ScrollReveal, SectionTitle, StarField } from '@/shared/ui'
import type { IconName } from '@/shared/ui'
import styles from './WhyUs.module.scss'

type Comparison = {
  icon: IconName
  them: string
  us: string
}

const comparisons: Comparison[] = [
  {
    icon: 'target',
    them: '10+ проектов параллельно',
    us: 'Не более 4 проектов в работе',
  },
  {
    icon: 'zap',
    them: 'AI игнорируют или скрывают',
    us: 'AI — инструмент скорости',
  },
  {
    icon: 'layers',
    them: 'Смета растёт без объяснений',
    us: 'Отлаженные процессы, честная цена',
  },
  {
    icon: 'code',
    them: 'SEO — отдельный подрядчик',
    us: 'Дизайн, SEO, GEO (AI-поиск) — всё в одном',
  },
  {
    icon: 'shield',
    them: 'Код — чёрный ящик',
    us: 'Чистый код для легкой поддержки',
  },
  {
    icon: 'rocket',
    them: 'Менеджеры съедают бюджет',
    us: 'Только работа и результат',
  },
]

export function WhyUs() {
  return (
    <section className={styles.root} id="why">
      <StarField />
      <GlowBlob size={900} y={62} className={styles.blob} />
      <Container>
        <SectionTitle eyebrow="Наш подход" align="center">
          Чем мы отличаемся от других веб-студий
        </SectionTitle>
        <ScrollReveal className={styles.versus} threshold={0.15}>
          <div className={styles.colThem}>
            <div className={styles.colHeader}>Обычно</div>
            {comparisons.map((c, i) => (
              <div key={c.icon} className={styles.row} style={{ '--i': i } as CSSProperties}>
                <span className={styles.dot} aria-hidden="true" />
                <span>{c.them}</span>
              </div>
            ))}
          </div>

          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <div className={styles.badge}>VS</div>
            <div className={styles.dividerLine} />
          </div>

          <div className={styles.colUs}>
            <div className={styles.colHeader}>Мы</div>
            {comparisons.map((c, i) => (
              <div key={c.icon} className={styles.row} style={{ '--i': i } as CSSProperties}>
                <span>{c.us}</span>
                <Icon name={c.icon} size={22} className={styles.icon} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  )
}
