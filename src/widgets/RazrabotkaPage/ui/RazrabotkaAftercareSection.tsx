'use client'

import { useRef } from 'react'
import { useScrollReveal } from '@/shared/lib'
import { Icon } from '@/shared/ui'
import styles from './RazrabotkaAftercareSection.module.scss'

const panelItems = [
  {
    value: '01',
    title: 'Меняйте контент сами',
    platformGroup: null,
  },
  {
    value: '02',
    title: 'Гарантия на техническую часть',
    platformGroup: null,
  },
  {
    value: '03',
    title: 'SEO-настройка',
    platformGroup: 'search',
  },
  {
    value: '04',
    title: 'Оптимизация в выдаче ИИ',
    platformGroup: 'ai',
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
        </div>

        <div
          className={styles.controlPanel}
          role="group"
          aria-label="Что вы получите после запуска"
        >
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
                  {item.platformGroup === 'search' && (
                    <span className={styles.platformMarks} aria-label="Google и Яндекс">
                      <span className={styles.platformMark} aria-hidden="true">
                        <Icon name="google" size={18} />
                      </span>
                      <span className={styles.platformMark} aria-hidden="true">
                        <Icon name="yandex" size={18} />
                      </span>
                    </span>
                  )}
                  {item.platformGroup === 'ai' && (
                    <span className={styles.platformMarks} aria-label="ChatGPT и DeepSeek">
                      <span className={styles.platformMark} aria-hidden="true">
                        <Icon name="chatgpt" size={18} />
                      </span>
                      <span
                        className={`${styles.platformMark} ${styles.deepseekMark}`}
                        aria-hidden="true"
                      >
                        <Icon name="deepseek" size={18} />
                      </span>
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
