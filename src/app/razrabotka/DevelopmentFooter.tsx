'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import styles from './DevelopmentFooter.module.scss'

export function DevelopmentFooter() {
  const revealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reveal = revealRef.current
    if (!reveal) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const update = () => {
      frame = 0
      if (reducedMotion.matches) {
        reveal.style.removeProperty('--footer-offset')
        return
      }

      // Measure the stationary wrapper so the transform cannot affect its own progress.
      const bounds = reveal.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const range = Math.max(1, Math.min(bounds.height, viewportHeight))
      const progress = Math.min(1, Math.max(0, (viewportHeight - bounds.top) / range))
      const strength = window.innerWidth <= 767 ? 0.22 : 0.4
      const travel = Math.min(bounds.height * strength, viewportHeight * 0.18)
      reveal.style.setProperty('--footer-offset', `${((1 - progress) * travel).toFixed(2)}px`)
    }

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    const resizeObserver = new ResizeObserver(requestUpdate)
    resizeObserver.observe(reveal)
    // FAQ answers above the footer can change the page height without a window resize.
    if (reveal.parentElement) resizeObserver.observe(reveal.parentElement)
    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    reducedMotion.addEventListener('change', requestUpdate)

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      reducedMotion.removeEventListener('change', requestUpdate)
      reveal.style.removeProperty('--footer-offset')
    }
  }, [])

  return (
    <div className={styles.reveal} ref={revealRef}>
      <footer className={styles.root} id="footer" aria-label="Project 42 — футер">
        <div className={styles.brand}>
          <Link className={styles.logo} href="#top" aria-label="Project 42 — к началу страницы">
            Project 42
          </Link>
          <p className={styles.tagline}>Поможем вам реализовать проект любой сложности</p>
        </div>
        <nav aria-label="Ссылки в футере">
          <ul className={styles.links}>
            <li>
              <Link href="/portfolio" prefetch={false}>
                Наши работы
              </Link>
            </li>
            <li>
              <a href="https://t.me/ivann97n" target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
            </li>
            <li>
              <a href="mailto:project42studio@gmail.com">Почта</a>
            </li>
          </ul>
        </nav>
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Project 42</p>
          <Link href="/privacy-policy" prefetch={false}>
            Конфиденциальность
          </Link>
          <Link href="/offer" prefetch={false}>
            Оферта
          </Link>
        </div>
      </footer>
    </div>
  )
}
