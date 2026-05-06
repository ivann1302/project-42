import type { CSSProperties } from 'react'
import { Container, ScrollReveal, SectionTitle, StarField } from '@/shared/ui'
import styles from './WhatWeDontDo.module.scss'

const items = [
  {
    title: 'Честные сроки.',
    body: 'Заранее проговариваем все нюансы и подводные камни — без сюрпризов в процессе.',
  },
  {
    title: 'Прозрачное ценообразование.',
    body: 'Только то, что реально нужно вашему бизнесу, без навязанных услуг.',
  },
  {
    title: 'Дизайн работает на результат.',
    body: 'Сайт должен быть полезен и пользователю, и владельцу бизнеса.',
  },
  {
    title: 'Белое SEO.',
    body: 'Строим надёжный фундамент для долгосрочного роста — без накруток и серых схем.',
  },
]

export function WhatWeDontDo() {
  return (
    <section className={styles.root} id="what-we-dont-do">
      <StarField />
      <Container>
        <SectionTitle eyebrow="Честность" align="center">
          Наши принципы
        </SectionTitle>
        <ScrollReveal as="ul" className={styles.list} role="list" threshold={0.1}>
          {items.map((item, idx) => (
            <li key={item.title} className={styles.item} style={{ '--i': idx } as CSSProperties}>
              <span className={styles.icon} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <p className={styles.text}>
                <strong className={styles.textTitle}>{item.title}</strong> {item.body}
              </p>
            </li>
          ))}
        </ScrollReveal>
      </Container>
    </section>
  )
}
