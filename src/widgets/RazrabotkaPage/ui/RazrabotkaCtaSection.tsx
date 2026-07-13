'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useScrollReveal } from '@/shared/lib'
import { StudioButton } from '@/shared/ui'
import styles from './RazrabotkaCtaSection.module.scss'

type Props = {
  light?: boolean
}

export function RazrabotkaCtaSection({ light = false }: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.22, rootMargin: '0px 0px -12% 0px' })

  return (
    <section
      ref={sectionRef}
      className={[styles.root, light && styles.light].filter(Boolean).join(' ')}
      id="cta"
      aria-labelledby="razrabotka-cta-title"
    >
      <span className={styles.contactsAnchor} id="contacts" aria-hidden="true" />
      <div className={styles.shell}>
        <div className={styles.visual}>
          <Image
            className={styles.image}
            src="/images/razrabotka/cta-image.webp"
            alt=""
            width={680}
            height={700}
            sizes="(max-width: 767px) 86vw, (max-width: 1023px) 620px, 46vw"
            aria-hidden="true"
          />
        </div>

        <div className={styles.content}>
          <h2 className={styles.title} id="razrabotka-cta-title">
            <span>Есть задача?</span>
            <span className={styles.accentWord}>Давайте обсудим</span>
          </h2>
          <p className={styles.text}>
            Расскажите немного о проекте — мы уточним детали и предложим подходящий формат работы.
          </p>
          <div className={styles.actions} aria-label="Действия CTA">
            <StudioButton
              className={styles.primaryButton}
              href="#contacts"
              variant="yellow"
              icon={null}
            >
              Обсудить проект
            </StudioButton>
            <StudioButton
              className={styles.secondaryButton}
              href="#projects"
              variant="outline"
              icon="externalLink"
            >
              Смотреть кейсы
            </StudioButton>
          </div>
        </div>
      </div>
    </section>
  )
}
