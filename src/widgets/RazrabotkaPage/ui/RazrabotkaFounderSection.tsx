'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useScrollReveal } from '@/shared/lib'
import styles from './RazrabotkaFounderSection.module.scss'

const reasons = [
  'Разработка точно в срок + поддержка',
  'Понимание пути клиента и его психологии гарантирует, что ваш сайт будет бить точно в цель',
  'Соблюдение законодательства о защите информации и персональных данных в РФ',
  'Защита сайта от перехвата клиентов со стороны недобросовестных конкурентов и взлома',
  'Не привязываем проект к шаблону: сайт можно дорабатывать под рекламу, SEO, аналитику и новые услуги',
] as const

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
        <Image
          className={styles.image}
          src="/images/razrabotka/after-cta.webp"
          alt=""
          width={420}
          height={320}
          sizes="(max-width: 767px) 96px, (max-width: 1023px) 210px, 260px"
          aria-hidden="true"
        />
        <div className={styles.content}>
          <h2 className={styles.title} id="razrabotka-founder-title">
            Почему мы?
          </h2>
          <ul className={styles.reasonList}>
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
