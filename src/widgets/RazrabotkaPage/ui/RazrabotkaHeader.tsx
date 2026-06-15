'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Icon } from '@/shared/ui'
import styles from './RazrabotkaHeader.module.scss'

const SCROLL_THRESHOLD = 24

const navLinks = [
  { label: 'Услуги', href: '#services' },
  { label: 'Проекты', href: '#projects' },
  { label: 'О нас', href: '#about' },
  { label: 'Этапы', href: '#process' },
  { label: 'Контакты', href: '#contacts' },
] as const

export function RazrabotkaHeader() {
  const [isPinned, setIsPinned] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const updateHeaderState = () => {
      setIsPinned(window.scrollY > SCROLL_THRESHOLD)
    }

    updateHeaderState()
    window.addEventListener('scroll', updateHeaderState, { passive: true })

    return () => window.removeEventListener('scroll', updateHeaderState)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className={clsx(styles.root, isPinned && styles.pinned, menuOpen && styles.menuOpen)}
      data-testid="razrabotka-header"
    >
      <div className={styles.shell}>
        <div className={styles.bar}>
          <a className={styles.logo} href="/razrabotka-sayta" onClick={closeMenu}>
            <span className={styles.logoTitle}>
              <span>Project</span>
              <span className={styles.logoNumber}>42</span>
            </span>
            <span className={styles.logoCaption}>Веб-студия</span>
          </a>

          <nav className={styles.nav} id="razrabotka-header-menu" aria-label="Основная навигация">
            {navLinks.map((link) => (
              <a key={link.href} className={styles.navLink} href={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            ))}
            <a className={styles.mobileCta} href="#cta" onClick={closeMenu}>
              Обсудить проект
              <Icon name="externalLink" size={16} />
            </a>
          </nav>

          <a className={styles.cta} href="#cta">
            Обсудить проект
            <Icon name="externalLink" size={16} />
          </a>

          <button
            className={styles.burger}
            type="button"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-controls="razrabotka-header-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </button>
        </div>
      </div>
    </header>
  )
}
