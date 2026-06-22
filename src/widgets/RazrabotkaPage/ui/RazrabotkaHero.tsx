'use client'

import type { CSSProperties, PointerEvent } from 'react'
import { useEffect, useRef } from 'react'
import { StudioButton } from '@/shared/ui'
import styles from './RazrabotkaHero.module.scss'

const MOBILE_INTRO_QUERY = '(max-width: 767px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const sphereLetters = Array.from('project 42')
const sphereLetterCount = sphereLetters.length + 1
const sphereMaxShiftX = 16
const sphereMaxShiftY = 12
const sphereMaxTilt = 8

function handleSpherePointerMove(event: PointerEvent<HTMLDivElement>) {
  const bounds = event.currentTarget.getBoundingClientRect()

  if (!bounds.width || !bounds.height) return

  const clientX = Number.isFinite(event.clientX) ? event.clientX : bounds.left + bounds.width / 2
  const clientY = Number.isFinite(event.clientY) ? event.clientY : bounds.top + bounds.height / 2
  const x = ((clientX - bounds.left) / bounds.width - 0.5) * 2
  const y = ((clientY - bounds.top) / bounds.height - 0.5) * 2

  event.currentTarget.style.setProperty('--sphere-shift-x', `${(x * sphereMaxShiftX).toFixed(2)}px`)
  event.currentTarget.style.setProperty('--sphere-shift-y', `${(y * sphereMaxShiftY).toFixed(2)}px`)
  event.currentTarget.style.setProperty('--sphere-tilt-x', `${(-y * sphereMaxTilt).toFixed(2)}deg`)
  event.currentTarget.style.setProperty('--sphere-tilt-y', `${(x * sphereMaxTilt).toFixed(2)}deg`)
}

function handleSpherePointerLeave(event: PointerEvent<HTMLDivElement>) {
  event.currentTarget.style.setProperty('--sphere-shift-x', '0px')
  event.currentTarget.style.setProperty('--sphere-shift-y', '0px')
  event.currentTarget.style.setProperty('--sphere-tilt-x', '0deg')
  event.currentTarget.style.setProperty('--sphere-tilt-y', '0deg')
}

export function RazrabotkaHero() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current

    if (!section || !window.matchMedia) return

    const mobileQuery = window.matchMedia(MOBILE_INTRO_QUERY)
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    let frameId = 0

    const setProgress = (progress: number) => {
      const normalizedProgress = Math.min(Math.max(progress, 0), 1)
      const planetOpacity = Math.max(1 - normalizedProgress * 1.18, 0)
      const contentOpacity = Math.min(Math.max((normalizedProgress - 0.38) * 2.2, 0), 1)
      const contentOffset = (1 - contentOpacity) * 28
      const planetScale = 1 + normalizedProgress * 0.72

      section.style.setProperty('--mobile-intro-progress', normalizedProgress.toFixed(3))
      section.style.setProperty('--mobile-planet-opacity', planetOpacity.toFixed(3))
      section.style.setProperty('--mobile-content-opacity', contentOpacity.toFixed(3))
      section.style.setProperty('--mobile-content-offset', `${contentOffset.toFixed(2)}px`)
      section.style.setProperty('--mobile-planet-scale', planetScale.toFixed(3))
      section.style.setProperty(
        '--mobile-content-pointer-events',
        normalizedProgress > 0.82 ? 'auto' : 'none',
      )
    }

    const updateIntroProgress = () => {
      frameId = 0

      if (!mobileQuery.matches || reducedMotionQuery.matches) {
        setProgress(1)
        return
      }

      const scrollRange = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(-section.getBoundingClientRect().top / scrollRange, 0), 1)

      setProgress(progress)
    }

    const scheduleUpdate = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateIntroProgress)
    }

    updateIntroProgress()
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
      id="top"
      aria-labelledby="razrabotka-hero-title"
    >
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.kicker}>Создание и продвижение</p>
          <h1
            className={styles.title}
            id="razrabotka-hero-title"
            aria-label="Сайты и приложения для бизнеса"
          >
            <span className={styles.outlineWord}>САЙТЫ</span>
            <span className={styles.titleLine}>
              <span className={styles.joinLetter} aria-hidden="true" data-cursor-interactive>
                &
              </span>{' '}
              приложения
            </span>
            <span className={styles.titleLine}>
              для <span className={styles.accentWord}>бизнеса</span>
            </span>
          </h1>
          <p className={styles.text}>
            Если вам нужен результат, а не просто красивый дизайн, то вы по адресу.
          </p>
          <div className={styles.actions} aria-label="Основные действия">
            <StudioButton
              className={`${styles.heroButton} ${styles.heroButtonMint}`}
              href="#cta"
              variant="mint"
            >
              Получить консультацию
            </StudioButton>
            <StudioButton
              className={`${styles.heroButton} ${styles.heroButtonPeach}`}
              href="#projects"
              variant="peach"
            >
              Наши работы
            </StudioButton>
          </div>
        </div>

        <div
          className={styles.visual}
          role="img"
          aria-label="Вращающаяся сфера Project 42"
          onPointerMove={handleSpherePointerMove}
          onPointerLeave={handleSpherePointerLeave}
          data-cursor-interactive
        >
          <div className={styles.sphereStage}>
            <div className={styles.sphereOrbit} aria-hidden="true">
              {sphereLetters.map((letter, index) => (
                <span
                  className={styles.sphereLetter}
                  key={`${letter}-${index}`}
                  style={
                    {
                      '--sphere-index': index / sphereLetterCount,
                    } as CSSProperties
                  }
                >
                  {letter === ' ' ? '\u00a0' : letter}
                </span>
              ))}
            </div>
            <div className={styles.sphereCore} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
