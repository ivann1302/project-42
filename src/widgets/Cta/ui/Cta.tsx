'use client'

import { useRef, useState } from 'react'
import { Button, Container, Modal, StarField } from '@/shared/ui'
import { ContactForm } from '@/features/ContactForm'
import { useScrollReveal } from '@/shared/lib'
import styles from './Cta.module.scss'

type Props = {
  eyebrow?: string
  heading?: string
  sub?: string
  buttonText?: string
  modalTitle?: string
}

export function Cta({
  eyebrow = 'Готовы начать?',
  heading = 'Сейчас мы открыты\nдля 1–2 новых проектов',
  sub = 'Расскажите о задаче — решим, подходим ли мы друг другу. Это бесплатно.',
  buttonText = 'Забронировать место',
  modalTitle = 'Обсудить проект',
}: Props) {
  const innerRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  useScrollReveal(innerRef, { threshold: 0.2 })

  return (
    <section ref={innerRef} className={styles.root} id="cta">
      <StarField />
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />
      <div className={styles.blob3} aria-hidden="true" />
      <Container className={styles.inner}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.heading}>
          {heading.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h2>
        <p className={styles.sub}>{sub}</p>
        <div className={styles.buttonWrap}>
          <Button size="lg" onClick={() => setOpen(true)}>
            {buttonText}
          </Button>
        </div>
      </Container>

      <Modal open={open} onClose={() => setOpen(false)} title={modalTitle}>
        <ContactForm onSuccess={() => setOpen(false)} />
      </Modal>
    </section>
  )
}
