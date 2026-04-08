'use client'

import { useState } from 'react'
import { Container, Icon, SectionTitle, StarField } from '@/shared/ui'
import { faqItems } from '@/entities/FaqItem'
import styles from './Faq.module.scss'

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className={styles.root} id="faq">
      <StarField />
      <Container>
        <SectionTitle eyebrow="Частые вопросы" align="center">
          Ответы на вопросы
        </SectionTitle>
        <ul className={styles.list} role="list">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index
            const answerId = `faq-answer-${item.id}`
            const triggerId = `faq-trigger-${item.id}`
            return (
              <li key={item.id} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
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
