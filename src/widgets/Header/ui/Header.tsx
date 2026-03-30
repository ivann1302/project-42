'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button, Container, Icon } from '@/shared/ui'
import styles from './Header.module.scss'

const NAV_LINKS = [
  { label: 'Услуги', href: '#services' },
  { label: 'Как работаем', href: '#process' },
  { label: 'Портфолио', href: '#portfolio' },
  { label: 'Цены', href: '#pricing' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={[styles.root, scrolled && styles.scrolled].filter(Boolean).join(' ')}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Project<span className={styles.accent}>42</span>
        </Link>

        <nav className={[styles.nav, menuOpen && styles.navOpen].filter(Boolean).join(' ')}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.navLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button size="sm" href="#cta" className={styles.cta}>
          Обсудить проект
        </Button>

        <button
          className={styles.burger}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Меню"
          aria-expanded={menuOpen}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
        </button>
      </Container>
    </header>
  )
}
