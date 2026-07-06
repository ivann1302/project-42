import Link from 'next/link'
import { Icon } from '@/shared/ui'
import styles from './page.module.scss'

const serviceLinks = [
  {
    title: 'Разработка сайтов',
    text: 'Лендинги и сайты для бизнеса: структура, дизайн, Next.js, формы и аналитика.',
    href: '/razrabotka-sayta',
    tone: 'mint',
  },
  {
    title: 'GEO-продвижение',
    text: 'Подготовка сайта к видимости в ChatGPT, Алисе, Perplexity и AI-поиске.',
    href: '/geo-prodvizhenie',
    tone: 'peach',
  },
] as const

export function HomeServices() {
  return (
    <section className={styles.servicesSection} id="services" aria-labelledby="home-services-title">
      <div className={styles.servicesInner}>
        <p className={styles.servicesKicker}>Услуги</p>
        <h2 className={styles.servicesTitle} id="home-services-title">
          Чем можем помочь
        </h2>
        <div className={styles.servicesGrid}>
          {serviceLinks.map((service) => (
            <Link
              className={`${styles.serviceCard} ${styles[service.tone]}`}
              href={service.href}
              key={service.href}
            >
              <span className={styles.serviceCardLabel}>Услуга</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <span className={styles.serviceCardAction}>
                Подробнее
                <Icon name="arrowRight" size={18} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
