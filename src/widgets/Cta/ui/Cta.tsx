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
          Давайте создадим ваш
          <br />
          следующий проект
        </h2>
        <p className={styles.sub}>Расскажите о задаче — обсудим, как её решить</p>
        <Button size="lg" onClick={() => setOpen(true)}>
          Обсудить проект
        </Button>
      </Container>

      <Modal open={open} onClose={() => setOpen(false)} title="Обсудить проект">
        <ContactForm onSuccess={() => setOpen(false)} />
      </Modal>
    </section>
  )
}
