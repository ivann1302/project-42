'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { MouseEvent, TouchEvent } from 'react'
import styles from './WaveDivider.module.scss'

const LINE_Y = 100
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const TOUCH_PULL_MULTIPLIER = 0.42
const MAX_TOUCH_STEP = 36
const BOTTOM_BOUNCE_PROGRESS = -26
const BOTTOM_TRIGGER_DISTANCE = 4
const BOTTOM_RESET_DISTANCE = 160

export function WaveDivider() {
  const lineRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const progressRef = useRef(0)
  const xRef = useRef(0.5)
  const timeRef = useRef(Math.PI / 2)
  const frameRef = useRef<number | null>(null)
  const lastTouchYRef = useRef<number | null>(null)
  const bottomBounceTriggeredRef = useRef(false)
  const reducedMotionRef = useRef(false)

  const setPath = useCallback((progress: number) => {
    const line = lineRef.current
    const path = pathRef.current
    if (!line || !path) return

    const width = line.getBoundingClientRect().width
    path.setAttribute(
      'd',
      `M0 ${LINE_Y} Q${width * xRef.current} ${LINE_Y + progress * 0.6}, ${width} ${LINE_Y}`,
    )
  }, [])

  const resetAnimation = useCallback(() => {
    timeRef.current = Math.PI / 2
    progressRef.current = 0
    setPath(0)
  }, [setPath])

  const animateOut = useCallback(() => {
    const nextProgress = progressRef.current * Math.sin(timeRef.current)
    progressRef.current *= 0.975
    timeRef.current += 0.2
    setPath(nextProgress)

    if (Math.abs(progressRef.current) > 0.75) {
      frameRef.current = window.requestAnimationFrame(animateOut)
      return
    }

    frameRef.current = null
    resetAnimation()
  }, [resetAnimation, setPath])

  const triggerBottomBounce = useCallback(() => {
    if (reducedMotionRef.current) return

    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    xRef.current = 0.5
    timeRef.current = Math.PI / 2
    progressRef.current = BOTTOM_BOUNCE_PROGRESS
    setPath(progressRef.current)
    frameRef.current = window.requestAnimationFrame(animateOut)
  }, [animateOut, setPath])

  const handleMouseEnter = () => {
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
    resetAnimation()
  }

  const updatePathFromPoint = useCallback(
    (clientX: number, movementY: number) => {
      const line = lineRef.current
      if (!line) return

      const lineBounds = line.getBoundingClientRect()
      xRef.current = Math.min(Math.max((clientX - lineBounds.left) / lineBounds.width, 0), 1)
      progressRef.current += movementY
      setPath(progressRef.current)
    },
    [setPath],
  )

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reducedMotionRef.current) return

    updatePathFromPoint(event.clientX, event.movementY)
  }

  const handleMouseLeave = () => {
    if (reducedMotionRef.current || frameRef.current) return
    frameRef.current = window.requestAnimationFrame(animateOut)
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (reducedMotionRef.current) return

    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    const touch = event.touches[0]
    lastTouchYRef.current = touch?.clientY ?? null
  }

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (reducedMotionRef.current) return

    const touch = event.touches[0]
    if (!touch || lastTouchYRef.current === null) return

    const movementY = touch.clientY - lastTouchYRef.current
    const limitedMovementY = Math.max(Math.min(movementY, MAX_TOUCH_STEP), -MAX_TOUCH_STEP)
    lastTouchYRef.current = touch.clientY
    updatePathFromPoint(touch.clientX, limitedMovementY * TOUCH_PULL_MULTIPLIER)
  }

  const handleTouchEnd = () => {
    lastTouchYRef.current = null
    if (reducedMotionRef.current || frameRef.current) return
    frameRef.current = window.requestAnimationFrame(animateOut)
  }

  useEffect(() => {
    const handleWindowScroll = () => {
      const documentElement = document.documentElement
      const documentHeight = Math.max(document.body.scrollHeight, documentElement.scrollHeight)
      const distanceToBottom = documentHeight - (window.scrollY + window.innerHeight)

      if (distanceToBottom > BOTTOM_RESET_DISTANCE) {
        bottomBounceTriggeredRef.current = false
        return
      }

      if (distanceToBottom <= BOTTOM_TRIGGER_DISTANCE && !bottomBounceTriggeredRef.current) {
        bottomBounceTriggeredRef.current = true
        triggerBottomBounce()
      }
    }

    if (!window.matchMedia) {
      resetAnimation()
      window.addEventListener('resize', resetAnimation)
      window.addEventListener('scroll', handleWindowScroll, { passive: true })

      return () => {
        if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
        window.removeEventListener('resize', resetAnimation)
        window.removeEventListener('scroll', handleWindowScroll)
      }
    }

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)

    const syncReducedMotion = () => {
      reducedMotionRef.current = mediaQuery.matches
      resetAnimation()
    }

    syncReducedMotion()
    window.addEventListener('resize', resetAnimation)
    window.addEventListener('scroll', handleWindowScroll, { passive: true })
    mediaQuery.addEventListener('change', syncReducedMotion)

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resetAnimation)
      window.removeEventListener('scroll', handleWindowScroll)
      mediaQuery.removeEventListener('change', syncReducedMotion)
    }
  }, [resetAnimation, triggerBottomBounce])

  return (
    <div className={styles.root} aria-hidden="true">
      <div ref={lineRef} className={styles.line}>
        <div
          className={styles.hitArea}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        />
        <svg className={styles.svg}>
          <path ref={pathRef} className={styles.path} />
        </svg>
      </div>
    </div>
  )
}
