'use client'

import { useState } from 'react'
import { Button, Container, Modal, StarField } from '@/shared/ui'
import { ContactForm } from '@/features/ContactForm'
import styles from './Cta.module.scss'

export function Cta() {
  const [open, setOpen] = useState(false)

  return (
    <section className={styles.root} id="cta">
      <StarField />
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />
      <div className={styles.blob3} aria-hidden="true" />
      <Container className={styles.inner}>
        <p className={styles.eyebrow}>Готовы начать?</p>
        <h2 className={styles.heading}>
          Сейчас мы открыты
          <br />
          для 1–2 новых проектов
        </h2>
        <p className={styles.sub}>
          Расскажите о задаче — решим, подходим ли мы друг другу. Это бесплатно.
        </p>
        <Button size="lg" onClick={() => setOpen(true)}>
          Забронировать место
        </Button>
      </Container>

      <Modal open={open} onClose={() => setOpen(false)} title="Обсудить проект">
        <ContactForm onSuccess={() => setOpen(false)} />
      </Modal>
    </section>
  )
}
