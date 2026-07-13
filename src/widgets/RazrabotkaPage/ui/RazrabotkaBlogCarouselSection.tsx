'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useRef, useState } from 'react'
import { articles, getArticlePath } from '@/entities/Article'
import { useScrollReveal } from '@/shared/lib'
import styles from './RazrabotkaBlogCarouselSection.module.scss'

const VISIBLE_DESKTOP_ARTICLES = 3

export function RazrabotkaBlogCarouselSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const maxIndex = Math.max(articles.length - VISIBLE_DESKTOP_ARTICLES, 0)

  useScrollReveal(sectionRef, { threshold: 0.16, rootMargin: '0px 0px -10% 0px' })

  const moveCarousel = useCallback(
    (direction: 1 | -1) => {
      const carousel = carouselRef.current

      if (!carousel) return

      let nextIndex = activeIndex + direction
      if (nextIndex > maxIndex) nextIndex = 0
      if (nextIndex < 0) nextIndex = maxIndex

      const target = carousel.querySelector<HTMLElement>(`[data-article-index="${nextIndex}"]`)
      if (!target) return

      carousel.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
      setActiveIndex(nextIndex)
    },
    [activeIndex, maxIndex],
  )

  return (
    <section ref={sectionRef} className={styles.root} aria-labelledby="razrabotka-blog-title">
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.kicker}>Наш опыт</p>
          <h2 className={styles.title} id="razrabotka-blog-title">
            Делимся экспертизой
          </h2>
        </div>

        <div className={styles.carouselShell}>
          <div ref={carouselRef} className={styles.carousel} aria-label="Статьи блога">
            <ol className={styles.list}>
              {articles.map((article, index) => (
                <li className={styles.item} data-article-index={index} key={article.slug}>
                  <Link className={styles.card} href={getArticlePath(article)}>
                    <span className={styles.imageWrap}>
                      <Image
                        className={styles.image}
                        src={article.coverImage ?? '/images/blog/article1.webp'}
                        alt=""
                        width={1536}
                        height={1024}
                        sizes="(max-width: 767px) 82vw, (max-width: 1023px) 44vw, 32vw"
                      />
                    </span>
                    <span className={styles.cardBody}>
                      <span className={styles.cardTitle}>{article.title}</span>
                      <span className={styles.description}>{article.description}</span>
                      <span className={styles.linkLabel}>Читать статью</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          {maxIndex > 0 && (
            <div className={styles.controls} aria-label="Навигация по статьям">
              <button
                type="button"
                className={styles.control}
                aria-label="Предыдущие статьи"
                onClick={() => moveCarousel(-1)}
              >
                <span className={`${styles.controlIcon} ${styles.controlIconPrevious}`} />
              </button>
              <button
                type="button"
                className={styles.control}
                aria-label="Следующие статьи"
                onClick={() => moveCarousel(1)}
              >
                <span className={`${styles.controlIcon} ${styles.controlIconNext}`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
