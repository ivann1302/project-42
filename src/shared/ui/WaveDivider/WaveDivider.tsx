'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { MouseEvent, TouchEvent } from 'react'
import styles from './WaveDivider.module.scss'

const LINE_Y = 100
const AUTO_BOUNCE_MOBILE_QUERY = '(max-width: 767px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const TOUCH_PULL_MULTIPLIER = 0.42
const MAX_TOUCH_STEP = 36
const BOTTOM_BOUNCE_PROGRESS = -26
const VISIBLE_BOUNCE_PROGRESS = 44
const BOTTOM_TRIGGER_DISTANCE = 4
const BOTTOM_RESET_DISTANCE = 160
const VISIBLE_TRIGGER_VIEWPORT_PART = 0.92

type Props = {
  autoBounce?: boolean
  autoBounceOnMobile?: boolean
  className?: string
}

export function WaveDivider({ autoBounce = false, autoBounceOnMobile = false, className }: Props) {
  const lineRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const progressRef = useRef(0)
  const xRef = useRef(0.5)
  const timeRef = useRef(Math.PI / 2)
  const frameRef = useRef<number | null>(null)
  const lastTouchYRef = useRef<number | null>(null)
  const lastScrollYRef = useRef(0)
  const autoBounceRef = useRef(false)
  const visibleBounceTriggeredRef = useRef(false)
  const bottomBounceTriggeredRef = useRef(false)
  const returnBouncePendingRef = useRef(false)
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

  const triggerBounce = useCallback(
    (progress = BOTTOM_BOUNCE_PROGRESS, restartRunning = true) => {
      if (reducedMotionRef.current) return false

      if (frameRef.current) {
        if (!restartRunning) return false

        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }

      xRef.current = 0.5
      timeRef.current = Math.PI / 2
      progressRef.current = progress
      setPath(progressRef.current)
      frameRef.current = window.requestAnimationFrame(animateOut)

      return true
    },
    [animateOut, setPath],
  )

  const isLineVisible = useCallback(() => {
    const line = lineRef.current
    if (!line) return false

    const bounds = line.getBoundingClientRect()
    return bounds.top <= window.innerHeight * VISIBLE_TRIGGER_VIEWPORT_PART && bounds.bottom >= 0
  }, [])

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
    const syncAutoBounce = () => {
      const isMobileViewport = window.matchMedia
        ? window.matchMedia(AUTO_BOUNCE_MOBILE_QUERY).matches
        : window.innerWidth <= 767

      autoBounceRef.current = autoBounce || (autoBounceOnMobile && isMobileViewport)
    }

    const handleWindowScroll = () => {
      const currentScrollY = window.scrollY
      const isScrollingUp = currentScrollY < lastScrollYRef.current
      const documentElement = document.documentElement
      const documentHeight = Math.max(document.body.scrollHeight, documentElement.scrollHeight)
      const distanceToBottom = documentHeight - (currentScrollY + window.innerHeight)
      let startedAutoBounce = false

      if (autoBounceRef.current && !reducedMotionRef.current && isLineVisible()) {
        if (!visibleBounceTriggeredRef.current) {
          visibleBounceTriggeredRef.current = true
          startedAutoBounce = triggerBounce(VISIBLE_BOUNCE_PROGRESS, false)
        } else if (
          returnBouncePendingRef.current &&
          isScrollingUp &&
          distanceToBottom > BOTTOM_TRIGGER_DISTANCE
        ) {
          startedAutoBounce = triggerBounce(VISIBLE_BOUNCE_PROGRESS, false)
          if (startedAutoBounce) {
            returnBouncePendingRef.current = false
          }
        }
      }

      if (distanceToBottom > BOTTOM_RESET_DISTANCE) {
        bottomBounceTriggeredRef.current = false
      } else if (distanceToBottom <= BOTTOM_TRIGGER_DISTANCE) {
        if (autoBounceRef.current) {
          returnBouncePendingRef.current = true
        }

        if (!bottomBounceTriggeredRef.current) {
          bottomBounceTriggeredRef.current = true
          if (!startedAutoBounce) {
            triggerBounce(BOTTOM_BOUNCE_PROGRESS, false)
          }
        }
      }

      lastScrollYRef.current = currentScrollY
    }

    lastScrollYRef.current = window.scrollY
    syncAutoBounce()

    if (!window.matchMedia) {
      resetAnimation()
      window.addEventListener('resize', resetAnimation)
      window.addEventListener('scroll', handleWindowScroll, { passive: true })
      handleWindowScroll()

      return () => {
        if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
        window.removeEventListener('resize', resetAnimation)
        window.removeEventListener('scroll', handleWindowScroll)
      }
    }

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    const mobileQuery = window.matchMedia(AUTO_BOUNCE_MOBILE_QUERY)

    const syncReducedMotion = () => {
      reducedMotionRef.current = mediaQuery.matches
      resetAnimation()
    }

    syncReducedMotion()
    window.addEventListener('resize', resetAnimation)
    window.addEventListener('scroll', handleWindowScroll, { passive: true })
    mediaQuery.addEventListener('change', syncReducedMotion)
    mobileQuery.addEventListener('change', syncAutoBounce)
    handleWindowScroll()

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resetAnimation)
      window.removeEventListener('scroll', handleWindowScroll)
      mediaQuery.removeEventListener('change', syncReducedMotion)
      mobileQuery.removeEventListener('change', syncAutoBounce)
    }
  }, [autoBounce, autoBounceOnMobile, isLineVisible, resetAnimation, triggerBounce])

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-hidden="true"
      data-testid="wave-divider"
    >
      <div ref={lineRef} className={styles.line} data-testid="wave-divider-line">
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
