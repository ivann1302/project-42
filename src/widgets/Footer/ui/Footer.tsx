'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Container, Button, Modal } from '@/shared/ui'
import { ContactForm } from '@/features/ContactForm'
import styles from './Footer.module.scss'

const NAV_LINKS = [
  { label: 'Услуги', href: '/#services' },
  { label: 'Как работаем', href: '/#process' },
  { label: 'Портфолио', href: '/portfolio' },
  { label: 'Цены', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
]

export function Footer() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <footer className={styles.root}>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Заказать консультацию">
        <ContactForm onSuccess={() => setModalOpen(false)} />
      </Modal>
      <Container className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              Project<span className={styles.accent}>42</span>
            </Link>
            <p className={styles.tagline}>Не ещё одна веб-студия</p>
          </div>

          <nav className={styles.nav} aria-label="Навигация в подвале">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
            Заказать консультацию
          </Button>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>© {new Date().getFullYear()} Project 42</p>
          <p className={styles.copy}>Решаем задачи бизнеса</p>
        </div>
      </Container>
    </footer>
  )
}
