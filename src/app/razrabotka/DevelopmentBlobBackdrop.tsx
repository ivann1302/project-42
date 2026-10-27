'use client'

import { useEffect, useRef } from 'react'
import { ShaderBackground } from '@/components/ui/metaballs-shader'
import styles from './page.module.scss'

export function DevelopmentBlobBackdrop() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = layerRef.current
    const hero = layer?.parentElement
    const flow = hero?.parentElement
    if (!layer || !hero || !flow) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const updatePosition = () => {
      frame = 0
      if (reducedMotion.matches) {
        layer.style.removeProperty('--blob-flow-y')
        return
      }

      const heroHeight = Math.max(1, hero.getBoundingClientRect().height)
      const flowBounds = flow.getBoundingClientRect()
      const flowHeight = Math.max(1, flowBounds.height)
      const scroll = Math.min(flowHeight, Math.max(0, -flowBounds.top))
      const heroScroll = Math.min(scroll, heroHeight)
      const followingScroll = Math.max(0, scroll - heroHeight)
      layer.style.setProperty(
        '--blob-flow-y',
        `${Math.round(heroScroll * 0.78 + followingScroll)}px`,
      )
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
