'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { developmentReviews } from '@/entities/Testimonial/model/developmentReviews'
import { useScrollReveal } from '@/shared/lib'
import { MagneticHeading } from '@/shared/ui'
import styles from './RazrabotkaTestimonialsSection.module.scss'

const VISIBLE_DESKTOP_CARDS = 4

const testimonials = developmentReviews

export function RazrabotkaTestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const maxIndex = Math.max(testimonials.length - VISIBLE_DESKTOP_CARDS, 0)

  useScrollReveal(sectionRef, { threshold: 0.16, rootMargin: '0px 0px -10% 0px' })

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const carousel = carouselRef.current
    const target = carousel?.querySelector<HTMLElement>(`[data-testimonial-index="${index}"]`)

    if (!carousel || !target) return

    const carouselRect = carousel.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const nextLeft = carousel.scrollLeft + targetRect.left - carouselRect.left

    carousel.scrollTo({ left: nextLeft, behavior })
  }, [])

  const syncActiveIndex = useCallback(() => {
    const carousel = carouselRef.current
    const cards = Array.from(
      carousel?.querySelectorAll<HTMLElement>('[data-testimonial-index]') ?? [],
    )

    if (!carousel || cards.length === 0) return

    const carouselRect = carousel.getBoundingClientRect()
    const nearestIndex = cards.reduce((closestIndex, card, index) => {
      const currentCard = cards[closestIndex]
      const currentDistance = Math.abs(currentCard.getBoundingClientRect().left - carouselRect.left)
      const nextDistance = Math.abs(card.getBoundingClientRect().left - carouselRect.left)

      return nextDistance < currentDistance ? index : closestIndex
    }, 0)

    setActiveIndex(Math.min(nearestIndex, maxIndex))
  }, [maxIndex])

  const moveCarousel = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((currentIndex) => {
        let nextIndex = currentIndex + direction

        if (nextIndex > maxIndex) nextIndex = 0
        if (nextIndex < 0) nextIndex = maxIndex

        scrollToIndex(nextIndex)
        return nextIndex
      })
    },
    [maxIndex, scrollToIndex],
  )

  useEffect(() => {
    const handleResize = () => scrollToIndex(activeIndex, 'auto')

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [activeIndex, scrollToIndex])

  return (
    <section
      ref={sectionRef}
      className={styles.root}
      aria-labelledby="razrabotka-testimonials-title"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.kicker}>Убедитесь сами</p>
          <MagneticHeading
            ariaLabel="Отзывы клиентов"
            className={styles.title}
            darkLens
            id="razrabotka-testimonials-title"
            lensSize={180}
          >
            <span>Отзывы</span>
            <span className={styles.outlineWord}>клиентов</span>
          </MagneticHeading>
        </div>

        <div className={styles.carouselShell}>
          <div
            ref={carouselRef}
            className={styles.carousel}
            aria-label="Карусель отзывов"
            onScroll={syncActiveIndex}
          >
            <ol className={styles.list}>
              {testimonials.map((testimonial, index) => (
                <li
                  className={styles.card}
                  data-testimonial-index={index}
                  key={`${testimonial.company}-${testimonial.name}`}
                >
                  <div className={styles.cardHeader}>
                    <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.avatarSlot} aria-hidden="true">
                      <Image
                        className={styles.avatarImage}
                        src={testimonial.photo}
                        alt=""
                        width={112}
                        height={112}
                        sizes="58px"
                      />
                    </span>
                  </div>
                  <blockquote className={styles.quote}>{testimonial.text}</blockquote>
                  <div className={styles.author}>
                    <p className={styles.company}>{testimonial.company}</p>
                    <p className={styles.meta}>
                      {testimonial.name} / {testimonial.project}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {maxIndex > 0 && (
            <div className={styles.controls} aria-label="Навигация по отзывам">
              <button
                type="button"
                className={styles.control}
                aria-label="Предыдущие отзывы"
                onClick={() => moveCarousel(-1)}
              >
                <span
                  className={`${styles.controlIcon} ${styles.controlIconPrevious}`}
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                className={styles.control}
                aria-label="Следующие отзывы"
                onClick={() => moveCarousel(1)}
              >
                <span
                  className={`${styles.controlIcon} ${styles.controlIconNext}`}
                  aria-hidden="true"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
