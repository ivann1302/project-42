'use client'

import { useRef, useState } from 'react'
import { Container, Icon, SectionTitle, StarField } from '@/shared/ui'
import { useScrollReveal } from '@/shared/lib'
import { faqItems as defaultFaqItems } from '@/entities/FaqItem'
import type { FaqItem } from '@/entities/FaqItem'
import styles from './Faq.module.scss'

type Props = {
  items?: FaqItem[]
  eyebrow?: string
  title?: string
}

export function Faq({
  items = defaultFaqItems,
  eyebrow = 'Частые вопросы',
  title = 'Ответы на вопросы',
}: Props) {
  const listRef = useRef<HTMLUListElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useScrollReveal(listRef, { threshold: 0.1 })

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className={styles.root} id="faq">
      <StarField />
      <Container>
        <SectionTitle eyebrow={eyebrow} align="center">
          {title}
        </SectionTitle>
        <ul ref={listRef} className={styles.list} role="list">
          {items.map((item, index) => {
            const isOpen = openIndex === index
            const answerId = `faq-answer-${item.id}`
            const triggerId = `faq-trigger-${item.id}`
            return (
              <li
                key={item.id}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
                style={{ '--i': index } as React.CSSProperties}
              >
                <button
                  id={triggerId}
                  className={styles.trigger}
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                >
                  <span className={styles.number} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.question}>{item.question}</span>
                  <span className={styles.icon} aria-hidden="true">
                    <Icon name="chevronDown" size={20} />
                  </span>
                </button>
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={triggerId}
                  className={styles.body}
                >
                  <div className={styles.bodyInner}>
                    <p className={styles.answer}>{item.answer}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
