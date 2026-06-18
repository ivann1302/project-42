'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import styles from './DesktopCursor.module.scss'

const DESKTOP_CURSOR_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 1024px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, label, summary, [role="button"], [data-cursor-interactive]'
const TEXT_SELECTOR =
  'h1, h2, h3, h4, h5, h6, p, li, span, small, strong, em, blockquote, figcaption, [data-cursor-text]'

export function DesktopCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const frameRef = useRef(0)
  const reduceMotionRef = useRef(false)
  const visibleRef = useRef(false)
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [textHover, setTextHover] = useState(false)
  const [interactive, setInteractive] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const desktopQuery = window.matchMedia(DESKTOP_CURSOR_QUERY)
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY)

    const syncState = () => {
      reduceMotionRef.current = reducedMotionQuery.matches
      setEnabled(desktopQuery.matches)
    }

    syncState()
    desktopQuery.addEventListener('change', syncState)
    reducedMotionQuery.addEventListener('change', syncState)

    return () => {
      desktopQuery.removeEventListener('change', syncState)
      reducedMotionQuery.removeEventListener('change', syncState)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement

    if (!enabled) {
      root.classList.remove(styles.cursorEnabled)
      setVisible(false)
      return undefined
    }

    root.classList.add(styles.cursorEnabled)

    const moveCursor = () => {
      frameRef.current = 0
      const cursor = cursorRef.current
      if (!cursor) return

      const current = currentRef.current
      const target = targetRef.current
      const ease = reduceMotionRef.current ? 1 : 0.28

      current.x += (target.x - current.x) * ease
      current.y += (target.y - current.y) * ease
      cursor.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`

      if (
        !reduceMotionRef.current &&
        (Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1)
      ) {
        frameRef.current = window.requestAnimationFrame(moveCursor)
      }
    }

    const scheduleMove = () => {
      if (frameRef.current) return
      frameRef.current = window.requestAnimationFrame(moveCursor)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      targetRef.current = { x: event.clientX, y: event.clientY }

      if (!visibleRef.current) {
        currentRef.current = { x: event.clientX, y: event.clientY }
        visibleRef.current = true
        setVisible(true)
      }

      scheduleMove()
    }

    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const isInteractive = Boolean(target?.closest(INTERACTIVE_SELECTOR))
      setInteractive(isInteractive)
      setTextHover(!isInteractive && Boolean(target?.closest(TEXT_SELECTOR)))
    }

    const handlePointerOut = (event: PointerEvent) => {
      const nextTarget = event.relatedTarget instanceof Element ? event.relatedTarget : null
      const isInteractive = Boolean(nextTarget?.closest(INTERACTIVE_SELECTOR))
      setInteractive(isInteractive)
      setTextHover(!isInteractive && Boolean(nextTarget?.closest(TEXT_SELECTOR)))
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!event.isPrimary) return
      setPressed(true)
    }

    const handlePointerUp = () => setPressed(false)
    const handleMouseLeave = () => {
      visibleRef.current = false
      setVisible(false)
      setTextHover(false)
      setInteractive(false)
      setPressed(false)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerover', handlePointerOver, { passive: true })
    window.addEventListener('pointerout', handlePointerOut, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('pointerup', handlePointerUp, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      root.classList.remove(styles.cursorEnabled)
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerover', handlePointerOver)
      window.removeEventListener('pointerout', handlePointerOut)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      className={clsx(
        styles.cursor,
        visible && styles.visible,
        textHover && styles.text,
        interactive && styles.interactive,
        pressed && styles.pressed,
      )}
      aria-hidden="true"
    />
  )
}
