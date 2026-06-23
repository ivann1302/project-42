'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { articles, getArticlePath } from '@/entities/Article'
import { useScrollReveal } from '@/shared/lib'
import styles from './RazrabotkaBlogCarouselSection.module.scss'

export function RazrabotkaBlogCarouselSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.16, rootMargin: '0px 0px -10% 0px' })

  return (
    <section ref={sectionRef} className={styles.root} aria-labelledby="razrabotka-blog-title">
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.kicker}>Наш опыт</p>
          <h2 className={styles.title} id="razrabotka-blog-title">
            Делимся экспертизой
          </h2>
        </div>

        <div className={styles.carousel} aria-label="Статьи блога">
          <ol className={styles.list}>
            {articles.map((article) => (
              <li className={styles.item} key={article.slug}>
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
      </div>
    </section>
  )
}
