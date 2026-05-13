'use client'

import { useEffect, useState } from 'react'
import { ContactForm } from '@/features/ContactForm'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import styles from './MobileConsultationButton.module.scss'

export function MobileConsultationButton() {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setVisible(true), 5000)

    return () => window.clearTimeout(timeoutId)
  }, [])

  if (!visible) return null

  return (
    <>
      <div className={styles.root}>
        <Button size="lg" className={styles.button} onClick={() => setOpen(true)}>
          Заказать консультацию
        </Button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Заказать консультацию">
        <ContactForm onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  )
}
