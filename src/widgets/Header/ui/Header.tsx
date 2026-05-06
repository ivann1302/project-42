'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Button, Container, Icon, Modal, SocialLinks } from '@/shared/ui'
import { ContactForm } from '@/features/ContactForm'
import styles from './Header.module.scss'

const NAV_LINKS = [
  { label: 'Услуги', href: '#services' },
  { label: 'Разработка лендингов', href: '/razrabotka-sayta' },
  { label: 'Как работаем', href: '#process' },
  { label: 'Портфолио', href: '/portfolio' },
  { label: 'Цены', href: '#pricing' },
]

const RAZRABOTKA_NAV_LINKS = [
  { label: 'Как работаем', href: '#process' },
  { label: 'Проекты', href: '#portfolio' },
  { label: 'Цены', href: '#pricing' },
  { label: 'Обсудить', href: '#cta' },
]

export function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isRazrabotkaPage = pathname === '/razrabotka-sayta'
  const navLinks = isRazrabotkaPage ? RAZRABOTKA_NAV_LINKS : NAV_LINKS
  const logoHref = isRazrabotkaPage ? '#hero' : '/'
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

    const sectionIds = navLinks
      .map((link) => link.href.replace('#', ''))
      .filter((id) => !id.startsWith('/'))

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [navLinks])

  return (
    <>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Обсудить проект">
        <ContactForm onSuccess={() => setModalOpen(false)} />
      </Modal>
      <header className={clsx(styles.root, scrolled && !menuOpen && styles.scrolled)}>
        <Container className={styles.inner}>
          <Link href={logoHref} className={styles.logo} onClick={() => setMenuOpen(false)}>
            Project<span className={styles.accent}>42</span>
          </Link>

          <nav className={clsx(styles.nav, menuOpen && styles.navOpen)}>
            {navLinks.map((link) =>
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
                  href={isHome || isRazrabotkaPage ? link.href : `/${link.href}`}
                  className={clsx(
                    styles.navLink,
                    activeSection === link.href.replace('#', '') && styles.navLinkActive,
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ),
            )}
            <div className={styles.mobileSocials}>
              <SocialLinks onLinkClick={() => setMenuOpen(false)} />
            </div>
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

          <div className={styles.headerSocials}>
            <SocialLinks />
          </div>
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
