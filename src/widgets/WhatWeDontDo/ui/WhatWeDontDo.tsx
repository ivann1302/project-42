'use client'

import { useEffect, useRef } from 'react'
import { Container, SectionTitle, StarField } from '@/shared/ui'
import styles from './WhatWeDontDo.module.scss'

const items = [
  'Не даём ложных обещаний по срокам.Заранее проговарим с Вами все сроки, ньансы и подводные камни в разработке',
  'Не навешываем дополнительные ненужные вашему бизнесу услуги. У нас максимально прозрачное ценообразование',
  'Не ставим дизайн в противовес эффективности сайта.  Мы твердно убеждены, что сайт должен быть полезен как для пользователя, так и для его владельца',
  'Не накручиваем поведенческие факторы в SEO.Да, это не даст эффект в течение 1–2 дней. Однако используя наш подход вы получите надёжный фундамент для дальнейшего развития бизнеса',
]

export function WhatWeDontDo() {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = listRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.visible)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.root} id="what-we-dont-do">
      <StarField />
      <Container>
        <SectionTitle eyebrow="Честность" align="center">
          Что мы не делаем
        </SectionTitle>
        <ul ref={listRef} className={styles.list} role="list">
          {items.map((item, idx) => (
            <li key={item} className={styles.item} style={{ '--i': idx } as React.CSSProperties}>
              <span className={styles.icon} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M18 6L6 18M6 6l12 12"
                  />
                </svg>
              </span>
              <p className={styles.text}>{item}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
