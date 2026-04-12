'use client'

import { useRef } from 'react'
import { Button, Container, StarField } from '@/shared/ui'
import { useScrollReveal } from '@/shared/lib'
import styles from './Hero.module.scss'

type Props = {
  eyebrow?: string
  headingText?: string
  sub?: string
  ctaPrimary?: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
}

export function Hero({
  eyebrow = '— Project 42',
  headingText,
  sub = 'Налаженные AI-процессы и профи, которые знают, как создавать и продвигать качественные сайты.',
  ctaPrimary = { label: 'Обсудить проект', href: '#cta' },
  ctaSecondary = { label: 'Посмотреть работы', href: '#portfolio' },
}: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  useScrollReveal(sectionRef, { threshold: 0.1 })

  return (
    <section ref={sectionRef} className={styles.root} id="hero">
      <StarField />
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />
      <div className={styles.blob3} aria-hidden="true" />
      <Container className={styles.inner}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1 className={styles.heading}>
          {headingText ?? (
            <>
              Результат быстрее, ценник ниже, качество выше —
              <span className={styles.aiLabel}>AI-студия</span>
              &nbsp;полного цикла
            </>
          )}
        </h1>
        <p className={styles.sub}>{sub}</p>
        <div className={styles.actions}>
          <Button size="lg" href={ctaPrimary.href}>
            {ctaPrimary.label}
          </Button>
          {ctaSecondary && (
            <Button size="lg" variant="ghost" href={ctaSecondary.href}>
              {ctaSecondary.label}
            </Button>
          )}
        </div>
      </Container>
    </section>
  )
}
