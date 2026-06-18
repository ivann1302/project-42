'use client'

import Image from 'next/image'
import { StudioButton } from '@/shared/ui'
import styles from './RazrabotkaHero.module.scss'

export function RazrabotkaHero() {
  return (
    <section className={styles.root} id="top" aria-labelledby="razrabotka-hero-title">
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.kicker}>Создание и продвижение</p>
          <h1
            className={styles.title}
            id="razrabotka-hero-title"
            aria-label="Сайты и приложения для бизнеса"
          >
            <span className={styles.outlineWord}>САЙТЫ</span>
            <span className={styles.titleLine}>
              <span className={styles.joinLetter} aria-hidden="true">
                &
              </span>{' '}
              приложения
            </span>
            <span className={styles.titleLine}>
              для <span className={styles.accentWord}>бизнеса</span>
            </span>
          </h1>
          <p className={styles.text}>
            Если вам нужен результат, а не просто красивый дизайн, то вы по адресу.
          </p>
          <div className={styles.actions} aria-label="Основные действия">
            <StudioButton href="#cta" variant="mint">
              Получить консультацию
            </StudioButton>
            <StudioButton href="#projects" variant="peach">
              Наши работы
            </StudioButton>
          </div>
        </div>

        <div className={styles.visual}>
          <Image
            className={styles.image}
            src="/images/razrabotka/hero-new.webp"
            alt="Изометрическая иллюстрация сайта, CRM и аналитики"
            width={1024}
            height={1536}
            priority
            sizes="(max-width: 767px) 108vw, (max-width: 1279px) 56vw, 700px"
          />
        </div>
      </div>
    </section>
  )
}
