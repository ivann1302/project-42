'use client'

import { useEffect, useRef } from 'react'
import { MagneticHeading } from '@/shared/ui'
import styles from './page.module.scss'

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function HomeTrust() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      root.style.setProperty('--trust-progress', '0')
      return
    }

    let frame = 0

    const updateProgress = () => {
      frame = 0
      const rect = root.getBoundingClientRect()
      const distance = Math.max(1, rect.height - window.innerHeight)
      const progress = clamp(-rect.top / distance, 0, 1)
      root.style.setProperty('--trust-progress', progress.toFixed(4))
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
    <div className={styles.trustScroll} ref={rootRef}>
      <section className={styles.trustSection} aria-labelledby="home-trust-title">
        <div className={styles.trustInner}>
          <MagneticHeading className={styles.trustTitle} id="home-trust-title" lensSize={170}>
            Нам <span className={styles.trustAccent}>можно доверить</span> задачу любой сложности
          </MagneticHeading>
        </div>
      </section>
    </div>
  )
}
