'use client'

import { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import styles from './HomeImpact.module.scss'

const PHYSICS_VISIBILITY_THRESHOLD = 0.5

const IMPACT_BLOCKS = [
  {
    desktopText: 'Погружаемся в бизнес',
    mobileText: 'Погружаемся в бизнес',
    className: styles.blockOrange,
  },
  {
    desktopText: 'Проектируем путь клиента',
    mobileText: 'Проектируем путь клиента',
    className: styles.blockDark,
  },
  {
    desktopText: 'Запускаем продукт',
    mobileText: 'Запускаем продукт',
    className: styles.blockDark,
  },
  {
    desktopText: 'Оптимизируем процессы',
    mobileText: 'Улучшаем по данным',
    className: styles.blockOrange,
  },
] as const

export function HomeImpact() {
  const sectionRef = useRef<HTMLElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const zoneRef = useRef<HTMLDivElement>(null)
  const blockRefs = useRef<Array<HTMLDivElement | null>>([])
  const [physicsStarted, setPhysicsStarted] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setPhysicsStarted(true)
        observer.disconnect()
      },
      { threshold: PHYSICS_VISIBILITY_THRESHOLD },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const zone = zoneRef.current
    if (!zone || !physicsStarted) return

    const { Bodies, Body, Composite, Engine, Events, Runner } = Matter
    const engine = Engine.create({ gravity: { x: 0, y: 1.28 } })
    engine.positionIterations = 10
    engine.velocityIterations = 8
    const runner = Runner.create()
    const timers: number[] = []
    const pairs: Array<{ body: Matter.Body; element: HTMLDivElement }> = []
    let disposed = false

    const buildScene = () => {
      if (disposed) return
      timers.splice(0).forEach(window.clearTimeout)
      Composite.clear(engine.world, false, true)
      pairs.length = 0

      const width = zone.clientWidth
      const height = zone.clientHeight
      const wall = 80
      const isMobilePhysics = width <= 600
      const shell = shellRef.current
      const zoneRect = zone.getBoundingClientRect()
      const shellRect = shell?.getBoundingClientRect()
      const cutoutRatio = isMobilePhysics ? 104 / 342 : 325 / 1160
      const cutoutEndInShell = (shell?.clientWidth ?? width) * cutoutRatio
      const zoneOffset = shellRect ? zoneRect.left - shellRect.left : 0
      const floorStart = Math.max(0, Math.min(width, cutoutEndInShell - zoneOffset))
      const floorWidth = width - floorStart
      engine.gravity.y = isMobilePhysics ? 2.1 : 1.28
      const boundaries = [
        Bodies.rectangle(floorStart + floorWidth / 2, height + wall / 2 - 8, floorWidth, wall, {
          friction: 0.48,
          frictionStatic: 0.42,
          isStatic: true,
        }),
        Bodies.rectangle(-wall / 2, height / 2, wall, height * 2, {
          friction: 0,
          frictionStatic: 0,
          isStatic: true,
        }),
        Bodies.rectangle(width + wall / 2, height / 2, wall, height * 2, {
          friction: 0,
          frictionStatic: 0,
          isStatic: true,
        }),
      ]
      if (isMobilePhysics && floorStart > 0) {
        boundaries.push(
          Bodies.rectangle(floorStart - wall / 2, height / 2, wall, height * 2, {
            friction: 0,
            frictionStatic: 0,
            isStatic: true,
          }),
        )
      }
      Composite.add(engine.world, boundaries)

      blockRefs.current.forEach((element, index) => {
        if (!element) return
        element.style.opacity = '0'
        const blockWidth = element.offsetWidth
        const blockHeight = element.offsetHeight
        const xPositions = isMobilePhysics ? [0.8, 0.7, 0.84, 0.76] : [0.68, 0.37, 0.69, 0.48]
        const initialAngles = isMobilePhysics
          ? [-0.05, 0.04, -0.03, 0.02]
          : [-0.2, 0.15, -0.08, 0.06]
        const preferredX = width * (xPositions[index] ?? 0.5)
        const minimumX = (isMobilePhysics ? floorStart : 0) + blockWidth / 2 + 8
        const maximumX = width - blockWidth / 2 - 8
        const initialX = Math.max(minimumX, Math.min(maximumX, preferredX))
        const initialY = isMobilePhysics
          ? -blockHeight * (0.5 + index * 0.72)
          : -blockHeight * (1.2 + index * 1.35)
        const body = Bodies.rectangle(initialX, initialY, blockWidth, blockHeight, {
          angle: initialAngles[index] ?? 0,
          chamfer: { radius: blockHeight / 2 },
          density: 0.0014,
          friction: index === 2 ? 0.14 : 0.24,
          frictionAir: 0.009,
          frictionStatic: index === 2 ? 0.05 : 0.12,
          restitution: 0.16,
        })
        if (isMobilePhysics) Body.setInertia(body, Infinity)

        pairs.push({ body, element })
        timers.push(
          window.setTimeout(() => {
            if (disposed) return
            element.style.opacity = '1'
            Composite.add(engine.world, body)
            if (!isMobilePhysics) {
              Body.setAngularVelocity(body, (index % 2 === 0 ? -1 : 1) * 0.018)
            }
          }, index * 180),
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
    <section className={styles.section} ref={sectionRef} aria-labelledby="home-impact-title">
      <div className={styles.shell} ref={shellRef}>
        <svg
          className={`${styles.shape} ${styles.shapeDesktop}`}
          viewBox="0 0 1160 640"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M42 0H815C850 0 866 20 889 54C930 116 987 137 1087 138C1132 138 1160 161 1160 202V598C1160 623 1143 640 1118 640H325C294 640 283 613 265 584C222 516 179 500 74 500C30 500 0 480 0 442V42C0 19 19 0 42 0Z" />
          <path d="M1000 0H1118C1143 0 1160 18 1160 42V79C1160 96 1148 103 1134 104C1077 108 1022 87 986 52C958 25 967 0 1000 0Z" />
          <path d="M38 545C102 536 164 554 194 594C211 617 198 637 171 638H39C17 638 0 622 0 600V574C0 559 15 548 38 545Z" />
        </svg>
        <svg
          className={`${styles.shape} ${styles.shapeMobile}`}
          viewBox="0 0 342 760"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M18 0H230C245 0 250 18 254 42C262 91 273 127 307 130C329 132 342 146 342 167V730C342 748 330 760 311 760H104C92 760 88 744 84 720C77 665 64 620 36 620C14 620 0 604 0 584V20C0 9 8 0 18 0Z" />
          <path d="M287 10C304 6 324 10 329 27L333 57C336 75 325 87 309 87C291 87 281 75 279 59L276 34C274 21 279 12 287 10Z" />
          <path d="M18 674C37 668 58 677 65 698L69 720C73 737 62 748 47 750H22C10 750 4 742 5 730L7 696C8 685 11 677 18 674Z" />
        </svg>

        <div className={styles.copy}>
          <h2 className={styles.title} id="home-impact-title">
            С нами вы не только запустите продукт,
            <br />
            но и начнёте развивать бизнес
          </h2>
          <p className={styles.description}>
            Соединяем дизайн, разработку и продвижение, чтобы продукт решал задачи бизнеса и
            продолжал расти после запуска.
          </p>
        </div>

        <div className={styles.dropZone} ref={zoneRef} aria-label="Как мы работаем">
          {IMPACT_BLOCKS.map((block, index) => (
            <div
              className={`${styles.fallingBlock} ${block.className} ${styles[`block${index + 1}`]}`}
              ref={(element) => {
                blockRefs.current[index] = element
              }}
              key={block.desktopText}
            >
              <span className={styles.desktopLabel}>{block.desktopText}</span>
              <span className={styles.mobileLabel}>{block.mobileText}</span>
            </div>
          ))}
        </div>

        <p className={styles.sideNote}>Улучшаем продукт после запуска</p>
      </div>
    </section>
  )
}
