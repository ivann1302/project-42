'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button, Container, SectionTitle, StarField } from '@/shared/ui'
import { getProjectCaseHref, projects } from '@/entities/Project'
import styles from './RazrabotkaPage.module.scss'

const VISIBLE_DESKTOP_CARDS = 3

const desktopImageSizes: Record<string, { width: number; height: number }> = {
  'project-1': { width: 1920, height: 1080 },
  'project-2': { width: 1920, height: 1080 },
  'project-3': { width: 1910, height: 1034 },
  'project-4': { width: 1849, height: 935 },
  'project-5': { width: 1841, height: 864 },
  'project-6': { width: 1200, height: 675 },
}

const items = projects
  .filter((project) => project.clientPain && project.solution && project.result)
  .map((project) => ({
    id: project.id,
    title: project.title,
    href: getProjectCaseHref(project.id),
    desktopImageUrl: project.desktopImageUrl,
    desktopImageSize: desktopImageSizes[project.id],
  }))

export function PainSolutionsCarousel() {
  const listRef = useRef<HTMLUListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const maxIndex = Math.max(items.length - VISIBLE_DESKTOP_CARDS, 0)

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
            <span id="pain-solutions-title">Примеры наших работ</span>
          </SectionTitle>
          <p>Сайты, которые уже приносят прибыль</p>
        </div>

        <div className={styles.painCarouselShell}>
          <ul ref={listRef} className={styles.painCarousel} role="list">
            {items.map((item) => (
              <li key={item.id} className={styles.painCard}>
                <Link href={item.href} className={styles.painCardLink}>
                  <div className={styles.painCardHeader}>
                    <h3>{item.title}</h3>
                    <span className={styles.painCardArrow} aria-hidden="true" />
                  </div>
                  {item.desktopImageUrl && item.desktopImageSize && (
                    <div className={styles.painCardImage}>
                      <Image
                        src={item.desktopImageUrl}
                        alt={`Превью проекта ${item.title}`}
                        width={item.desktopImageSize.width}
                        height={item.desktopImageSize.height}
                        className={styles.painCardImg}
                        sizes="(min-width: 1024px) 31vw, (min-width: 768px) 45vw, 88vw"
                        loading="eager"
                      />
                    </div>
                  )}
                </Link>
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
                <span aria-hidden="true" />
              </button>
              <button
                type="button"
                className={styles.painCarouselButton}
                aria-label="Следующая задача клиента"
                onClick={() => moveCarousel(1)}
              >
                <span aria-hidden="true" />
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
