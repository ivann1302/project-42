import Link from 'next/link'
import { Container, Icon } from '@/shared/ui'
import styles from './Footer.module.scss'

const NAV_LINKS = [
  { label: 'Услуги', href: '#services' },
  { label: 'Как работаем', href: '#process' },
  { label: 'Портфолио', href: '/portfolio' },
  { label: 'Цены', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function Footer() {
  return (
    <footer className={styles.root}>
      <Container className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              Project<span className={styles.accent}>42</span>
            </Link>
            <p className={styles.tagline}>Не ещё одна веб-студия</p>
          </div>

          <nav className={styles.nav} aria-label="Навигация в подвале">
            {NAV_LINKS.map((link) =>
              link.href.startsWith('/') ? (
                <Link key={link.href} href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href} className={styles.navLink}>
                  {link.label}
                </a>
              ),
            )}
          </nav>

          <div className={styles.social}>
            <a
              href="https://t.me/project42studio"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
            >
              <Icon name="send" size={18} />
            </a>
            <a
              href="https://instagram.com/project42studio"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Icon name="instagram" size={18} />
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>© {new Date().getFullYear()} Project 42</p>
          <p className={styles.copy}>Решаем задачи бизнеса</p>
        </div>
      </Container>
    </footer>
  )
}
