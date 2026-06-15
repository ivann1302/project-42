'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styles from './WhatWeDoSection.module.scss'

const MOBILE_QUERY = '(max-width: 767px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export function WhatWeDoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const priceCardRef = useRef<HTMLElement>(null)
  const imageVisibleRef = useRef(false)
  const [imageVisible, setImageVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const priceCard = priceCardRef.current
    if (!section || !priceCard) return

    if (!window.matchMedia) {
      setImageVisible(true)
      return
    }

    const mobileQuery = window.matchMedia(MOBILE_QUERY)
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    let frameId = 0

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

    const syncVisibleState = (nextVisible: boolean) => {
      if (imageVisibleRef.current === nextVisible) return
      imageVisibleRef.current = nextVisible
      setImageVisible(nextVisible)
    }

    const updateImageMotion = () => {
      frameId = 0

      if (reducedMotionQuery.matches) {
        section.style.setProperty('--price-image-opacity', '0.86')
        section.style.setProperty('--price-image-scroll-x', '0px')
        syncVisibleState(true)
        return
      }

      const rect = priceCard.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const start = viewportHeight * 1.02
      const end = viewportHeight * -0.08
      const progress = clamp((start - rect.top) / (start - end), 0, 1)
      const opacity = clamp((progress - 0.06) / 0.28, 0, 1) * 0.86
      const maxShift = mobileQuery.matches ? -56 : -96

      section.style.setProperty('--price-image-opacity', opacity.toFixed(2))
      section.style.setProperty('--price-image-scroll-x', `${(maxShift * progress).toFixed(2)}px`)
      syncVisibleState(opacity > 0.02)
    }

    const scheduleUpdate = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateImageMotion)
    }

    updateImageMotion()
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
      className={clsx(styles.root, imageVisible && styles.imageVisible)}
      id="services"
      aria-labelledby="what-we-do-title"
    >
      <div className={styles.inner}>
        <div className={styles.statementCard}>
          <h2 className={styles.title} id="what-we-do-title">
            Что мы делаем?
          </h2>
          <p className={styles.statement}>
            Наша цель - сделать сайт, который максимально понятно донесёт до вашего клиента суть
            вашего бизнеса и при этом выгодно выделит вас среди конкурентов.
          </p>
        </div>

        <div className={styles.cards}>
          <article className={styles.scopeCard}>
            <p className={styles.blockHeading}>В каждый лендинг входит</p>
            <ul className={styles.scopeList}>
              <li>Анализ конкурентов и ниши</li>
              <li>Подготовка прототипа и дизайна</li>
              <li>Разработка самого сайта</li>
              <li>Мобильная версия сайта</li>
              <li>Базовая SEO-настройка</li>
              <li>Оптимизация под выдачу в ИИ (GEO/AEO)</li>
              <li>При необходимости - приобретение домена и загрузка сайта на сервер</li>
              <li>Защита от перехвата лидов со стороны конкурентов в подарок</li>
            </ul>
          </article>

          <aside
            ref={priceCardRef}
            className={styles.priceCard}
            aria-label="Стоимость разработки под ключ"
          >
            <p className={styles.blockHeading}>Цена под ключ</p>
            <p className={styles.price}>25 тыс.</p>
            <Image
              className={styles.priceImage}
              src="/images/razrabotka/price.webp"
              alt=""
              width={1536}
              height={1024}
              sizes="(max-width: 767px) 230px, 300px"
              aria-hidden="true"
            />
            <p className={styles.payment}>Оплата 50/50</p>
          </aside>
        </div>
      </div>
    </section>
  )
}
