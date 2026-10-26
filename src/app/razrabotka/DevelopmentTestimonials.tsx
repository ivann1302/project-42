'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { developmentReviews } from '@/entities/Testimonial/model/developmentReviews'
import { DevelopmentRevealText } from './DevelopmentRevealText'
import styles from './DevelopmentTestimonials.module.scss'

type DevelopmentReview = (typeof developmentReviews)[number]

function ReviewCard({ review }: { review: DevelopmentReview }) {
  return (
    <li className={styles.card}>
      <div className={styles.author}>
        <Image
          className={styles.avatar}
          src={review.photo}
          alt=""
          width={112}
          height={112}
          sizes="56px"
        />
        <div>
          <p className={styles.name}>{review.name}</p>
          <p className={styles.project}>
            {review.company} / {review.project}
          </p>
        </div>
      </div>
      <blockquote className={styles.quote}>{review.text}</blockquote>
    </li>
  )
}

export function DevelopmentTestimonials() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const firstGroupRef = useRef<HTMLOListElement>(null)
  const cloneRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const viewport = viewportRef.current
    const firstGroup = firstGroupRef.current
    const clone = cloneRef.current
    if (!viewport || !firstGroup || !clone) return

    const mobile = window.matchMedia('(max-width: 767px)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    let running = false
    let frame = 0
    let lastFrame = 0
    let pointerDown = false
    let pausedUntil = 0

    const tick = (now: number) => {
      const elapsed = lastFrame ? Math.min(now - lastFrame, 50) : 0
      lastFrame = now

      if (!pointerDown && now >= pausedUntil) {
        const cycleWidth = clone.offsetLeft - firstGroup.offsetLeft
        if (cycleWidth > 0) {
          const nextLeft = viewport.scrollLeft + elapsed * 0.04
          viewport.scrollLeft = nextLeft >= cycleWidth ? nextLeft - cycleWidth : nextLeft
        }
      }

      if (running) frame = window.requestAnimationFrame(tick)
    }

    const updateMotion = () => {
      const shouldRun = visible && mobile.matches && !reducedMotion.matches
      if (shouldRun && !running) {
        running = true
        lastFrame = 0
        frame = window.requestAnimationFrame(tick)
      } else if (!shouldRun && running) {
        running = false
        window.cancelAnimationFrame(frame)
      }

      if (!mobile.matches || reducedMotion.matches) viewport.scrollLeft = 0
    }

    const onPointerDown = () => {
      pointerDown = true
    }
    const onPointerUp = () => {
      pointerDown = false
      pausedUntil = performance.now() + 2500
    }

    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('pointerup', onPointerUp)
    viewport.addEventListener('pointercancel', onPointerUp)
    mobile.addEventListener('change', updateMotion)
    reducedMotion.addEventListener('change', updateMotion)

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      updateMotion()
    })
    observer.observe(viewport)

    return () => {
      running = false
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('pointerup', onPointerUp)
      viewport.removeEventListener('pointercancel', onPointerUp)
      mobile.removeEventListener('change', updateMotion)
      reducedMotion.removeEventListener('change', updateMotion)
    }
  }, [])

  return (
    <section className={styles.root} id="reviews" aria-labelledby="development-reviews-title">
      <div className={styles.heading}>
        <h2 id="development-reviews-title">
          <DevelopmentRevealText>Отзывы клиентов</DevelopmentRevealText>
        </h2>
        <p className={styles.description} data-development-reveal="rise" data-development-order="1">
          Что говорят о сайтах те, для кого мы их сделали.
        </p>
      </div>

      <div className={styles.marquee} data-development-reveal="rise" data-development-order="1">
        <div
          className={styles.viewport}
          role="group"
          aria-label="Лента отзывов"
          tabIndex={0}
          ref={viewportRef}
        >
          <div className={styles.track}>
            <ol className={styles.group} ref={firstGroupRef}>
              {developmentReviews.map((review) => (
                <ReviewCard review={review} key={review.company} />
              ))}
            </ol>
            <ol className={`${styles.group} ${styles.clone}`} aria-hidden="true" ref={cloneRef}>
              {developmentReviews.map((review) => (
                <ReviewCard review={review} key={review.company} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
