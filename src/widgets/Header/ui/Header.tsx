'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button, Container, Icon, Modal } from '@/shared/ui'
import { ContactForm } from '@/features/ContactForm'
import styles from './Header.module.scss'

const NAV_LINKS = [
  { label: 'Услуги', href: '#services' },
  { label: 'Как работаем', href: '#process' },
  { label: 'Портфолио', href: '/portfolio' },
  { label: 'Цены', href: '#pricing' },
]

const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace('#', '')).filter(
  (id) => !id.startsWith('/'),
)

export function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Обсудить проект">
        <ContactForm onSuccess={() => setModalOpen(false)} />
      </Modal>
      <header className={[styles.root, scrolled && styles.scrolled].filter(Boolean).join(' ')}>
        <Container className={styles.inner}>
          <Link href="/" className={styles.logo}>
            Project<span className={styles.accent}>42</span>
          </Link>

          <nav className={[styles.nav, menuOpen && styles.navOpen].filter(Boolean).join(' ')}>
            {NAV_LINKS.map((link) =>
              link.href.startsWith('/') ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.navLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={isHome ? link.href : `/${link.href}`}
                  className={[
                    styles.navLink,
                    activeSection === link.href.replace('#', '') && styles.navLinkActive,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ),
            )}
            <Button
              size="md"
              onClick={() => {
                setModalOpen(true)
                setMenuOpen(false)
              }}
              className={styles.mobileCtaInNav}
            >
              Обсудить проект
            </Button>
          </nav>

          <Button size="sm" onClick={() => setModalOpen(true)} className={styles.cta}>
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
    </>
  )
}
