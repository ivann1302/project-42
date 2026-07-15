'use client'

import { useRef } from 'react'
import { useScrollReveal } from '@/shared/lib'
import styles from './CompetitorChoiceSection.module.scss'

const decisionSignals = [
  'Чёткий оффер',
  'Сильные работы',
  'Кейсы с результатом',
  'Понятный следующий шаг',
] as const

export function CompetitorChoiceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const supportRef = useRef<HTMLDivElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' })
  useScrollReveal(supportRef, { threshold: 0.32, rootMargin: '0px 0px -6% 0px' })

  return (
    <section
      ref={sectionRef}
      className={styles.root}
      id="competitor-choice"
      aria-labelledby="competitor-choice-title"
    >
      <div className={styles.inner}>
        <h2
          className={styles.title}
          id="competitor-choice-title"
          aria-label="Что, если вы лучше конкурента, а клиент всё равно выбирает его?"
        >
          <span className={styles.titleLine}>Что, если вы</span>
          <span className={`${styles.titleLine} ${styles.accentLine}`}>лучше конкурента,</span>
          <span className={styles.titleLine}>а клиент всё равно</span>
          <span className={`${styles.titleLine} ${styles.outlineLine}`}>выбирает его?</span>
        </h2>

        <div ref={supportRef} className={styles.support}>
          <p className={styles.text}>
            Потому что клиент оценивает не весь ваш опыт — только то, что успел увидеть.
          </p>

          <ul className={styles.signals} aria-label="Что помогает клиенту принять решение">
            {decisionSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>

          <p className={styles.conclusion}>
            <span>Хороший сайт</span> показывает ваш уровень ещё до первого разговора.
          </p>
        </div>
      </div>
    </section>
  )
}
