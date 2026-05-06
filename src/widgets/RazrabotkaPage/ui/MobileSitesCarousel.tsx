'use client'

import type { CSSProperties, PointerEvent } from 'react'
import { useState } from 'react'
import Image from 'next/image'
import { projects } from '@/entities/Project'
import styles from './MobileSitesCarousel.module.scss'

type MobileProject = (typeof projects)[number] & {
  mobileImageUrl: string
}

const carouselProjects = projects
  .filter((project): project is MobileProject => Boolean(project.mobileImageUrl))
  .slice(0, 6)

type TiltStyle = CSSProperties & {
  '--tilt-x': string
  '--tilt-y': string
}

const defaultTiltStyle: TiltStyle = {
  '--tilt-x': '0deg',
  '--tilt-y': '0deg',
}

export function MobileSitesCarousel() {
  const [tiltStyle, setTiltStyle] = useState<TiltStyle>(defaultTiltStyle)

  if (carouselProjects.length === 0) {
    return null
  }

  const step = 360 / carouselProjects.length
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2

    setTiltStyle({
      '--tilt-x': `${(-y * 7).toFixed(2)}deg`,
      '--tilt-y': `${(x * 9).toFixed(2)}deg`,
    })
  }

  return (
    <div
      className={styles.stage}
      style={tiltStyle}
      aria-label="Мобильные версии сайтов"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setTiltStyle(defaultTiltStyle)}
    >
      <div className={styles.tilt}>
        <div className={styles.carousel}>
          {carouselProjects.map((project, index) => (
            <div
              key={project.id}
              className={styles.item}
              style={{ '--angle': `${index * step}deg` } as CSSProperties}
            >
              <Image
                src={project.mobileImageUrl}
                alt=""
                fill
                className={styles.image}
                sizes="180px"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
