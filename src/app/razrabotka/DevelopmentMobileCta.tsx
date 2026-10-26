'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { ShinyButton } from '@/components/ui/ShinyButton'
import { Modal } from '@/shared/ui/Modal/Modal'
import contactModalStyles from './DevelopmentContactModal.module.scss'
import styles from './DevelopmentMobileCta.module.scss'

const ContactForm = dynamic(() =>
  import('@/features/ContactForm/ui/ContactForm').then((module) => module.ContactForm),
)

export function DevelopmentMobileCta() {
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const wasContactOpen = useRef(false)
  const [pastHero, setPastHero] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return

    const mobile = window.matchMedia('(max-width: 767px)')
    const update = () => setPastHero(mobile.matches && hero.getBoundingClientRect().bottom < 0)
    const observer = new IntersectionObserver(([entry]) => {
      setPastHero(mobile.matches && !entry.isIntersecting && entry.boundingClientRect.bottom < 0)
    })

    observer.observe(hero)
    mobile.addEventListener('change', update)
    update()

    return () => {
      observer.disconnect()
      mobile.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    if (contactOpen) {
      wasContactOpen.current = true
      rootRef.current?.querySelector<HTMLButtonElement>('[aria-label="Закрыть"]')?.focus()
    } else if (wasContactOpen.current) {
      wasContactOpen.current = false
      buttonRef.current?.focus({ preventScroll: true })
    }
  }, [contactOpen])

  const closeContact = () => {
    setContactOpen(false)
  }

  return (
    <div
      ref={rootRef}
      onKeyDown={(event) => {
        if (!contactOpen || event.key !== 'Tab') return
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            '[role="dialog"] :is(a[href], button, input, textarea, select, [tabindex])',
          ),
        ).filter(
          (element) =>
            element.tabIndex >= 0 &&
            !element.matches(':disabled') &&
            element.getClientRects().length,
        )
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }}
    >
      <div className={styles.root} data-development-mobile-cta data-visible={pastHero}>
        <ShinyButton
          ref={buttonRef}
          className={styles.button}
          label="Получить консультацию"
          onClick={() => setContactOpen(true)}
        />
      </div>
      <Modal
        open={contactOpen}
        onClose={closeContact}
        title="Получить консультацию"
        className={contactModalStyles.modal}
      >
        <ContactForm onSuccess={closeContact} />
      </Modal>
    </div>
  )
}
