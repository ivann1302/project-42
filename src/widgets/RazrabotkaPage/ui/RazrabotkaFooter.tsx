import Link from 'next/link'
import { Icon, SocialLinks } from '@/shared/ui'
import styles from './RazrabotkaFooter.module.scss'

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
    label: '+7 995 557 15 89',
    href: 'https://wa.me/79955571589',
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

function FooterColumn({ title, links }: { title: string; links: readonly LinkItem[] }) {
  return (
    <nav className={styles.column} aria-label={title}>
      <h2 className={styles.columnTitle}>{title}</h2>
      <ul className={styles.linkList}>
        {links.map((link) => (
          <li key={`${title}-${link.href}-${link.label}`}>
            <Link className={styles.link} href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function RazrabotkaFooter() {
  return (
    <footer className={styles.root} id="footer" aria-label="Футер страницы разработки сайта">
      <div className={styles.inner}>
        <div className={styles.brandColumn}>
          <Link className={styles.logo} href="#top" aria-label="Project 42 - к началу страницы">
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
                <a className={styles.contactLink} href={contact.href}>
                  <Icon name={contact.icon} size={18} />
                  <span>{contact.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <Link className={styles.ctaLink} href="#cta">
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
