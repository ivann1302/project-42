'use client'

import { useRef } from 'react'
import { useScrollReveal } from '@/shared/lib'
import styles from './DecisionWindowSection.module.scss'

export function DecisionWindowSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const signalsRef = useRef<HTMLUListElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' })
  useScrollReveal(signalsRef, { threshold: 0.35, rootMargin: '0px 0px -6% 0px' })

  return (
    <section
      ref={sectionRef}
      className={styles.root}
      id="decision-window"
      aria-labelledby="decision-window-title"
    >
      <div className={styles.inner}>
        <h2
          className={styles.title}
          id="decision-window-title"
          aria-label="30 секунд Именно столько клиенту нужно, чтобы понять: ваша услуга решает его задачу."
        >
          <span className={styles.numberGroup}>
            <span className={styles.number}>30</span>
            <span className={styles.unit}>секунд</span>
          </span>
          <span className={styles.statement}>
            Именно столько клиенту нужно, чтобы понять: ваша услуга решает его задачу.
          </span>
        </h2>

        <p className={styles.text}>
          Поэтому первый экран и ключевые блоки мы собираем как короткий маршрут: ясная польза,
          доверие, доказательства и действие без лишнего шума.
        </p>

        <ul
          ref={signalsRef}
          className={styles.signals}
          aria-label="Что должно быть понятно за 30 секунд"
        >
          <li>
            <a className={styles.signalLink} href="#services">
              Что делаем
            </a>
          </li>
          <li>
            <a className={styles.signalLink} href="#projects">
              Почему можно доверять
            </a>
          </li>
          <li>
            <a className={styles.signalLink} href="#cta">
              куда нажать дальше
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
