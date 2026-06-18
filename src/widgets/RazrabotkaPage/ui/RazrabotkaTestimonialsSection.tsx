'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useScrollReveal } from '@/shared/lib'
import styles from './RazrabotkaTestimonialsSection.module.scss'

const VISIBLE_DESKTOP_CARDS = 4

const testimonials = [
  {
    company: 'TrueTell',
    name: 'Роман',
    project: 'Лендинг для подписки',
    photo: '/images/razrabotka/testimonials/truetell.webp',
    text: 'Нужно было быстро и понятно объяснить, зачем бизнесу наша подписка. Лендинг стал хорошей точкой входа для переговоров и помог привлечь несколько крупных клиентов.',
  },
  {
    company: 'AKS-FIT',
    name: 'Татьяна',
    project: 'Промо-сайт проекта',
    photo: '/images/razrabotka/testimonials/aks-fit.webp',
    text: 'Собрали промо-сайт для моей концепции. Теперь я с удовольствием показываю его клиентам: проект выглядит цельно, аккуратно и без лишней сложности.',
  },
  {
    company: 'Tutor Online',
    name: 'Ирина',
    project: 'Онлайн-школа для младших классов',
    photo: '/images/razrabotka/testimonials/tutor-online.webp',
    text: 'Хотелось простую страницу, которую можно отправлять родителям в переписке. Получилось понятно объяснить формат занятий и показать пользу для младших школьников.',
  },
  {
    company: 'Красим.ру',
    name: 'Никита',
    project: 'Лендинг и реклама',
    photo: '/images/razrabotka/testimonials/krasimru.webp',
    text: 'Сделали лендинг и настроили рекламу под него. Пошел стабильный поток обращений, а стоимость лида стала ниже и понятнее для контроля.',
  },
  {
    company: 'ROSA',
    name: 'Олег',
    project: 'Корпоративный сайт, SEO и GEO',
    photo: '/images/razrabotka/testimonials/rosa.webp',
    text: 'Корпоративный сайт добавил компании презентабельности и стал нормальной точкой приема заявок. Нам настроили заявки через Telegram-бота, а после SEO и GEO на сайт пошел поток клиентов, включая первые обращения из ChatGPT.',
  },
]

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
          <p className={styles.kicker}>Говорят клиенты</p>
          <h2 className={styles.title} id="razrabotka-testimonials-title">
            <span>Отзывы</span>
            <span className={styles.outlineWord}>клиентов</span>
          </h2>
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
                      {testimonial.photo ? (
                        <Image
                          className={styles.avatarImage}
                          src={testimonial.photo}
                          alt=""
                          width={112}
                          height={112}
                          sizes="58px"
                        />
                      ) : (
                        <span className={styles.avatarInitial}>{testimonial.name[0]}</span>
                      )}
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
