'use client'

import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './MagneticHeading.module.scss'

type Props = {
  as?: 'h1' | 'h2'
  ariaLabel?: string
  children: ReactNode
  className?: string
  darkLens?: boolean
  id?: string
  lensClassName?: string
  lensSize?: number
  whiteLens?: boolean
}

export function MagneticHeading({
  as: Heading = 'h2',
  ariaLabel,
  children,
  className,
  darkLens = false,
  id,
  lensClassName,
  lensSize = 150,
  whiteLens = false,
}: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const lensRef = useRef<HTMLSpanElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  useEffect(() => {
    let frame = 0

    const animate = () => {
      current.current.x += (pointer.current.x - current.current.x) * 0.16
      current.current.y += (pointer.current.y - current.current.y) * 0.16
      const pixelRatio = window.devicePixelRatio || 1
      const renderX =
        whiteLens || darkLens
          ? Math.round(current.current.x * pixelRatio) / pixelRatio
          : current.current.x
      const renderY =
        whiteLens || darkLens
          ? Math.round(current.current.y * pixelRatio) / pixelRatio
          : current.current.y

      lensRef.current?.style.setProperty('--magnetic-x', `${renderX}px`)
      lensRef.current?.style.setProperty('--magnetic-y', `${renderY}px`)
      lensRef.current?.style.setProperty('left', `${renderX}px`)
      lensRef.current?.style.setProperty('top', `${renderY}px`)
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [darkLens, whiteLens])

  const updatePointer = useCallback((event: MouseEvent<HTMLHeadingElement>, snap = false) => {
    const heading = headingRef.current
    if (!heading) return
    const rect = heading.getBoundingClientRect()
    const next = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    pointer.current = next
    if (snap) current.current = next
    heading.style.setProperty('--magnetic-heading-width', `${rect.width}px`)
    heading.style.setProperty('--magnetic-heading-height', `${rect.height}px`)
  }, [])

  return (
    <Heading
      aria-label={ariaLabel}
      className={[styles.heading, className].filter(Boolean).join(' ')}
      data-cursor-magnetic
      id={id}
      onMouseEnter={(event) => {
        updatePointer(event, true)
        setActive(true)
      }}
      onMouseLeave={() => setActive(false)}
      onMouseMove={updatePointer}
      ref={headingRef}
      style={{ '--magnetic-lens-size': `${lensSize}px` } as CSSProperties}
    >
      {children}
      <span
        aria-hidden="true"
        className={[
          styles.lens,
          whiteLens && styles.whiteLens,
          darkLens && styles.darkLens,
          lensClassName,
          active && styles.active,
        ]
          .filter(Boolean)
          .join(' ')}
        ref={lensRef}
      ></span>
    </Heading>
  )
}
