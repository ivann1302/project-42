'use client'

import { useEffect, useRef } from 'react'
import styles from './StarField.module.scss'

type Star = {
  x: number
  y: number
  size: number
  speed: number
  phase: number
  twinkleDuration: number
}

type StarFieldProps = {
  blobColor: string
  blobPosition?: 'top-right' | 'bottom-left'
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => {
    const isStatic = Math.random() < 0.3
    return {
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: isStatic ? 1 + Math.random() : 1 + Math.random() * 1.5,
      speed: isStatic ? 0 : 0.2 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      twinkleDuration: 2000 + Math.random() * 4000,
    }
  })
}

export function StarField({ blobColor, blobPosition = 'top-right' }: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blobRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const section = canvas.closest('section') as HTMLElement | null
    if (!section) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const stars = generateStars(60)
    let animFrameId = 0
    let isVisible = false
    let prevScrollY = window.scrollY
    let prevTime = performance.now()

    function resize() {
      if (!canvas || !section) return
      canvas.width = section.offsetWidth
      canvas.height = section.offsetHeight
    }
    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(section)

    function getSectionProgress(): number {
      if (!section) return 0
      const sectionTop = section.getBoundingClientRect().top + window.scrollY
      const sectionHeight = section.offsetHeight
      const viewportCenter = window.scrollY + window.innerHeight / 2
      return Math.max(0, Math.min(1, (viewportCenter - sectionTop) / sectionHeight))
    }

    function draw(now: number) {
      if (!canvas || !ctx) return

      const dt = Math.max(1, now - prevTime)
      prevTime = now

      const currentScrollY = window.scrollY
      const velocity = (currentScrollY - prevScrollY) / dt
      prevScrollY = currentScrollY

      const stretch = Math.max(1, Math.min(1 + Math.abs(velocity) * 0.15, 4))
      const progress = getSectionProgress()

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        const posY = (((star.y - progress * star.speed * 30) % 100) + 100) % 100
        const px = (star.x / 100) * canvas.width
        const py = (posY / 100) * canvas.height
        const opacity = 0.3 + 0.7 * Math.abs(Math.sin(now / star.twinkleDuration + star.phase))

        ctx.save()
        ctx.translate(px, py)
        if (star.speed > 0) ctx.scale(1, stretch)
        ctx.beginPath()
        ctx.arc(0, 0, star.size / 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${opacity.toFixed(3)})`
        ctx.fill()
        ctx.restore()
      })

      if (blobRef.current) {
        blobRef.current.style.transform = `translateY(${(progress * -40).toFixed(1)}px)`
      }

      if (isVisible) {
        animFrameId = requestAnimationFrame(draw)
      }
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) {
          prevTime = performance.now()
          animFrameId = requestAnimationFrame(draw)
        } else {
          cancelAnimationFrame(animFrameId)
        }
      },
      { threshold: 0 },
    )
    intersectionObserver.observe(section)

    return () => {
      cancelAnimationFrame(animFrameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [])

  const blobClass = blobPosition === 'bottom-left' ? styles.blobBottomLeft : styles.blobTopRight

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div
        ref={blobRef}
        className={`${styles.blob} ${blobClass}`}
        aria-hidden="true"
        style={{
          background: `radial-gradient(ellipse at center, ${blobColor} 0%, transparent 65%)`,
        }}
      />
    </>
  )
}
