'use client'

import Image from 'next/image'
import { useRef } from 'react'
import type { ArticleCta as ArticleCtaData } from '@/entities/Article'
import { useScrollReveal } from '@/shared/lib'
import { StudioButton } from '@/shared/ui'
import styles from './ArticleCta.module.scss'

type Props = {
  cta: ArticleCtaData
}

export function ArticleCta({ cta }: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.22, rootMargin: '0px 0px -12% 0px' })

  return (
    <section ref={sectionRef} className={styles.root} aria-labelledby="article-cta-title">
      <div className={styles.shell}>
        <div className={styles.visual}>
          <Image
            className={styles.image}
            src={cta.image.src}
            alt={cta.image.alt}
            width={680}
            height={700}
            sizes="(max-width: 767px) 86px, (max-width: 1023px) 620px, 46vw"
            aria-hidden={cta.image.alt ? undefined : true}
          />
        </div>

        <div className={styles.content}>
          <p className={styles.kicker}>{cta.kicker}</p>
          <h2 className={styles.title} id="article-cta-title">
            <span>{cta.title}</span>
            <span className={styles.accentWord}>{cta.accent}</span>
          </h2>
          <p className={styles.text}>{cta.text}</p>
          <div className={styles.actions} aria-label="Действия CTA">
            <StudioButton
              className={styles.primaryButton}
              href={cta.primary.href}
              variant="yellow"
              icon={null}
            >
              {cta.primary.label}
            </StudioButton>
            {cta.secondary ? (
              <StudioButton
                className={styles.secondaryButton}
                href={cta.secondary.href}
                variant="outline"
                icon="externalLink"
              >
                {cta.secondary.label}
              </StudioButton>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
