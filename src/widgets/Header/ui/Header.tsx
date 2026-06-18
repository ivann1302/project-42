'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Icon } from '@/shared/ui'
import styles from './Header.module.scss'

const SCROLL_THRESHOLD = 24
const RAZRABOTKA_PATH = '/razrabotka-sayta'

const navLinks = [
  { label: 'Услуги', href: '#services' },
  { label: 'Проекты', href: '#projects' },
  { label: 'О нас', href: '#about' },
  { label: 'Этапы', href: '#process' },
  { label: 'Контакты', href: '#contacts' },
] as const

function getSectionHref(pathname: string, hash: string) {
  return pathname === RAZRABOTKA_PATH ? hash : `${RAZRABOTKA_PATH}${hash}`
}

export function Header() {
  const pathname = usePathname()
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
  const ctaHref = getSectionHref(pathname, '#cta')

  return (
    <header
      className={clsx(styles.root, isPinned && styles.pinned, menuOpen && styles.menuOpen)}
      data-testid="site-header"
    >
      <div className={styles.shell}>
        <div className={styles.bar}>
          <Link className={styles.logo} href="/" onClick={closeMenu}>
            <span className={styles.logoTitle}>
              <span>Project</span>
              <span className={styles.logoNumber}>42</span>
            </span>
            <span className={styles.logoCaption}>Веб-студия</span>
          </Link>

          <nav className={styles.nav} id="site-header-menu" aria-label="Основная навигация">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className={styles.navLink}
                href={getSectionHref(pathname, link.href)}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <Link className={styles.mobileCta} href={ctaHref} onClick={closeMenu}>
              Обсудить проект
              <Icon name="externalLink" size={16} />
            </Link>
          </nav>

          <Link className={styles.cta} href={ctaHref}>
            Обсудить проект
            <Icon name="externalLink" size={16} />
          </Link>

          <button
            className={styles.burger}
            type="button"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-controls="site-header-menu"
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
