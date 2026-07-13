'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import styles from './HomeServices.module.scss'

const SERVICES = [
  {
    id: '01',
    title: 'Разработка сайтов',
    description:
      'Создаём выразительные и быстрые сайты, которые решают задачи бизнеса и помогают расти.',
    image: '/images/razrabotka/services/service-01.webp',
    href: '/razrabotka-sayta',
  },
  {
    id: '02',
    title: 'Разработка мобильных приложений',
    description: 'Проектируем и разрабатываем MVP для iOS, Android и PWA-формата.',
    image: '/images/razrabotka/services/service-06.webp',
    href: '/razrabotka-sayta',
  },
  {
    id: '03',
    title: 'Разработка Telegram-ботов',
    description: 'Автоматизируем заявки, консультации, рассылки и внутренние процессы.',
    image: '/images/razrabotka/services/service-05-no-caption.png',
    href: '/razrabotka-sayta',
  },
  {
    id: '04',
    title: 'SEO-продвижение',
    description: 'Улучшаем техническую базу, структуру и контент для роста в поисковой выдаче.',
    image: '/images/razrabotka/services/service-07.webp',
    href: '/seo-prodvizhenie',
  },
  {
    id: '05',
    title: 'Продвижение в нейросетях (GEO AEO AI SEO)',
    description:
      'Повышаем видимость компании в ответах ChatGPT, Алисы, Perplexity и других AI-систем.',
    image: '/images/razrabotka/services/service-07.webp',
    href: '/geo-aeo-prodvizhenie',
  },
  {
    id: '06',
    title: 'Продвижение в Яндекс Директе',
    description:
      'Запускаем и оптимизируем рекламные кампании под заявки, продажи и понятную аналитику.',
    image: '/images/razrabotka/services/service-08.webp',
    href: '/razrabotka-sayta',
  },
] as const

const AUTO_PLAY_DURATION = 5000

const imageVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
  center: { zIndex: 1, y: 0, opacity: 1 },
  exit: (direction: number) => ({
    zIndex: 0,
    y: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
}

export function HomeServices() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const handleNext = useCallback(() => {
    setDirection(1)
    setActiveIndex((current) => (current + 1) % SERVICES.length)
  }, [])

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
    setIsPaused(false)
  }

  useEffect(() => {
    if (isPaused) return
    const interval = window.setInterval(handleNext, AUTO_PLAY_DURATION)
    return () => window.clearInterval(interval)
  }, [activeIndex, handleNext, isPaused])

  const activeService = SERVICES[activeIndex]

  return (
    <section className={styles.section} id="services" aria-labelledby="home-services-title">
      <h2 className={styles.srOnly} id="home-services-title">
        Наши услуги
      </h2>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.content}>
            <div className={styles.tabs} role="tablist" aria-label="Услуги Project 42">
              {SERVICES.map((service, index) => {
                const isActive = index === activeIndex

                return (
                  <button
                    aria-controls="home-service-image"
                    aria-selected={isActive}
                    className={styles.tab}
                    id={`home-service-tab-${service.id}`}
                    key={service.id}
                    onClick={() => handleTabClick(index)}
                    role="tab"
                    type="button"
                  >
                    <span className={styles.rail}>
                      {isActive && (
                        <motion.span
                          animate={isPaused ? { height: '0%' } : { height: '100%' }}
                          className={styles.progress}
                          initial={{ height: '0%' }}
                          key={`progress-${index}-${isPaused}`}
                          transition={{ duration: AUTO_PLAY_DURATION / 1000, ease: 'linear' }}
                        />
                      )}
                    </span>
                    <span className={styles.number}>{service.id}</span>
                    <span className={styles.tabText}>
                      <span className={styles.tabTitle}>{service.title}</span>
                      <AnimatePresence initial={false} mode="wait">
                        {isActive && (
                          <motion.span
                            animate={{ opacity: 1, height: 'auto' }}
                            className={styles.descriptionWrap}
                            exit={{ opacity: 0, height: 0 }}
                            initial={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                          >
                            <span className={styles.description}>{service.description}</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div
            className={styles.gallery}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              aria-labelledby={`home-service-tab-${activeService.id}`}
              className={styles.frame}
              id="home-service-image"
              role="tabpanel"
            >
              <AnimatePresence custom={direction} initial={false} mode="popLayout">
                <motion.div
                  animate="center"
                  className={styles.slide}
                  custom={direction}
                  exit="exit"
                  initial="enter"
                  key={activeIndex}
                  transition={{
                    y: { type: 'spring', stiffness: 260, damping: 32 },
                    opacity: { duration: 0.4 },
                  }}
                  variants={imageVariants}
                >
                  <Link className={styles.imageLink} href={activeService.href}>
                    <Image
                      alt={activeService.title}
                      className={styles.image}
                      fill
                      priority={activeIndex === 0}
                      sizes="(max-width: 1023px) 100vw, 58vw"
                      src={activeService.image}
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
