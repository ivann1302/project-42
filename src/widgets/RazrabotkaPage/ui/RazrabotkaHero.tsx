'use client'

import type { CSSProperties, PointerEvent } from 'react'
import { MagneticHeading, StudioButton } from '@/shared/ui'
import styles from './RazrabotkaHero.module.scss'

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
  return (
    <section className={styles.root} id="top" aria-labelledby="razrabotka-hero-title">
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.kicker}>Создание и продвижение</p>
          <MagneticHeading
            as="h1"
            ariaLabel="Сайты и приложения для бизнеса"
            className={styles.title}
            id="razrabotka-hero-title"
            lensSize={180}
            whiteLens
          >
            <span className={styles.outlineWord}>САЙТЫ</span>
            <span className={styles.titleLine}>
              <span className={styles.joinLetter} aria-hidden="true" data-cursor-interactive>
                <span className={styles.joinCube}>
                  <span className={`${styles.joinCubeFace} ${styles.joinCubeFaceFront}`}>&</span>
                  <span className={`${styles.joinCubeFace} ${styles.joinCubeFaceBack}`}>&</span>
                  <span className={`${styles.joinCubeFace} ${styles.joinCubeFaceRight}`}>&</span>
                  <span className={`${styles.joinCubeFace} ${styles.joinCubeFaceLeft}`}>&</span>
                  <span className={`${styles.joinCubeFace} ${styles.joinCubeFaceTop}`}>&</span>
                  <span className={`${styles.joinCubeFace} ${styles.joinCubeFaceBottom}`}>&</span>
                </span>
              </span>{' '}
              приложения
            </span>
            <span className={styles.titleLine}>
              для <span className={styles.accentWord}>бизнеса</span>
            </span>
          </MagneticHeading>
          <p className={styles.text}>
            Если вам нужен результат, а не просто красивый дизайн, то вы по адресу.
          </p>
          <div className={styles.actions} aria-label="Основные действия">
            <StudioButton className={styles.heroButton} href="#cta" variant="mint">
              Получить консультацию
            </StudioButton>
            <StudioButton className={styles.heroButton} href="#projects" variant="peach">
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
