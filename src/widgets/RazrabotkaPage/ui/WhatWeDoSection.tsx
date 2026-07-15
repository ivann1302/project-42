'use client'

import clsx from 'clsx'
import Matter from 'matter-js'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useScrollReveal } from '@/shared/lib'
import styles from './WhatWeDoSection.module.scss'

const MOBILE_QUERY = '(max-width: 767px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const PHYSICS_VISIBILITY_THRESHOLD = 0.5

export function WhatWeDoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const statementRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const scopeCardRef = useRef<HTMLElement>(null)
  const scopeListRef = useRef<HTMLUListElement>(null)
  const scopeItemRefs = useRef<Array<HTMLLIElement | null>>([])
  const priceCardRef = useRef<HTMLElement>(null)
  const imageVisibleRef = useRef(false)
  const [imageVisible, setImageVisible] = useState(false)
  const [scopePhysicsStarted, setScopePhysicsStarted] = useState(false)

  useScrollReveal(statementRef, { threshold: 0.22, rootMargin: '0px 0px -8% 0px' })
  useScrollReveal(cardsRef, { threshold: PHYSICS_VISIBILITY_THRESHOLD })

  useEffect(() => {
    const card = scopeCardRef.current
    if (!card || !window.matchMedia || window.matchMedia(REDUCED_MOTION_QUERY).matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setScopePhysicsStarted(true)
        observer.disconnect()
      },
      { threshold: PHYSICS_VISIBILITY_THRESHOLD },
    )

    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const zone = scopeListRef.current
    if (!zone || !scopePhysicsStarted) return

    const { Bodies, Body, Composite, Engine, Events, Runner } = Matter
    const engine = Engine.create({ gravity: { x: 0, y: 1.45 } })
    engine.positionIterations = 10
    engine.velocityIterations = 8
    const runner = Runner.create()
    const timers: number[] = []
    const pairs: Array<{ body: Matter.Body; element: HTMLLIElement }> = []
    let disposed = false

    const buildScene = () => {
      if (disposed) return
      timers.splice(0).forEach(window.clearTimeout)
      Composite.clear(engine.world, false, true)
      pairs.length = 0

      const width = zone.clientWidth
      const height = zone.clientHeight
      const wall = 60
      const isMobile = width < 600
      engine.gravity.y = isMobile ? 1.8 : 1.45
      Composite.add(engine.world, [
        Bodies.rectangle(width / 2, height + wall / 2 - 3, width, wall, { isStatic: true }),
        Bodies.rectangle(-wall / 2, height / 2, wall, height * 2, { isStatic: true }),
        Bodies.rectangle(width + wall / 2, height / 2, wall, height * 2, { isStatic: true }),
      ])

      scopeItemRefs.current.forEach((element, index) => {
        if (!element) return
        element.style.opacity = '0'
        const itemWidth = element.offsetWidth
        const itemHeight = element.offsetHeight
        const columns = isMobile ? [0.32, 0.67] : [0.2, 0.5, 0.8]
        const preferredX = width * columns[index % columns.length]
        const x = Math.max(itemWidth / 2 + 4, Math.min(width - itemWidth / 2 - 4, preferredX))
        const body = Bodies.rectangle(x, -itemHeight * (1 + index * 0.75), itemWidth, itemHeight, {
          angle: (index % 2 === 0 ? -1 : 1) * (0.025 + (index % 3) * 0.018),
          chamfer: { radius: itemHeight / 2 },
          density: 0.0014,
          friction: 0.35,
          frictionAir: 0.012,
          frictionStatic: 0.22,
          restitution: 0.12,
        })

        pairs.push({ body, element })
        timers.push(
          window.setTimeout(() => {
            if (disposed) return
            element.style.opacity = '1'
            Composite.add(engine.world, body)
            Body.setAngularVelocity(body, (index % 2 === 0 ? -1 : 1) * 0.012)
          }, index * 120),
        )
      })
    }

    const syncElements = () => {
      pairs.forEach(({ body, element }) => {
        const x = body.position.x - element.offsetWidth / 2
        const y = body.position.y - element.offsetHeight / 2
        element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${body.angle}rad)`
      })
    }

    buildScene()
    Events.on(engine, 'afterUpdate', syncElements)
    Runner.run(runner, engine)

    let resizeTimer = 0
    const resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(buildScene, 180)
    })
    resizeObserver.observe(zone)

    return () => {
      disposed = true
      timers.forEach(window.clearTimeout)
      window.clearTimeout(resizeTimer)
      resizeObserver.disconnect()
      Events.off(engine, 'afterUpdate', syncElements)
      Runner.stop(runner)
      Engine.clear(engine)
    }
  }, [scopePhysicsStarted])

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
        <div ref={statementRef} className={styles.statementCard}>
          <h2 className={styles.title} id="what-we-do-title">
            Что создаём?
          </h2>
          <p className={styles.statement}>
            Создаём сайт, который понятно объясняет ваш бизнес клиенту и помогает выделиться среди
            конкурентов.
          </p>
        </div>

        <div ref={cardsRef} className={styles.cards}>
          <article
            ref={scopeCardRef}
            className={clsx(styles.scopeCard, scopePhysicsStarted && styles.scopePhysicsActive)}
          >
            <p className={styles.blockHeading}>В каждый проект входит</p>
            <ul ref={scopeListRef} className={styles.scopeList}>
              {[
                'Анализ ниши и конкурентов',
                'Прототип и дизайн',
                'Разработка проекта',
                'Мобильная версия',
                'Базовое SEO',
                'Оптимизация под ИИ',
                'Домен и запуск на сервере',
                'Настройка безопасности',
              ].map((item, index) => (
                <li
                  ref={(element) => {
                    scopeItemRefs.current[index] = element
                  }}
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <aside
            ref={priceCardRef}
            className={styles.priceCard}
            aria-label="Стоимость разработки под ключ"
          >
            <p className={styles.blockHeading}>Цена под ключ</p>
            <p className={`${styles.price} ${styles.priceText}`}>от 15 тыс рублей</p>
            <Image
              className={styles.priceImage}
              src="/images/razrabotka/price.webp"
              alt=""
              width={1536}
              height={1024}
              sizes="(max-width: 767px) 230px, 300px"
              aria-hidden="true"
            />
            <p className={styles.payment}>Оплата по этапам</p>
          </aside>
        </div>
      </div>
    </section>
  )
}
