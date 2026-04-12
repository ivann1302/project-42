'use client'

import { useEffect, useRef } from 'react'
import { Container, StarField } from '@/shared/ui'
import type { StatItem } from '@/entities/ServicePage'
import styles from './Stats.module.scss'

const defaultStats: StatItem[] = [
  { value: 100, prefix: '', suffix: '%', label: 'проектов сданы в срок' },
  { value: 3, prefix: '×', suffix: '', label: 'быстрее среднего за счёт AI' },
  { value: 4, prefix: '≤', suffix: '', label: 'проектов одновременно' },
  { value: 0, prefix: '', suffix: '', label: 'брошенных проектов', static: true },
]

type Props = {
  items?: StatItem[]
}

export function Stats({ items = defaultStats }: Props) {
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([])
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = listRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        el.classList.add('visible')

        const { CountUp } = await import('countup.js')

        items.forEach((stat, i) => {
          if (stat.static) return
          const span = spanRefs.current[i]
          if (!span) return
          new CountUp(span, stat.value, {
            prefix: stat.prefix,
            suffix: stat.suffix,
            duration: 2,
          }).start()
        })
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [items])

  return (
    <section className={styles.root} id="stats">
      <StarField />
      <Container>
        <ul ref={listRef} className={styles.list} role="list">
          {items.map((stat, i) => (
            <li
              key={stat.label}
              className={styles.item}
              style={{ '--i': i } as React.CSSProperties}
            >
              <span
                className={styles.value}
                ref={
                  stat.static
                    ? undefined
                    : (el) => {
                        spanRefs.current[i] = el
                      }
                }
              >
                {stat.static
                  ? `${stat.prefix}${stat.value}${stat.suffix}`
                  : `${stat.prefix}0${stat.suffix}`}
              </span>
              <span className={styles.label}>{stat.label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
