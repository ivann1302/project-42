'use client'

import type { CSSProperties } from 'react'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Icon, SOCIAL_LINKS } from '@/shared/ui'
import styles from './RazrabotkaChatButton.module.scss'

const TRIGGER_SECTION_ID = 'decision-window'

export function RazrabotkaChatButton() {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)

  const updateVisibility = useCallback(() => {
    const trigger = document.getElementById(TRIGGER_SECTION_ID)

    if (!trigger) {
      setVisible(false)
      setOpen(false)
      return
    }

    const triggerBottom = trigger.getBoundingClientRect().bottom
    const nextVisible = window.scrollY > 0 && triggerBottom <= window.innerHeight * 0.88

    setVisible(nextVisible)

    if (!nextVisible) {
      setOpen(false)
    }
  }, [])

  useEffect(() => {
    updateVisibility()

    const handleScroll = () => {
      updateVisibility()
      setOpen(false)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateVisibility)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [updateVisibility])

  if (!visible) {
    return null
  }

  return (
    <div className={`${styles.root} ${open ? styles.open : ''}`}>
      <div className={styles.links} aria-hidden={!open}>
        {SOCIAL_LINKS.map((link, index) => (
          <a
            key={link.label}
            className={styles.link}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            style={{ '--chat-link-index': index } as CSSProperties}
          >
            <Image
              src={link.icon}
              alt=""
              width={28}
              height={28}
              className={styles.icon}
              aria-hidden="true"
            />
            <span>{link.label}</span>
          </a>
        ))}
      </div>

      <a
        className={`${styles.button} ${styles.mobileButton}`}
        href="#cta"
        onClick={() => setOpen(false)}
      >
        <span className={styles.buttonLabel}>Получить консультацию</span>
      </a>

      <button
        className={`${styles.button} ${styles.desktopButton}`}
        type="button"
        aria-label={open ? 'Закрыть чат' : 'Открыть чат'}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={styles.buttonLabel}>Получить консультацию</span>
        <span className={styles.buttonIcon} aria-hidden="true">
          <Icon name={open ? 'close' : 'messageCircle'} size={26} />
        </span>
      </button>
    </div>
  )
}
