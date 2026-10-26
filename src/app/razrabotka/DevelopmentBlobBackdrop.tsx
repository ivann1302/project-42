'use client'

import { useEffect, useRef } from 'react'
import { ShaderBackground } from '@/components/ui/metaballs-shader'
import styles from './page.module.scss'

export function DevelopmentBlobBackdrop() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = layerRef.current
    const hero = layer?.parentElement
    if (!layer || !hero) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const updatePosition = () => {
      frame = 0
      if (reducedMotion.matches) {
        layer.style.removeProperty('--blob-flow-y')
        return
      }

      const heroHeight = Math.max(1, hero.getBoundingClientRect().height)
      const travel = heroHeight * 0.78
      const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / heroHeight))
      layer.style.setProperty('--blob-flow-y', `${Math.round(progress * travel)}px`)
    }

    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updatePosition)
    }

    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    reducedMotion.addEventListener('change', requestUpdate)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      reducedMotion.removeEventListener('change', requestUpdate)
    }
  }, [])

  return (
    <div className={styles.blobBridge} ref={layerRef} aria-hidden="true">
      <ShaderBackground scrollParallax />
    </div>
  )
}
