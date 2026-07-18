'use client'

import clsx from 'clsx'
import { type CSSProperties, useRef, useState } from 'react'
import { useScrollReveal } from '@/shared/lib'
import { NoBuilderNote } from './NoBuilderNote'
import styles from './WhatYouGetSection.module.scss'

const results = [
  {
    title: 'Современный сайт',
    text: 'Уникальный дизайн с учётом анализа ниши, конкурентов и целевой аудитории.',
  },
  {
    title: 'Под ваши цели',
    text: 'Конверсия для рекламы, презентация компании или понятное описание услуги.',
  },
  {
    title: 'Мобильная версия',
    text: 'Входит в стоимость по умолчанию — значительная часть аудитории приходит со смартфонов.',
  },
  {
    title: 'SEO и продвижение в ИИ',
    text: 'Подготовим сайт к продвижению в Google и Яндексе и к появлению в ответах ChatGPT, DeepSeek и Алисы AI.',
  },
  {
    title: 'CRM и Telegram',
    text: 'Интеграция с любой CRM-системой или Telegram-ботом.',
  },
  {
    title: 'Контент без программиста',
    text: 'Тексты, цены, услуги и изображения можно менять самостоятельно.',
  },
  {
    title: 'Гарантия 1 год',
    text: 'Исправим технические баги, если они появятся в течение года после запуска.',
  },
  {
    title: 'Партнёр на будущее',
    text: 'Поддержим и продолжим развивать проект после запуска.',
  },
  {
    title: 'Скидка 25%',
    text: 'На SEO-продвижение, продвижение в ИИ и настройку рекламы при заказе сайта у нас.',
  },
] as const

export function WhatYouGetSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeResult, setActiveResult] = useState(3)

  useScrollReveal(sectionRef, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

  return (
    <section
      ref={sectionRef}
      className={styles.root}
      id="results"
      aria-labelledby="what-you-get-title"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Результат разработки</p>
          <h2 className={styles.title} id="what-you-get-title">
            <span>Что вы</span>
            <span>получаете?</span>
          </h2>
          <p className={styles.intro}>
            Девять конкретных результатов, которые даёт вам сайт от Project 42.
          </p>
        </header>

        <div className={styles.rightColumn}>
          <ol className={styles.results}>
            {results.map((result, index) => {
              const number = String(index + 1).padStart(2, '0')
              const isDiscount = index === results.length - 1

              return (
                <li
                  className={styles.resultItem}
                  key={result.title}
                  style={{ '--result-index': index } as CSSProperties}
                >
                  <button
                    className={clsx(
                      styles.resultButton,
                      activeResult === index && styles.active,
                      isDiscount && styles.discount,
                    )}
                    type="button"
                    aria-pressed={activeResult === index}
                    onClick={() => setActiveResult(index)}
                    onFocus={() => setActiveResult(index)}
                    onPointerEnter={() => setActiveResult(index)}
                  >
                    <span className={styles.number} aria-hidden="true">
                      {number}
                    </span>
                    <span className={styles.divider} aria-hidden="true" />
                    <span className={styles.copy}>
                      <span className={styles.resultTitle}>{result.title}</span>
                      <span className={styles.resultText}>{result.text}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
          <NoBuilderNote />
        </div>
      </div>
    </section>
  )
}
