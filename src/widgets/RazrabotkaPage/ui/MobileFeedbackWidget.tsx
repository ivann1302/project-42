'use client'

import { useEffect, useState } from 'react'
import { ContactForm } from '@/features/ContactForm'
import { Icon } from '@/shared/ui'
import styles from './MobileFeedbackWidget.module.scss'

export function MobileFeedbackWidget() {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const trigger = document.querySelector<HTMLElement>('[data-feedback-trigger]')
    const mediaQuery =
      typeof window.matchMedia === 'function' ? window.matchMedia('(max-width: 767px)') : null

    if (!trigger) return

    const isMobile = () => (mediaQuery ? mediaQuery.matches : window.innerWidth < 768)

    const updateVisibility = () => {
      const shouldShow =
        isMobile() && trigger.getBoundingClientRect().top <= window.innerHeight * 0.7

      setVisible(shouldShow)
      if (!shouldShow) setOpen(false)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)
    mediaQuery?.addEventListener?.('change', updateVisibility)

    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
      mediaQuery?.removeEventListener?.('change', updateVisibility)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={styles.root}>
      {open && (
        <div className={styles.panel} role="dialog" aria-label="Форма обратной связи">
          <div className={styles.panelHeader}>
            <p className={styles.panelTitle}>Обратная связь</p>
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Закрыть форму обратной связи"
              onClick={() => setOpen(false)}
            >
              <Icon name="close" size={18} />
            </button>
          </div>
          <ContactForm onSuccess={() => setOpen(false)} />
        </div>
      )}

      <button
        type="button"
        className={styles.trigger}
        aria-label={open ? 'Закрыть форму обратной связи' : 'Открыть форму обратной связи'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name={open ? 'close' : 'messageCircle'} size={26} />
      </button>
    </div>
  )
}
