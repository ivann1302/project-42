'use client'

import { useEffect, useRef } from 'react'
import { Icon, MagneticHeading } from '@/shared/ui'
import styles from './page.module.scss'

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function HomeHero() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      root.style.setProperty('--hero-progress', '0')
      return
    }

    let frame = 0

    const updateProgress = () => {
      frame = 0
      const rect = root.getBoundingClientRect()
      const distance = Math.max(1, rect.height - window.innerHeight)
      const progress = clamp(-rect.top / distance, 0, 1)
      root.style.setProperty('--hero-progress', progress.toFixed(4))
    }

    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [])

  return (
    <div className={styles.heroScroll} ref={rootRef}>
      <section className={styles.hero} aria-labelledby="home-hero-title">
        <div className={styles.heroInner}>
          <p className={styles.heroKicker}>Создание и продвижение</p>
          <MagneticHeading as="h1" className={styles.title} id="home-hero-title" lensSize={180}>
            <span className={styles.titleWord}>Project</span>
            <span className={styles.titleNumber}>42</span>
          </MagneticHeading>
          <p className={styles.subtitle}>Сайты и приложения для бизнеса</p>
          <div className={styles.heroOrnaments} aria-hidden="true">
            <span
              className={`${styles.heroOrnament} ${styles.ornamentDevelopment}`}
              data-cursor-interactive
            >
              <span className={styles.ornamentFloat}>
                <Icon name="code" size={54} />
              </span>
            </span>
            <span
              className={`${styles.heroOrnament} ${styles.ornamentPromotion}`}
              data-cursor-interactive
            >
              <span className={styles.ornamentFloat}>
                <Icon name="zap" size={62} />
              </span>
            </span>
            <span
              className={`${styles.heroOrnament} ${styles.ornamentGrowth}`}
              data-cursor-interactive
            >
              <span className={styles.ornamentFloat}>
                <Icon name="trendUp" size={64} />
              </span>
            </span>
            <span
              className={`${styles.heroOrnament} ${styles.ornamentDesign}`}
              data-cursor-interactive
            >
              <span className={styles.ornamentFloat}>
                <Icon name="star" size={60} />
              </span>
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
