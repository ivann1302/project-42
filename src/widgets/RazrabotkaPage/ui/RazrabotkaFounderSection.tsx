'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useScrollReveal } from '@/shared/lib'
import styles from './RazrabotkaFounderSection.module.scss'

export function RazrabotkaFounderSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.22, rootMargin: '0px 0px -12% 0px' })

  return (
    <section
      ref={sectionRef}
      className={styles.root}
      id="about"
      aria-labelledby="razrabotka-founder-title"
    >
      <div className={styles.shell}>
        <div className={styles.content}>
          <h2 className={styles.title} id="razrabotka-founder-title">
            Привет
          </h2>
          <div className={styles.speech}>
            <p>
              Мы студия разработки Project 42. Наша миссия - донести до ваших клиентов суть вашего
              дела максимально эффективно, понятно и красиво.
            </p>
            <p>
              Небольшой штат профессионалов, четко налаженные процессы и отсутствие лишней
              менеджерской прослойки помогают нам качественно подходить к работе, держать ценник по
              нижней границе рынка и сохранять индивидуальный подход к каждому заказчику.
            </p>
            <p>
              Уверен, что мы сможем помочь вашему бизнесу выйти на новый уровень и выделиться среди
              конкурентов.
            </p>
          </div>
        </div>

        <figure className={styles.photoCard}>
          <Image
            className={styles.photo}
            src="/images/chief-photo.webp"
            alt="Иван, основатель Project 42"
            width={540}
            height={720}
            sizes="(max-width: 767px) 86px, (max-width: 1023px) 320px, 300px"
          />
          <figcaption className={styles.caption}>Иван - основатель Project 42</figcaption>
        </figure>
      </div>
    </section>
  )
}
