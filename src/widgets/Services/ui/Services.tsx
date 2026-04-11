'use client'

import { useEffect, useRef, useState } from 'react'
import { Button, Container, GlowBlob, IconCard, Modal, SectionTitle, StarField } from '@/shared/ui'
import { ContactForm } from '@/features/ContactForm'
import { services } from '@/entities/Service'
import styles from './Services.module.scss'

export function Services() {
  const gridRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.visible)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.root} id="services">
      <StarField />
      <GlowBlob color="blue" size={1000} />
      <Container>
        <SectionTitle eyebrow="Что мы делаем" align="center">
          Полный цикл разработки
        </SectionTitle>
        <ul ref={gridRef} className={styles.grid} role="list">
          {services.map((service) => (
            <IconCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </ul>
        <div className={styles.cta}>
          <p className={styles.ctaText}>
            Не знаете, с чего начать? Проконсультируем по любой из услуг — бесплатно и без
            обязательств.
          </p>
          <Button size="lg" onClick={() => setOpen(true)}>
            Получить консультацию
          </Button>
        </div>
      </Container>

      <Modal open={open} onClose={() => setOpen(false)} title="Получить консультацию">
        <ContactForm onSuccess={() => setOpen(false)} />
      </Modal>
    </section>
  )
}
