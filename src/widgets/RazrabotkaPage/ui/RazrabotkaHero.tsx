'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { StudioButton } from '@/shared/ui'
import styles from './RazrabotkaHero.module.scss'

const MOBILE_QUERY = '(max-width: 767px)'
const DESKTOP_QUERY = '(min-width: 1024px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export function RazrabotkaHero() {
  const visualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const visual = visualRef.current
    if (!visual) return
    if (!window.matchMedia) return

    const mobileQuery = window.matchMedia(MOBILE_QUERY)
    const desktopQuery = window.matchMedia(DESKTOP_QUERY)
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    let frameId = 0

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

    const updateShift = () => {
      frameId = 0

      if (reducedMotionQuery.matches || (!mobileQuery.matches && !desktopQuery.matches)) {
        visual.style.setProperty('--hero-visual-scroll-shift', '0px')
        return
      }

      const rect = visual.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const progress = mobileQuery.matches
        ? clamp((viewportHeight - rect.top) / (viewportHeight * 0.72), 0, 1)
        : clamp(window.scrollY / (viewportHeight * 0.82), 0, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const maxShift = mobileQuery.matches ? -60 : 96
      const shift = maxShift * easedProgress

      visual.style.setProperty('--hero-visual-scroll-shift', `${shift.toFixed(2)}px`)
    }

    const scheduleUpdate = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateShift)
    }

    updateShift()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    mobileQuery.addEventListener('change', scheduleUpdate)
    desktopQuery.addEventListener('change', scheduleUpdate)
    reducedMotionQuery.addEventListener('change', scheduleUpdate)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      mobileQuery.removeEventListener('change', scheduleUpdate)
      desktopQuery.removeEventListener('change', scheduleUpdate)
      reducedMotionQuery.removeEventListener('change', scheduleUpdate)
    }
  }, [])

  return (
    <section className={styles.root} id="top" aria-labelledby="razrabotka-hero-title">
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.kicker}>Разработка лендинга от 5 дней</p>
          <h1
            className={styles.title}
            id="razrabotka-hero-title"
            aria-label="Создаём сайты которые продают"
          >
            <span>Создаём</span>
            <span className={styles.outlineWord}>САЙТЫ</span>
            <span>которые</span>
            <span className={styles.accentWord}>продают</span>
          </h1>
          <p className={styles.text}>
            Если вам нужен результат, а не просто красивый дизайн, то вы по адресу.
          </p>
          <div className={styles.actions} aria-label="Основные действия">
            <StudioButton href="#cta" variant="mint">
              Получить консультацию
            </StudioButton>
            <StudioButton href="#projects" variant="peach">
              Наши работы
            </StudioButton>
          </div>
        </div>

        <div ref={visualRef} className={styles.visual}>
          <Image
            className={styles.image}
            src="/images/razrabotka/hero-new.webp"
            alt="Изометрическая иллюстрация сайта, CRM и аналитики"
            width={1024}
            height={1536}
            priority
            sizes="(max-width: 767px) 108vw, (max-width: 1279px) 56vw, 700px"
          />
        </div>
      </div>
    </section>
  )
}
