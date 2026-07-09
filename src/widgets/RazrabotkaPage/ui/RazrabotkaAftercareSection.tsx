'use client'

import { useRef } from 'react'
import { useScrollReveal } from '@/shared/lib'
import styles from './RazrabotkaAftercareSection.module.scss'

const benefits = [
  {
    value: '01',
    title: 'Сами меняете контент',
    description: 'тексты, цены, услуги, фото и контакты можно обновлять без программиста',
  },
  {
    value: '02',
    title: 'Гарантия от технических багов',
    description: 'если после запуска ломается наша техническая часть, исправляем',
  },
  {
    value: '03',
    title: 'SEO-настройка в подарок',
    description: 'готовим базовые мета-данные, индексацию и понятную структуру страниц',
  },
] as const

export function RazrabotkaAftercareSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.22, rootMargin: '0px 0px -12% 0px' })

  return (
    <section ref={sectionRef} className={styles.root} aria-labelledby="razrabotka-aftercare-title">
      <div className={styles.shell}>
        <div className={styles.content}>
          <h2 className={styles.title} id="razrabotka-aftercare-title">
            Сайт под вашим контролем
          </h2>
          <p className={styles.subtitle}>
            Передаём проект так, чтобы вы могли спокойно пользоваться им после запуска: обновлять
            информацию, не зависеть от разработчика и не переживать из-за технических ошибок.
          </p>

          <ul className={styles.benefits} aria-label="Что вы получаете после запуска">
            {benefits.map((item) => (
              <li className={styles.benefit} key={item.value}>
                <span className={styles.benefitValue}>{item.value}</span>
                <span className={styles.benefitCopy}>
                  <span className={styles.benefitTitle}>{item.title}</span>
                  <span className={styles.benefitDescription}>{item.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.controlPanel} aria-hidden="true">
          <div className={styles.panelTop}>
            <span />
            <span />
            <span />
          </div>
          <p className={styles.panelTitle}>Передача сайта</p>
          <div className={styles.panelRows}>
            {benefits.map((item) => (
              <div className={styles.panelRow} key={item.value}>
                <span className={styles.toggle} />
                <span>{item.title}</span>
              </div>
            ))}
          </div>
          <p className={styles.panelNote}>Можно пользоваться дальше без программиста</p>
        </div>
      </div>
    </section>
  )
}
