'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { Icon, Modal, StudioButton } from '@/shared/ui'
import { ContactForm } from '@/features/ContactForm'
import { projects } from '@/entities/Project'
import { useScrollReveal } from '@/shared/lib'
import styles from './PortfolioPage.module.scss'

export function PortfolioPage() {
  const ctaRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useScrollReveal(ctaRef, { threshold: 0.22, rootMargin: '0px 0px -12% 0px' })

  return (
    <section className={styles.root} id="portfolio">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Наши работы</p>
          <h1 className={styles.heading}>
            <span>Порт</span>
            <span className={styles.outlineWord}>фолио</span>
          </h1>
          <p className={styles.subtitle}>
            Проекты, где структура, дизайн и разработка собраны в понятный бизнес-инструмент.
          </p>
        </div>

        <ul className={styles.list} role="list">
          {projects.map((project, index) => {
            const isEven = (index + 1) % 2 === 0
            return (
              <li
                key={project.id}
                id={project.id}
                className={clsx(styles.row, isEven && styles.reversed)}
              >
                <div className={styles.text}>
                  <p className={styles.index}>{String(index + 1).padStart(2, '0')}</p>
                  <ul className={styles.tags} role="list">
                    {project.tags.map((tag) => (
                      <li key={tag} className={styles.tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <h2 className={styles.title}>{project.title}</h2>
                  <p className={styles.description}>{project.description}</p>
                  {project.achievements && (
                    <ul className={styles.achievements} role="list">
                      {project.achievements.map((item) => (
                        <li key={item} className={styles.achievement}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {project.href && (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    Посмотреть сайт
                    <Icon name="externalLink" size={16} className={styles.icon} />
                  </a>
                )}

                <div className={styles.mockups}>
                  <div className={styles.desktop}>
                    {project.desktopImageUrl ? (
                      <Image
                        src={project.desktopImageUrl}
                        alt={`${project.title} — десктоп`}
                        width={1920}
                        height={1080}
                        className={styles.mockupImg}
                        sizes="(max-width: 768px) 100vw, 60vw"
                        priority={index === 0}
                      />
                    ) : (
                      <div className={styles.placeholder} />
                    )}
                  </div>
                  <div className={styles.mobile}>
                    {project.mobileImageUrl ? (
                      <Image
                        src={project.mobileImageUrl}
                        alt={`${project.title} — мобильный`}
                        width={372}
                        height={807}
                        className={styles.mockupImg}
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    ) : (
                      <div className={styles.placeholder} />
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <div ref={ctaRef} className={styles.cta}>
          <div className={styles.ctaShell}>
            <div className={styles.ctaVisual}>
              <Image
                className={styles.ctaImage}
                src="/images/razrabotka/cta-image.webp"
                alt=""
                width={680}
                height={700}
                sizes="(max-width: 767px) 86vw, (max-width: 1023px) 620px, 46vw"
                aria-hidden="true"
              />
            </div>

            <div className={styles.ctaContent}>
              <p className={styles.ctaKicker}>Готовы к результатам?</p>
              <p className={styles.ctaHeading}>
                <span>Давайте обсудим</span>
                <span className={styles.ctaAccentWord}>ваш проект</span>
              </p>
              <p className={styles.ctaSub}>
                Оставьте заявку и получите бесплатную консультацию. Разберём задачу и предложим
                оптимальное решение.
              </p>
              <div className={styles.ctaActions} aria-label="Действия CTA">
                <StudioButton
                  className={styles.ctaPrimaryButton}
                  variant="yellow"
                  icon={null}
                  onClick={() => setOpen(true)}
                >
                  Оставить заявку
                </StudioButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Оставить заявку">
        <ContactForm onSuccess={() => setOpen(false)} />
      </Modal>
    </section>
  )
}
