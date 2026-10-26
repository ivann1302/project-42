'use client'

import { type ReactNode, useEffect, useRef } from 'react'
import styles from './DevelopmentMotion.module.scss'

interface DevelopmentMotionProps {
  children: ReactNode
  className?: string
}

export function DevelopmentMotion({ children, className = '' }: DevelopmentMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-development-reveal]'))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const target = entry.target as HTMLElement
          target.dataset.developmentState = 'revealed'
          observer.unobserve(target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    // Keep the current viewport visible during hydration and scroll restoration.
    const positions = targets.map((target) => target.getBoundingClientRect().top)
    targets.forEach((target, index) => {
      if (positions[index] < window.innerHeight || target.contains(document.activeElement)) {
        target.dataset.developmentState = 'visible'
      } else {
        target.dataset.developmentState = 'pending'
        observer.observe(target)
      }
    })

    const revealOnFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return
      // A pointer focus must not move a button between pointerdown and pointerup.
      if (!event.target.matches(':focus-visible')) return
      const target = event.target.closest<HTMLElement>(
        '[data-development-reveal], [data-development-enter]',
      )
      if (!target || !root.contains(target)) return
      // Keyboard navigation must never wait for the visual entrance.
      target.dataset.developmentState = 'visible'
      observer.unobserve(target)
    }

    const revealAll = () => {
      if (!reducedMotion.matches) return
      observer.disconnect()
      targets.forEach((target) => {
        target.dataset.developmentState = 'visible'
      })
    }

    root.addEventListener('focusin', revealOnFocus)
    reducedMotion.addEventListener('change', revealAll)

    return () => {
      observer.disconnect()
      root.removeEventListener('focusin', revealOnFocus)
      reducedMotion.removeEventListener('change', revealAll)
      targets.forEach((target) => {
        delete target.dataset.developmentState
      })
    }
  }, [])

  return (
    <div ref={rootRef} className={`${styles.root} ${className}`}>
      {children}
    </div>
  )
}
