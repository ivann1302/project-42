'use client'

import { useEffect, useRef } from 'react'
import { useScrollReveal } from '@/shared/lib'
import styles from './CompetitorChoiceSection.module.scss'

const decisionSignals = [
  'Чёткий оффер',
  'Современный дизайн',
  'Кейсы с результатом',
  'Понятный следующий шаг',
] as const

const MOBILE_QUERY = '(max-width: 767px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export function CompetitorChoiceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const supportRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' })
  useScrollReveal(supportRef, { threshold: 0.32, rootMargin: '0px 0px -6% 0px' })

  useEffect(() => {
    const section = sectionRef.current
    const support = supportRef.current
    const text = textRef.current
    if (!section || !support || !text) return

    if (!window.matchMedia) {
      section.style.setProperty('--support-text-scroll-y', '0px')
      section.style.setProperty('--support-accent-progress', '1')
      return
    }

    const mobileQuery = window.matchMedia(MOBILE_QUERY)
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    let frameId = 0

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

    const updateTextMotion = () => {
      frameId = 0

      if (reducedMotionQuery.matches) {
        section.style.setProperty('--support-text-scroll-y', '0px')
        section.style.setProperty('--support-accent-progress', '1')
        return
      }

      const rect = support.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const start = viewportHeight * 0.92
      const end = viewportHeight * 0.28
      const progress = clamp((start - rect.top) / (start - end), 0, 1)
      const desktopShift = Math.max(112, support.offsetHeight - text.offsetHeight)
      const maxShift = mobileQuery.matches ? 52 : window.innerWidth >= 1024 ? desktopShift : 112
      const colorProgress = clamp(progress / 0.25, 0, 1)

      section.style.setProperty('--support-text-scroll-y', `${(maxShift * progress).toFixed(2)}px`)
      section.style.setProperty('--support-accent-progress', colorProgress.toFixed(2))
    }

    const scheduleUpdate = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateTextMotion)
    }

    updateTextMotion()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    mobileQuery.addEventListener('change', scheduleUpdate)
    reducedMotionQuery.addEventListener('change', scheduleUpdate)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      mobileQuery.removeEventListener('change', scheduleUpdate)
      reducedMotionQuery.removeEventListener('change', scheduleUpdate)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={styles.root}
      id="competitor-choice"
      aria-labelledby="competitor-choice-title"
    >
      <div className={styles.inner}>
        <h2
          className={styles.title}
          id="competitor-choice-title"
          aria-label="Что, если вы лучше конкурента, а клиент всё равно выбирает его?"
        >
          <span className={styles.titleLine}>Что, если вы</span>
          <span className={`${styles.titleLine} ${styles.accentLine}`}>лучше конкурента,</span>
          <span className={styles.titleLine}>а клиент всё равно</span>
          <span className={`${styles.titleLine} ${styles.outlineLine}`}>выбирает его?</span>
        </h2>

        <div ref={supportRef} className={styles.support}>
          <div className={styles.textTrack}>
            <p ref={textRef} className={styles.text}>
              Потому что <span className={styles.scrollAccent}>клиент оценивает</span> не весь ваш
              опыт — только <span className={styles.scrollAccent}>то, что успел увидеть</span>.
            </p>
          </div>

          <ul className={styles.signals} aria-label="Что помогает клиенту принять решение">
            {decisionSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>

          <p className={styles.conclusion}>
            <span>Хороший сайт</span> показывает ваш уровень ещё до первого разговора.
          </p>
        </div>
      </div>
    </section>
  )
}
