'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, TouchEvent as ReactTouchEvent } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import styles from './CardStack.module.scss'

export type CardStackItem = {
  id: string | number
  title: string
  description?: string
  caption?: string
  imageSrc: string
}

export type CardStackProps = {
  items: readonly CardStackItem[]
  initialIndex?: number
  maxVisible?: number
  cardWidth?: number
  cardHeight?: number
  mobileAspectRatio?: number
  overlap?: number
  spreadDeg?: number
  perspectivePx?: number
  depthPx?: number
  tiltXDeg?: number
  activeLiftPx?: number
  activeScale?: number
  inactiveScale?: number
  springStiffness?: number
  springDamping?: number
  loop?: boolean
  autoAdvance?: boolean
  intervalMs?: number
  pauseOnHover?: boolean
  showDots?: boolean
  className?: string
  ariaLabel?: string
  onChangeIndex?: (index: number, item: CardStackItem) => void
}

function wrapIndex(index: number, length: number) {
  return length ? ((index % length) + length) % length : 0
}

function signedOffset(index: number, active: number, length: number, loop: boolean) {
  const direct = index - active
  if (!loop || length <= 1) return direct
  const wrapped = direct > 0 ? direct - length : direct + length
  return Math.abs(wrapped) < Math.abs(direct) ? wrapped : direct
}

type SwipeStart = {
  identifier: number
  x: number
  y: number
  maxOffset: number
  card: HTMLElement | null
  horizontal: boolean
}

export function CardStack({
  items,
  initialIndex = 0,
  maxVisible = 7,
  cardWidth = 520,
  cardHeight = 320,
  mobileAspectRatio,
  overlap = 0.48,
  spreadDeg = 48,
  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 12,
  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.94,
  springStiffness = 280,
  springDamping = 28,
  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,
  showDots = true,
  className,
  ariaLabel = 'Галерея проектов',
  onChangeIndex,
}: CardStackProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const length = items.length
  const [active, setActive] = useState(() => wrapIndex(initialIndex, length))
  const [stageWidth, setStageWidth] = useState<number | null>(null)
  const [inView, setInView] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const [touching, setTouching] = useState(false)
  const swipeStartRef = useRef<SwipeStart | null>(null)
  const suppressClickUntilRef = useRef(0)

  useEffect(() => {
    setActive((index) => wrapIndex(index, length))
  }, [length])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => setStageWidth(Math.round(stage.getBoundingClientRect().width))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [length])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.15,
    })
    observer.observe(root)
    return () => observer.disconnect()
  }, [length])

  useEffect(() => {
    if (length && active < length) onChangeIndex?.(active, items[active])
  }, [active, items, length, onChangeIndex])

  const go = useCallback(
    (step: number) => {
      if (length <= 1) return
      setActive((index) => {
        const next = index + step
        return loop ? wrapIndex(next, length) : Math.max(0, Math.min(length - 1, next))
      })
    },
    [length, loop],
  )

  useEffect(() => {
    if (!autoAdvance || !inView || reducedMotion || focusWithin || touching || length <= 1) return
    if (pauseOnHover && hovering) return
    if (!loop && active === length - 1) return
    const timer = window.setInterval(() => go(1), Math.max(700, intervalMs))
    return () => window.clearInterval(timer)
  }, [
    active,
    autoAdvance,
    focusWithin,
    go,
    hovering,
    inView,
    intervalMs,
    length,
    loop,
    pauseOnHover,
    reducedMotion,
    touching,
  ])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    function onTouchMove(event: TouchEvent) {
      const swipe = swipeStartRef.current
      if (!swipe) return
      const touch = Array.from(event.changedTouches).find(
        (candidate) => candidate.identifier === swipe.identifier,
      )
      if (!touch) return

      const dx = touch.clientX - swipe.x
      const dy = touch.clientY - swipe.y
      if (!swipe.horizontal && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        swipe.horizontal = true
      }
      if (!swipe.horizontal) return

      if (event.cancelable) event.preventDefault()
      swipe.card?.style.setProperty(
        'translate',
        `${Math.max(-swipe.maxOffset, Math.min(swipe.maxOffset, dx))}px 0`,
      )
    }

    stage.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => stage.removeEventListener('touchmove', onTouchMove)
  }, [])

  if (!length) return null

  const width =
    stageWidth === null ? cardWidth : Math.min(cardWidth, Math.max(180, stageWidth - 96))
  const isMobileStage = stageWidth !== null && stageWidth <= 767
  const height =
    isMobileStage && mobileAspectRatio
      ? Math.round(width / mobileAspectRatio)
      : Math.min(cardHeight, Math.max(240, Math.round((width * cardHeight) / cardWidth)))
  const stageHeight = isMobileStage ? height + 160 : Math.max(424, height + 160)
  const maxOffset = Math.max(0, Math.floor(maxVisible / 2))
  const cardSpacing = Math.max(10, Math.round(width * (1 - overlap)))
  const stepDeg = maxOffset ? spreadDeg / maxOffset : 0
  const canPrev = length > 1 && (loop || active > 0)
  const canNext = length > 1 && (loop || active < length - 1)

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft' && canPrev) {
      event.preventDefault()
      go(-1)
    } else if (event.key === 'ArrowRight' && canNext) {
      event.preventDefault()
      go(1)
    }
  }

  function resetSwipe() {
    swipeStartRef.current?.card?.style.removeProperty('translate')
    swipeStartRef.current = null
    setTouching(false)
  }

  function onStageTouchStart(event: ReactTouchEvent<HTMLDivElement>) {
    if (!isMobileStage) return
    if (event.touches.length !== 1) {
      resetSwipe()
      return
    }

    const touch = event.touches[0]
    swipeStartRef.current = {
      identifier: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
      maxOffset: width / 2,
      card: stageRef.current?.querySelector<HTMLElement>('[aria-current="true"]') ?? null,
      horizontal: false,
    }
    setTouching(true)
  }

  function onStageTouchEnd(event: ReactTouchEvent<HTMLDivElement>) {
    const start = swipeStartRef.current
    if (!start) return
    const touch = Array.from(event.changedTouches).find(
      (candidate) => candidate.identifier === start.identifier,
    )
    if (!touch) return
    resetSwipe()

    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy) * 1.2) return
    if ((dx > 0 && !canPrev) || (dx < 0 && !canNext)) return

    suppressClickUntilRef.current = performance.now() + 400
    go(dx > 0 ? -1 : 1)
  }

  return (
    <div
      ref={rootRef}
      className={[styles.root, className].filter(Boolean).join(' ')}
      role="region"
      aria-roledescription="карусель"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setHovering(true)
      }}
      onPointerLeave={() => setHovering(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false)
      }}
    >
      <div
        ref={stageRef}
        className={styles.stage}
        style={{ height: stageHeight }}
        tabIndex={0}
        aria-label="Используйте стрелки влево и вправо для переключения проектов"
        onTouchStart={onStageTouchStart}
        onTouchEnd={onStageTouchEnd}
        onTouchCancel={resetSwipe}
        onClickCapture={(event) => {
          if (event.detail === 0 || performance.now() > suppressClickUntilRef.current) return
          event.preventDefault()
          event.stopPropagation()
          suppressClickUntilRef.current = 0
        }}
      >
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.plane} style={{ perspective: perspectivePx }}>
          <AnimatePresence initial={false}>
            {items.map((item, index) => {
              const offset = signedOffset(index, active, length, loop)
              const distance = Math.abs(offset)
              if (distance > maxOffset) return null

              const isActive = offset === 0
              const x = offset * cardSpacing
              const y = distance * 10 + (isActive ? -activeLiftPx : 0)
              const z = -distance * depthPx
              const rotateZ = offset * stepDeg
              const rotateX = isActive ? 0 : tiltXDeg
              const scale = isActive ? activeScale : inactiveScale

              return (
                <motion.div
                  key={item.id}
                  className={`${styles.card} ${isActive ? styles.active : ''}`}
                  style={{ width, height, marginLeft: -width / 2, zIndex: 100 - distance }}
                  initial={
                    reducedMotion ? false : { opacity: 0, x, y: y + 40, z, rotateZ, rotateX, scale }
                  }
                  animate={{ opacity: 1, x, y, z, rotateZ, rotateX, scale }}
                  exit={{ opacity: 0 }}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: springStiffness, damping: springDamping }
                  }
                  drag={isActive && !reducedMotion && !isMobileStage ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={(_, info) => {
                    const threshold = Math.min(160, width * 0.22)
                    if (info.offset.x > threshold || info.velocity.x > 650) go(-1)
                    else if (info.offset.x < -threshold || info.velocity.x < -650) go(1)
                  }}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <Image
                    src={item.imageSrc}
                    alt=""
                    fill
                    sizes="(max-width: 640px) calc(100vw - 96px), 520px"
                    className={styles.image}
                    draggable={false}
                  />
                  <div className={styles.shade} aria-hidden="true" />
                  <div className={styles.cardText}>
                    <strong>{item.title}</strong>
                    {item.description ? <span>{item.description}</span> : null}
                  </div>
                  {isActive ? null : (
                    <button
                      type="button"
                      className={styles.selectCard}
                      onClick={() => setActive(index)}
                      aria-label={`Показать проект «${item.title}»`}
                    />
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {items.some((item) => item.caption) ? (
        <div className={styles.caption}>
          {items.map((item, index) => (
            <p key={item.id} data-active={index === active} aria-hidden={index !== active}>
              {item.caption}
            </p>
          ))}
        </div>
      ) : null}

      {showDots && length > 1 ? (
        <div className={styles.dots} role="group" aria-label="Выбрать проект">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.dot} ${index === active ? styles.dotActive : ''}`}
              onClick={() => setActive(index)}
              aria-label={`Показать проект «${item.title}», ${index + 1} из ${length}`}
              aria-current={index === active ? 'true' : undefined}
            />
          ))}
        </div>
      ) : null}
      <span className={styles.srOnly} aria-live={focusWithin ? 'polite' : 'off'}>
        {`Проект ${active + 1} из ${length}: ${items[active].title}`}
      </span>
    </div>
  )
}
