'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useScrollReveal } from '@/shared/lib'
import { MagneticHeading } from '@/shared/ui'
import styles from './WorkProcessSection.module.scss'

const steps = [
  {
    number: '01',
    title: 'Анализ ниши и конкурентов',
    text: 'Разбираем продукт, аудиторию и конкурентную среду, чтобы найти сильные точки для лендинга.',
    image: '/images/razrabotka/work-step-01.webp',
    alt: 'Иллюстрация анализа ниши и конкурентов',
  },
  {
    number: '02',
    title: 'Создание прототипа и дизайна',
    text: 'Собираем структуру страницы, сценарий блоков и визуальный образ будущего сайта.',
    image: '/images/razrabotka/work-step-02.webp',
    alt: 'Иллюстрация прототипа и дизайна сайта',
  },
  {
    number: '03',
    title: 'Разработка сайта и SEO',
    text: 'Верстаем сайт, подключаем базовую SEO-настройку и готовим проект к запуску.',
    image: '/images/razrabotka/work-step-03.webp',
    alt: 'Иллюстрация разработки сайта и SEO',
  },
]

export function WorkProcessSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' })

  return (
    <section
      ref={sectionRef}
      className={styles.root}
      id="process"
      aria-labelledby="work-process-title"
    >
      <div className={styles.header}>
        <MagneticHeading
          ariaLabel="Как мы работаем"
          className={styles.title}
          darkLens
          id="work-process-title"
          lensSize={180}
        >
          <span>Как мы</span>
          <span className={styles.outlineWord}>работаем</span>
        </MagneticHeading>
      </div>

      <div className={styles.carousel} aria-label="Этапы работы">
        <ol className={styles.steps}>
          {steps.map((step) => (
            <li className={styles.card} key={step.number}>
              <div className={styles.cardTop}>
                <span className={styles.number}>{step.number}</span>
                <Image
                  className={styles.image}
                  src={step.image}
                  alt={step.alt}
                  width={1536}
                  height={1024}
                  sizes="(max-width: 767px) 78vw, 28vw"
                />
              </div>
              <div className={styles.cardText}>
                <h3 className={step.number === '03' ? styles.cardTitlePlain : styles.cardTitle}>
                  {step.title}
                </h3>
                <p className={styles.cardDescription}>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
