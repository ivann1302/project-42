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
    const hero = document.getElementById('hero')

    if (!hero) {
      const timeoutId = window.setTimeout(() => setVisible(true), 5000)

      return () => window.clearTimeout(timeoutId)
    }

    const updateVisibility = () => {
      setVisible(hero.getBoundingClientRect().bottom <= 0)
    }

    updateVisibility()

    const observer = new IntersectionObserver(updateVisibility, { threshold: 0 })
    observer.observe(hero)
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
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
