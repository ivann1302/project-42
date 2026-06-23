'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import styles from './CookieNotice.module.scss'

const STORAGE_KEY = 'webstudio-cookie-notice-accepted'
const HIDDEN_PATHS = new Set(['/', '/razrabotka-sayta', '/geo-aeo-prodvizhenie'])

export function CookieNotice() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const isHiddenPage = HIDDEN_PATHS.has(pathname)

  useEffect(() => {
    if (isHiddenPage) {
      setIsVisible(false)
      return
    }

    try {
      setIsVisible(window.localStorage.getItem(STORAGE_KEY) !== 'true')
    } catch {
      setIsVisible(true)
    }
  }, [isHiddenPage])

  const handleAccept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // The notice can still be dismissed for the current session.
    }

    setIsVisible(false)
  }

  if (isHiddenPage || !isVisible) return null

  return (
    <section className={styles.root} role="region" aria-label="Уведомление о cookie">
      <div className={styles.content}>
        <h2 className={styles.title}>Cookies</h2>
        <p className={styles.text}>
          Используем cookie и Яндекс Метрику, чтобы понимать, как пользуются сайтом, и улучшать его.
        </p>
      </div>
      <button className={styles.action} type="button" onClick={handleAccept}>
        Понятно
      </button>
    </section>
  )
}
