'use client'

import { useRef } from 'react'
import { useScrollReveal } from '@/shared/lib'
import styles from './RazrabotkaLevelUpBanner.module.scss'

type Props = {
  placement?: 'desktop' | 'mobile'
  decorative?: boolean
}

export function RazrabotkaLevelUpBanner({ placement = 'desktop', decorative = false }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const titleId = `razrabotka-level-up-title-${placement}`

  useScrollReveal(sectionRef, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' })

  return (
    <section
      ref={sectionRef}
      className={[styles.root, styles[placement]].join(' ')}
      aria-hidden={decorative || undefined}
      aria-labelledby={decorative ? undefined : titleId}
    >
      <div className={styles.panel}>
        <h2 className={styles.title} id={decorative ? undefined : titleId}>
          ВЫВЕДЕМ ВАШ БИЗНЕС НА НОВЫЙ УРОВЕНЬ
        </h2>
      </div>
    </section>
  )
}
