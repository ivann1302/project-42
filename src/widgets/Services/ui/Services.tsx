'use client'

import { useRef, useState } from 'react'
import { Button, Container, GlowBlob, IconCard, Modal, SectionTitle, StarField } from '@/shared/ui'
import { ContactForm } from '@/features/ContactForm'
import { useScrollReveal } from '@/shared/lib'
import { services } from '@/entities/Service'
import styles from './Services.module.scss'

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  useScrollReveal(sectionRef, { threshold: 0.1 })

  return (
    <section ref={sectionRef} className={styles.root} id="services">
      <StarField />
      <GlowBlob color="blue" size={1000} />
      <Container>
        <SectionTitle eyebrow="Что мы делаем" align="center">
          Полный цикл разработки
        </SectionTitle>
        <ul className={styles.grid} role="list">
          {services.map((service, idx) => (
            <IconCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
              style={{ '--i': idx } as React.CSSProperties}
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
