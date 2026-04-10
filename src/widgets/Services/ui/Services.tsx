'use client'

import { useEffect, useRef } from 'react'
import { Container, GlowBlob, IconCard, SectionTitle, StarField } from '@/shared/ui'
import { services } from '@/entities/Service'
import styles from './Services.module.scss'

export function Services() {
  const gridRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.visible)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.root} id="services">
      <StarField />
      <GlowBlob color="blue" size={1000} />
      <Container>
        <SectionTitle eyebrow="Что мы делаем" align="center">
          Полный цикл разработки
        </SectionTitle>
        <ul ref={gridRef} className={styles.grid} role="list">
          {services.map((service) => (
            <IconCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </ul>
      </Container>
    </section>
  )
}
