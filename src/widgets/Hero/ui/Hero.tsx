'use client'

import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import clsx from 'clsx'
import { Button, Container, Modal, StarField } from '@/shared/ui'
import { ContactForm } from '@/features/ContactForm'
import { useScrollReveal } from '@/shared/lib'
import styles from './Hero.module.scss'

type Props = {
  eyebrow?: string
  headingText?: string
  gradientSubheading?: string
  gradientSubheadingSecondary?: string
  sub?: string
  ctaPrimary?: { label: string; href: string; opensForm?: boolean }
  ctaSecondary?: { label: string; href: string }
  visual?: ReactNode
}

function renderGradientMetric(text: string) {
  const parts = text.match(/^(.*?)(\d[\d\s]*)(.*)$/)

  if (!parts) {
    return text
  }

  return (
    <>
      <span>{parts[1]}</span>
      <span className={styles.gradientNumber}>{parts[2]}</span>
      <span>{parts[3]}</span>
    </>
  )
}

export function Hero({
  eyebrow = '— Project 42',
  headingText,
  gradientSubheading,
  gradientSubheadingSecondary,
  sub = 'Налаженные AI-процессы и профи, которые знают, как создавать и продвигать качественные сайты.',
  ctaPrimary = { label: 'Обсудить проект', href: '#cta' },
  ctaSecondary = { label: 'Посмотреть работы', href: '#portfolio' },
  visual,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const [contactOpen, setContactOpen] = useState(false)
  const primaryOpensContactForm =
    ctaPrimary.opensForm ?? ctaPrimary.label.trim() === 'Обсудить проект'
  useScrollReveal(sectionRef, { threshold: 0.1 })

  return (
    <>
      <section ref={sectionRef} className={styles.root} id="hero">
        <StarField />
        <div className={styles.blob1} aria-hidden="true" />
        <div className={styles.blob2} aria-hidden="true" />
        <div className={styles.blob3} aria-hidden="true" />
        <Container className={clsx(styles.inner, visual && styles.withVisual)}>
          <div className={styles.content}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h1 className={styles.heading}>
              {headingText ?? (
                <>
                  Быстрее запуск, меньше издержек
                  <br />
                  <span className={styles.aiLabel}>AI-студия</span>
                  &nbsp;полного цикла
                </>
              )}
            </h1>
            <p className={styles.sub}>{sub}</p>
            {(gradientSubheading || gradientSubheadingSecondary) && (
              <div className={styles.gradientSubheadingGroup}>
                {gradientSubheading && (
                  <h2 className={styles.gradientSubheading}>
                    {renderGradientMetric(gradientSubheading)}
                  </h2>
                )}
                {gradientSubheadingSecondary && (
                  <p
                    className={clsx(styles.gradientSubheading, styles.gradientSubheadingSecondary)}
                  >
                    {renderGradientMetric(gradientSubheadingSecondary)}
                  </p>
                )}
              </div>
            )}
            <div className={styles.actions}>
              {primaryOpensContactForm ? (
                <Button size="lg" onClick={() => setContactOpen(true)}>
                  {ctaPrimary.label}
                </Button>
              ) : (
                <Button size="lg" href={ctaPrimary.href}>
                  {ctaPrimary.label}
                </Button>
              )}
              {ctaSecondary && (
                <Button size="lg" variant="ghost" href={ctaSecondary.href}>
                  {ctaSecondary.label}
                </Button>
              )}
            </div>
          </div>
          {visual && <div className={styles.visual}>{visual}</div>}
        </Container>
      </section>

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title="Обсудить проект">
        <ContactForm onSuccess={() => setContactOpen(false)} />
      </Modal>
    </>
  )
}
