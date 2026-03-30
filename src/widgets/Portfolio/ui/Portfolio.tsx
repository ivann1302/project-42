import { Container, SectionTitle } from '@/shared/ui'
import { projects } from '@/entities/Project'
import styles from './Portfolio.module.scss'

export function Portfolio() {
  return (
    <section className={styles.root} id="portfolio">
      <Container>
        <SectionTitle eyebrow="Наши работы" align="center">
          Проекты
        </SectionTitle>
        <ul className={styles.grid} role="list">
          {projects.map((project) => (
            <li key={project.id} className={styles.card}>
              <div className={styles.image} aria-hidden="true">
                {project.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.imageUrl} alt={project.title} className={styles.img} />
                ) : (
                  <div className={styles.placeholder} />
                )}
              </div>
              <div className={styles.meta}>
                <h3 className={styles.title}>{project.title}</h3>
                <ul className={styles.tags} role="list">
                  {project.tags.map((tag) => (
                    <li key={tag} className={styles.tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
