'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon, SocialLinks } from '@/shared/ui'
import styles from './Footer.module.scss'

const RAZRABOTKA_PATH = '/razrabotka-sayta'

const sectionLinks = [
  { label: 'Что входит', href: '#services' },
  { label: 'Как работаем', href: '#process' },
  { label: 'О студии', href: '#about' },
  { label: 'К заявке', href: '#cta' },
] as const

const legalLinks = [
  { label: 'Политика конфиденциальности', href: '/privacy-policy' },
  { label: 'Публичная оферта', href: '/offer' },
] as const

const contactLinks = [
  {
    label: 'project42studio@gmail.com',
    href: 'mailto:project42studio@gmail.com',
    icon: 'mail',
  },
  {
    label: '+7 999 858 98 78',
    href: 'https://wa.me/79998589878',
    icon: 'phone',
  },
  {
    label: 'Москва, Россия',
    href: '#cta',
    icon: 'mapPin',
  },
] as const

type LinkItem = {
  label: string
  href: string
}

function getSectionHref(pathname: string, hash: string) {
  return pathname === RAZRABOTKA_PATH ? hash : `${RAZRABOTKA_PATH}${hash}`
}

function FooterColumn({ title, links }: { title: string; links: readonly LinkItem[] }) {
  const pathname = usePathname()

  return (
    <nav className={styles.column} aria-label={title}>
      <h2 className={styles.columnTitle}>{title}</h2>
      <ul className={styles.linkList}>
        {links.map((link) => (
          <li key={`${title}-${link.href}-${link.label}`}>
            <Link className={styles.link} href={getSectionHref(pathname, link.href)}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function Footer() {
  const pathname = usePathname()

  return (
    <footer className={styles.root} id="footer" aria-label="Футер сайта">
      <div className={styles.inner}>
        <div className={styles.brandColumn}>
          <Link className={styles.logo} href="/" aria-label="Project 42 - на главную">
            <span>Project</span>
            <span className={styles.logoNumber}>42</span>
          </Link>
          <SocialLinks className={styles.socials} />
        </div>

        <FooterColumn title="По странице" links={sectionLinks} />

        <div className={styles.contactColumn}>
          <h2 className={styles.columnTitle}>Связаться с нами</h2>
          <ul className={styles.contactList}>
            {contactLinks.map((contact) => (
              <li key={contact.href}>
                <Link
                  className={styles.contactLink}
                  href={
                    contact.href.startsWith('#')
                      ? getSectionHref(pathname, contact.href)
                      : contact.href
                  }
                >
                  <Icon name={contact.icon} size={18} />
                  <span>{contact.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link className={styles.ctaLink} href={getSectionHref(pathname, '#cta')}>
            <span>Разобрать задачу</span>
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Project 42. Все права защищены.</p>
          <div className={styles.legalLinks} aria-label="Юридические документы">
            {legalLinks.map((link) => (
              <Link key={link.href} className={styles.legalLink} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <p className={styles.legalEntity}>Самозанятый Нарчук Иван Валериевич</p>
        </div>
      </div>
    </footer>
  )
}
