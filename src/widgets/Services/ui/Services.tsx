import { Container, GlowBlob, IconCard, SectionTitle, StarField } from '@/shared/ui'
import { services } from '@/entities/Service'
import styles from './Services.module.scss'

export function Services() {
  return (
    <section className={styles.root} id="services">
      <StarField />
      <GlowBlob color="blue" size={1000} />
      <Container>
        <SectionTitle eyebrow="Что мы делаем" align="center">
          Полный цикл разработки
        </SectionTitle>
        <ul className={styles.grid} role="list">
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
