import { Container, Icon, SectionTitle, StarField } from '@/shared/ui'
import { services } from '@/entities/Service'
import styles from './Services.module.scss'

export function Services() {
  return (
    <section className={styles.root} id="services">
      <StarField />
      <Container>
        <SectionTitle eyebrow="Что мы делаем" align="center">
          Полный цикл разработки
        </SectionTitle>
        <ul className={styles.grid} role="list">
          {services.map((service) => (
            <li key={service.id} className={styles.card}>
              <span className={styles.iconWrap} aria-hidden="true">
                <Icon name={service.icon} size={24} />
              </span>
              <h3 className={styles.title}>{service.title}</h3>
              <p className={styles.desc}>{service.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
