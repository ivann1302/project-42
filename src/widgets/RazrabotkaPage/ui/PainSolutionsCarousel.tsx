'use client'

import type { CSSProperties } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Container, Icon, SectionTitle, StarField } from '@/shared/ui'
import { useScrollReveal } from '@/shared/lib'
import { projects } from '@/entities/Project'
import styles from './RazrabotkaPage.module.scss'

const VISIBLE_DESKTOP_CARDS = 3

const items = projects
  .filter((project) => project.clientPain && project.solution && project.result)
  .map((project) => ({
    id: project.id,
    title: project.title,
    tags: project.tags.slice(0, 3),
    pain: project.clientPain ?? project.description,
    solution: project.solution ?? project.description,
    result: project.result ?? project.achievements?.[0] ?? project.description,
  }))

export function PainSolutionsCarousel() {
  const listRef = useRef<HTMLUListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const maxIndex = Math.max(items.length - VISIBLE_DESKTOP_CARDS, 0)

  useScrollReveal(listRef, { threshold: 0.1 })

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const list = listRef.current
    const target = list?.children[index] as HTMLElement | undefined

    if (!list || !target) return

    const listRect = list.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const nextLeft = targetRect.left - listRect.left + list.scrollLeft

    list.scrollTo({ left: nextLeft, behavior })
  }, [])

  const moveCarousel = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((currentIndex) => {
        let nextIndex = currentIndex + direction

        if (nextIndex > maxIndex) nextIndex = 0
        if (nextIndex < 0) nextIndex = maxIndex

        scrollToIndex(nextIndex)
        return nextIndex
      })
    },
    [maxIndex, scrollToIndex],
  )

  useEffect(() => {
    const handleResize = () => scrollToIndex(activeIndex, 'auto')

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [activeIndex, scrollToIndex])

  return (
    <section id="portfolio" className={styles.painSolutions} aria-labelledby="pain-solutions-title">
      <StarField />
      <Container className={styles.sectionContent}>
        <div className={styles.painSolutionsHeader}>
          <SectionTitle eyebrow="Решаем реальные задачи" align="center">
            <span id="pain-solutions-title">С какой болью приходят клиенты</span>
          </SectionTitle>
          <p>
            Показываем не просто проекты, а сценарии: с какой проблемой пришёл клиент, что мы
            сделали и какой результат получил бизнес.
          </p>
        </div>

        <div className={styles.painCarouselShell}>
          <ul ref={listRef} className={styles.painCarousel} role="list">
            {items.map((item, index) => (
              <li
                key={item.id}
                className={styles.painCard}
                style={{ '--i': index } as CSSProperties}
              >
                <div className={styles.painCardTop}>
                  <span className={styles.painCardNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <ul className={styles.painTags} role="list">
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
                <h3>{item.title}</h3>
                <div className={styles.painCardGrid}>
                  <div>
                    <span>Боль клиента</span>
                    <p>{item.pain}</p>
                  </div>
                  <div>
                    <span>Решение</span>
                    <p>{item.solution}</p>
                  </div>
                  <div>
                    <span>Итог</span>
                    <p>{item.result}</p>
                  </div>
                </div>
                <Button
                  href={`/portfolio#${item.id}`}
                  variant="ghost"
                  className={styles.painCardCta}
                >
                  Посмотреть проект
                </Button>
              </li>
            ))}
          </ul>

          {maxIndex > 0 && (
            <div className={styles.painCarouselControls}>
              <button
                type="button"
                className={styles.painCarouselButton}
                aria-label="Предыдущая задача клиента"
                onClick={() => moveCarousel(-1)}
              >
                <Icon name="arrowLeft" size={22} />
              </button>
              <button
                type="button"
                className={styles.painCarouselButton}
                aria-label="Следующая задача клиента"
                onClick={() => moveCarousel(1)}
              >
                <Icon name="arrowRight" size={22} />
              </button>
            </div>
          )}
        </div>

        <div className={styles.painSolutionsFooter}>
          <Button href="/portfolio" variant="secondary">
            Смотреть все кейсы
          </Button>
        </div>
      </Container>
    </section>
  )
}
