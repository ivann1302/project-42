'use client'

import Matter from 'matter-js'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useScrollReveal } from '@/shared/lib'
import styles from './RazrabotkaFounderSection.module.scss'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const reasons = [
  'Разработка точно в срок + поддержка',
  'Понимание пути клиента и его психологии гарантирует, что ваш сайт будет бить точно в цель',
  'Соблюдение законодательства о защите информации и персональных данных в РФ',
  'Защита сайта от перехвата клиентов со стороны недобросовестных конкурентов и взлома',
  'Не привязываем проект к шаблону: сайт можно дорабатывать под рекламу, SEO, аналитику и новые услуги',
  'Наш дизайн точно выделит вас среди конкурентов',
] as const

export function RazrabotkaFounderSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const physicsZoneRef = useRef<HTMLUListElement>(null)
  const reasonRefs = useRef<Array<HTMLLIElement | null>>([])
  const [physicsStarted, setPhysicsStarted] = useState(false)

  useScrollReveal(sectionRef, { threshold: 0.22, rootMargin: '0px 0px -12% 0px' })

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !window.matchMedia || window.matchMedia(REDUCED_MOTION_QUERY).matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setPhysicsStarted(true)
        observer.disconnect()
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const zone = physicsZoneRef.current
    if (!zone || !physicsStarted) return

    const { Bodies, Body, Composite, Engine, Events, Runner } = Matter
    const engine = Engine.create({ gravity: { x: 0, y: 1.42 } })
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
      engine.gravity.y = isMobile ? 1.65 : 1.42

      Composite.add(engine.world, [
        Bodies.rectangle(width / 2, height + wall / 2 - 3, width, wall, { isStatic: true }),
        Bodies.rectangle(-wall / 2, height / 2, wall, height * 2, { isStatic: true }),
        Bodies.rectangle(width + wall / 2, height / 2, wall, height * 2, { isStatic: true }),
      ])

      reasonRefs.current.forEach((element, index) => {
        if (!element) return
        const isDesignReason = index === reasons.length - 1
        element.style.opacity = '0'
        const itemWidth = element.offsetWidth
        const itemHeight = element.offsetHeight
        const columns = isMobile ? [0.34, 0.66] : [0.22, 0.5, 0.78]
        const preferredX = width * (isDesignReason ? 0.5 : columns[index % columns.length])
        const x = Math.max(itemWidth / 2 + 4, Math.min(width - itemWidth / 2 - 4, preferredX))
        const body = Bodies.rectangle(x, -itemHeight * (1 + index * 0.8), itemWidth, itemHeight, {
          angle: (index % 2 === 0 ? -1 : 1) * (0.028 + (index % 3) * 0.016),
          chamfer: { radius: 18 },
          density: 0.0015,
          friction: 0.38,
          frictionAir: 0.012,
          frictionStatic: 0.24,
          restitution: 0.1,
        })

        pairs.push({ body, element })
        timers.push(
          window.setTimeout(
            () => {
              if (disposed) return
              element.style.opacity = '1'
              Composite.add(engine.world, body)
              Body.setAngularVelocity(body, (index % 2 === 0 ? -1 : 1) * 0.01)
            },
            isDesignReason ? reasons.length * 210 : index * 150,
          ),
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
  }, [physicsStarted])

  return (
    <section
      ref={sectionRef}
      className={styles.root}
      id="about"
      aria-labelledby="razrabotka-founder-title"
    >
      <div className={styles.shell}>
        <Image
          className={styles.image}
          src="/images/razrabotka/after-cta.webp"
          alt=""
          width={420}
          height={320}
          sizes="(max-width: 767px) 96px, (max-width: 1023px) 210px, 260px"
          aria-hidden="true"
        />
        <div className={styles.content}>
          <h2 className={styles.title} id="razrabotka-founder-title">
            Почему мы?
          </h2>
          <ul
            ref={physicsZoneRef}
            className={`${styles.reasonList} ${physicsStarted ? styles.physicsActive : ''}`}
          >
            {reasons.map((reason, index) => (
              <li
                key={reason}
                ref={(element) => {
                  reasonRefs.current[index] = element
                }}
              >
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
