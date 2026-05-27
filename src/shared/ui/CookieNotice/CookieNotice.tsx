'use client'

import { useEffect, useState } from 'react'
import { Button } from '../Button'
import { Icon } from '../Icon'
import styles from './CookieNotice.module.scss'

const STORAGE_KEY = 'webstudio-cookie-notice-accepted'

export function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    try {
      setIsVisible(window.localStorage.getItem(STORAGE_KEY) !== 'true')
    } catch {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // The notice can still be dismissed for the current session.
    }

    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <section className={styles.root} role="region" aria-label="Уведомление о cookie">
      <span className={styles.icon} aria-hidden>
        <Icon name="shield" size={20} />
      </span>
      <p className={styles.text}>
        Используем cookie и Яндекс Метрику, чтобы понимать, как пользуются сайтом, и улучшать его.
      </p>
      <Button variant="secondary" size="sm" className={styles.action} onClick={handleAccept}>
        Понятно
      </Button>
    </section>
  )
}
