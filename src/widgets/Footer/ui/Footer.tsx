'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Container, Button, Modal, SocialLinks } from '@/shared/ui'
import { ContactForm } from '@/features/ContactForm'
import styles from './Footer.module.scss'

const RAZRABOTKA_PATH = '/razrabotka-sayta'

const NAV_LINKS = [
  { label: 'Разработка сайтов', href: RAZRABOTKA_PATH },
  { label: 'Как работаем', href: '/#process' },
  { label: 'Портфолио', href: '/portfolio' },
  { label: 'Блог', href: '/blog' },
  { label: 'Цены', href: '/#pricing' },
]

export function Footer() {
  const pathname = usePathname()
  const isPortfolioPage = pathname === '/portfolio'
  const logoHref = isPortfolioPage ? RAZRABOTKA_PATH : '/'
  const navLinks = NAV_LINKS.map((link) => ({
    ...link,
    href:
      isPortfolioPage && link.href.startsWith('/#')
        ? `${RAZRABOTKA_PATH}${link.href.slice(1)}`
        : link.href,
  }))
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <footer className={styles.root}>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Заказать консультацию">
        <ContactForm onSuccess={() => setModalOpen(false)} />
      </Modal>
      <Container className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href={logoHref} className={styles.logo}>
              Project<span className={styles.logoNumber}>42</span>
            </Link>
            <p className={styles.tagline}>Не ещё одна веб-студия</p>
            <SocialLinks className={styles.socials} />
          </div>

          <nav className={styles.nav} aria-label="Навигация в подвале">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.ctaPanel}>
            <p className={styles.ctaTitle}>Обсудим проект?</p>
            <p className={styles.ctaText}>Коротко разберём задачу и подскажем следующий шаг.</p>
            <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
              Заказать консультацию
            </Button>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {new Date().getFullYear()} Project <span className={styles.logoNumber}>42</span>
          </p>
          <div className={styles.legalInfo}>
            <address className={styles.ownerInfo}>
              Самозанятый Нарчук Иван Валериевич · email project42studio@gmail.com · ИНН
              300103507979
            </address>
            <div className={styles.legalLinks}>
              <Link href="/privacy-policy" className={styles.legalLink}>
                Политика конфиденциальности
              </Link>
              <Link href="/offer" className={styles.legalLink}>
                Договор-оферта
              </Link>
            </div>
          </div>
          <p className={styles.copy}>Решаем задачи бизнеса</p>
        </div>
      </Container>
    </footer>
  )
}
