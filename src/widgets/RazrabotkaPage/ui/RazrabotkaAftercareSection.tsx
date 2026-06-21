'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useScrollReveal } from '@/shared/lib'
import styles from './RazrabotkaAftercareSection.module.scss'

const benefits = [
  {
    value: 'Правки',
    title: '14 дней',
    description: 'помогаем внести изменения после запуска',
  },
  {
    value: 'Гарантия',
    title: '1 год',
    description: 'исправляем возможные ошибки разработки',
  },
  {
    value: 'Защита',
    title: 'В подарок',
    description: 'подключаем защиту от перехвата клиентов и спама',
  },
] as const

export function RazrabotkaAftercareSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.22, rootMargin: '0px 0px -12% 0px' })

  return (
    <section ref={sectionRef} className={styles.root} aria-labelledby="razrabotka-aftercare-title">
      <div className={styles.shell}>
        <div className={styles.content}>
          <h2 className={styles.title} id="razrabotka-aftercare-title">
            И да...
          </h2>
          <p className={styles.subtitle}>После запуска</p>

          <ul className={styles.benefits} aria-label="Поддержка после запуска">
            {benefits.map((item) => (
              <li className={styles.benefit} key={item.value}>
                <span className={styles.benefitValue}>{item.value}</span>
                <span className={styles.benefitCopy}>
                  <span className={styles.benefitTitle}>{item.title}</span>
                  <span className={styles.benefitDescription}>{item.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <figure className={styles.visual}>
          <Image
            className={styles.image}
            src="/images/razrabotka/after-cta.webp"
            alt="Поддержка Project 42 после запуска лендинга"
            width={420}
            height={320}
            sizes="(max-width: 767px) 86px, (max-width: 1023px) 260px, 280px"
          />
        </figure>
      </div>
    </section>
  )
}
