'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container, SectionTitle, StarField, Button, Modal } from '@/shared/ui'
import { ContactForm } from '@/features/ContactForm'
import { projects } from '@/entities/Project'
import styles from './Portfolio.module.scss'

export function Portfolio() {
  const [open, setOpen] = useState(false)

  return (
    <section className={styles.root} id="portfolio">
      <StarField />
      <Container>
        <SectionTitle eyebrow="Наши работы" align="center">
          Проекты
        </SectionTitle>
        <ul className={styles.grid} role="list">
          {projects.map((project) => (
            <li key={project.id} className={styles.card}>
              <Link href={`/portfolio#${project.id}`} className={styles.cardLink}>
                <div className={styles.image}>
                  {project.desktopImageUrl ? (
                    <Image
                      src={project.desktopImageUrl}
                      alt={project.title}
                      fill
                      className={styles.img}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className={styles.placeholder} />
                  )}
                </div>
                <div className={styles.meta}>
                  <h3 className={styles.title}>{project.title}</h3>
                  <ul className={styles.tags} role="list">
                    {project.tags.map((tag) => (
                      <li key={tag} className={styles.tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className={styles.hoverLabel} aria-hidden="true">
                  Смотреть проект →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.footer}>
          <Button variant="secondary" href="/portfolio">
            Перейти в портфолио
          </Button>
        </div>

        <div className={styles.cta}>
          <p className={styles.ctaHeading}>Понравились работы?</p>
          <p className={styles.ctaSub}>Хотите похожий проект? Расскажите о задаче — обсудим.</p>
          <Button onClick={() => setOpen(true)}>Оставить заявку</Button>
        </div>
      </Container>

      <Modal open={open} onClose={() => setOpen(false)} title="Оставить заявку">
        <ContactForm onSuccess={() => setOpen(false)} />
      </Modal>
    </section>
  )
}
