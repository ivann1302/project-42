'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useScrollReveal } from '@/shared/lib'
import { MagneticHeading } from '@/shared/ui'
import styles from './RazrabotkaServicesCarouselSection.module.scss'

const VISIBLE_DESKTOP_CARDS = 4

const services = [
  {
    title: 'Разработка лендинга',
    price: 'от 15 тыс',
    description: 'Одностраничный сайт под рекламу, запуск продукта или быстрый сбор заявок.',
    image: '/images/razrabotka/services/service-01.webp',
  },
  {
    title: 'Разработка сайта-визитки',
    price: 'от 25 тыс',
    description: 'Структура на 3-5 страниц: услуги, о компании, кейсы, контакты и заявка.',
    image: '/images/razrabotka/services/service-02.webp',
  },
  {
    title: 'Разработка корпоративного сайта',
    price: 'от 40 тыс',
    description: '8-15 страниц, базовая SEO-подготовка и понятная архитектура под рост.',
    image: '/images/razrabotka/services/service-03.webp',
  },
  {
    title: 'Разработка интернет-магазина',
    price: 'от 70 тыс',
    description: 'Каталог, карточки товаров, корзина и сценарий покупки без лишних шагов.',
    image: '/images/razrabotka/services/service-04.webp',
  },
  {
    title: 'Разработка Telegram-бота',
    price: 'от 25 тыс',
    description: 'Автоматизация заявок, консультаций, рассылок и внутренних процессов.',
    image: '/images/razrabotka/services/service-05.webp',
  },
  {
    title: 'Разработка мобильного приложения',
    price: 'от 100 тыс',
    description: 'Проектирование и разработка MVP для iOS, Android или PWA-формата.',
    image: '/images/razrabotka/services/service-06.webp',
  },
  {
    title: 'SEO и продвижение в ИИ',
    price: 'от 20 тыс',
    description: 'Рост в поиске и подготовка контента к попаданию в ответы нейросетей.',
    image: '/images/razrabotka/services/service-07.webp',
  },
  {
    title: 'Настройка и ведение рекламы в Яндекс.Директ',
    price: 'от 20 тыс',
    description:
      'Запускаем и оптимизируем рекламные кампании под заявки, продажи и понятную аналитику.',
    image: '/images/razrabotka/services/service-08.webp',
  },
]

export function RazrabotkaServicesCarouselSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const maxIndex = Math.max(services.length - VISIBLE_DESKTOP_CARDS, 0)

  useScrollReveal(sectionRef, { threshold: 0.16, rootMargin: '0px 0px -10% 0px' })

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const carousel = carouselRef.current
    const target = carousel?.querySelector<HTMLElement>(`[data-service-index="${index}"]`)

    if (!carousel || !target) return

    const carouselRect = carousel.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const nextLeft = carousel.scrollLeft + targetRect.left - carouselRect.left

    carousel.scrollTo({ left: nextLeft, behavior })
  }, [])

  const syncActiveIndex = useCallback(() => {
    const carousel = carouselRef.current
    const cards = Array.from(carousel?.querySelectorAll<HTMLElement>('[data-service-index]') ?? [])

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
    <section ref={sectionRef} className={styles.root} aria-labelledby="razrabotka-services-title">
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.kicker}>Что можно заказать</p>
          <MagneticHeading
            ariaLabel="Наши услуги"
            className={styles.title}
            darkLens
            id="razrabotka-services-title"
            lensSize={180}
          >
            <span>Наши</span>
            <span className={styles.outlineWord}>услуги</span>
          </MagneticHeading>
        </div>

        <div className={styles.carouselShell}>
          <div
            ref={carouselRef}
            className={styles.carousel}
            aria-label="Карусель услуг"
            onScroll={syncActiveIndex}
          >
            <ol className={styles.list}>
              {services.map((service, index) => (
                <li
                  className={styles.card}
                  data-service-index={index}
                  key={service.title}
                  aria-label={`${service.title}, ${service.price}`}
                >
                  <div className={styles.cardVisual} aria-hidden="true">
                    <Image
                      className={styles.image}
                      src={service.image}
                      alt=""
                      width={1536}
                      height={1024}
                      sizes="(max-width: 767px) 76vw, (max-width: 1023px) 40vw, 20vw"
                    />
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                    <h3 className={styles.cardTitle}>{service.title}</h3>
                    <p className={styles.description}>{service.description}</p>
                    <p className={styles.price}>{service.price}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {maxIndex > 0 && (
            <div className={styles.controls} aria-label="Навигация по услугам">
              <button
                type="button"
                className={styles.control}
                aria-label="Предыдущие услуги"
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
                aria-label="Следующие услуги"
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
