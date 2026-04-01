'use client'

import { useEffect, useRef } from 'react'
import { Container, Icon, SectionTitle, StarField } from '@/shared/ui'
import type { IconName } from '@/shared/ui/Icon/icons'
import styles from './WhyUs.module.scss'

type Item = {
  icon: IconName
  title: string
  description: string
}

const items: Item[] = [
  {
    icon: 'target',
    title: 'Мало проектов',
    description:
      'Одновременно в работе не более 5 проектов. Каждый получает максимальное внимание команды.',
  },
  {
    icon: 'zap',
    title: 'AI как инструмент',
    description:
      'Нейросети ускоряют рутину, не заменяют экспертизу. Ниже цена — не значит ниже качество.',
  },
  {
    icon: 'layers',
    title: 'Отлаженные процессы',
    description:
      'Выверенные процессы и AI-инструменты дают скорость и качество большой студии при стоимости небольшой команды.',
  },
  {
    icon: 'code',
    title: 'Полный цикл',
    description:
      'Дизайн, разработка, SEO, GEO, поддержка — всё под одной крышей. Без потерь на стыках между подрядчиками.',
  },
  {
    icon: 'shield',
    title: 'Код без замков',
    description:
      'Чистый, документированный код. Если понадобится другой специалист — он подхватит проект без боли.',
  },
  {
    icon: 'rocket',
    title: 'Результат без балласта',
    description:
      'Не раздуваем смету, не пишем отчёты ради отчётов и не держим менеджеров, которые съедают ваш бюджет. Только работа и результат.',
  },
]

export function WhyUs() {
  const stackRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const stack = stackRef.current
    if (!stack) return

    let rafId: number
    let stackTop = 0
    let stickyTopPx = 0
    const cards: HTMLLIElement[] = []

    function measure() {
      stackTop = stack!.getBoundingClientRect().top + window.scrollY
      stickyTopPx = window.innerHeight * 0.1
      cards.length = 0
      stack!.querySelectorAll<HTMLLIElement>('li').forEach((li) => cards.push(li))
    }

    function onScroll() {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        for (let i = 0; i < cards.length - 1; i++) {
          const cardHeight = cards[i].offsetHeight
          const exitStart = stackTop + cards[i + 1].offsetTop - stickyTopPx
          const progress = Math.min(Math.max((scrollY - exitStart) / cardHeight, 0), 1)
          cards[i].style.setProperty('--progress', String(progress))
        }
      })
    }

    measure()
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <section className={styles.root} id="why">
      <StarField />
      <Container>
        <SectionTitle eyebrow="Наш подход" align="center">
          Мы устроены иначе
        </SectionTitle>
        <ul className={styles.stack} ref={stackRef} role="list">
          {items.map((item, i) => (
            <li
              key={item.title}
              className={styles.card}
              style={{ '--index': i } as React.CSSProperties}
            >
              <div className={styles.cardContent}>
                <span className={styles.iconWrap} aria-hidden="true">
                  <Icon name={item.icon} size={24} />
                </span>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.desc}>{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
