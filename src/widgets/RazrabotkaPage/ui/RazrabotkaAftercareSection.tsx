'use client'

import { useRef } from 'react'
import { useScrollReveal } from '@/shared/lib'
import { Icon } from '@/shared/ui'
import styles from './RazrabotkaAftercareSection.module.scss'

const benefits = [
  {
    value: '01',
    title: 'Меняйте контент сами',
    description: 'Тексты, цены, услуги, фото и контакты — без программиста.',
    gift: false,
  },
  {
    value: '02',
    title: 'Гарантия на техническую часть',
    description: 'Если что-то сломается по нашей вине — исправим.',
    gift: false,
  },
  {
    value: '03',
    title: 'SEO-настройка',
    description: 'Настроим мета-данные, индексацию и структуру страниц.',
    gift: true,
  },
] as const

const panelItems = [
  ...benefits.map((item) => ({ ...item, searchEngines: false })),
  {
    value: '04',
    title: 'Оптимизация в выдаче',
    description: '',
    gift: true,
    searchEngines: true,
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
            После запуска сайт остаётся понятным и управляемым — без постоянной помощи разработчика.
          </p>

          <ul className={styles.benefits} aria-label="Что вы получаете после запуска">
            {benefits.map((item) => (
              <li className={styles.benefit} key={item.value}>
                <span className={styles.benefitValue}>{item.value}</span>
                <span className={styles.benefitCopy}>
                  <span className={styles.benefitTitle}>
                    {item.title}
                    {item.gift && (
                      <span className={styles.giftBadge} aria-label="В подарок" title="В подарок">
                        <Icon name="gift" size={18} />
                      </span>
                    )}
                  </span>
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
            {panelItems.map((item) => (
              <div className={styles.panelRow} key={item.value}>
                <span className={styles.toggle} />
                <span className={styles.panelRowTitle}>
                  {item.title}
                  {item.searchEngines && (
                    <span className={styles.searchEngines} aria-label="Google и Яндекс">
                      <span className={styles.googleMark} aria-hidden="true">
                        <Icon name="google" size={18} />
                      </span>
                      <span className={styles.yandexMark} aria-hidden="true">
                        <Icon name="yandex" size={18} />
                      </span>
                    </span>
                  )}
                  {item.gift && (
                    <span className={styles.giftBadge} aria-label="В подарок" title="В подарок">
                      <Icon name="gift" size={18} />
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
          <p className={styles.panelNote}>Сайт готов к самостоятельной работе</p>
        </div>
      </div>
    </section>
  )
}
