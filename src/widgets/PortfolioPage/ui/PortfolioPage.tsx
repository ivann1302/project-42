'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Container, Button, Icon, Modal } from '@/shared/ui'
import { StarField } from '@/shared/ui'
import { ContactForm } from '@/features/ContactForm'
import { projects } from '@/entities/Project'
import styles from './PortfolioPage.module.scss'

export function PortfolioPage() {
  const [open, setOpen] = useState(false)

  return (
    <section className={styles.root} id="portfolio">
      <StarField />
      <Container className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Наши работы</span>
          <h1 className={styles.heading}>Портфолио</h1>
          <p className={styles.subtitle}>Проекты, которые мы сделали и продолжаем поддерживать</p>
        </div>

        <ul className={styles.list} role="list">
          {projects.map((project, index) => {
            const isEven = (index + 1) % 2 === 0
            return (
              <li
                key={project.id}
                id={project.id}
                className={[styles.row, isEven && styles.reversed].filter(Boolean).join(' ')}
              >
                <div className={styles.text}>
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
                  <Button
                    variant="secondary"
                    href={project.href}
                    target="_blank"
                    className={styles.link}
                  >
                    Посмотреть сайт
                    <Icon name="externalLink" size={16} className={styles.icon} />
                  </Button>
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

        <div className={styles.cta}>
          <p className={styles.ctaHeading}>Понравились работы?</p>
          <p className={styles.ctaSub}>
            Хотите так же или хотите чтобы мы рассказали больше — оставьте заявку
          </p>
          <Button onClick={() => setOpen(true)}>Оставить заявку</Button>
        </div>
      </Container>

      <Modal open={open} onClose={() => setOpen(false)} title="Оставить заявку">
        <ContactForm onSuccess={() => setOpen(false)} />
      </Modal>
    </section>
  )
}
