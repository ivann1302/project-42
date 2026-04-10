import { Container, Button, Icon } from '@/shared/ui'
import { StarField } from '@/shared/ui'
import { projects } from '@/entities/Project'
import styles from './PortfolioPage.module.scss'

export function PortfolioPage() {
  return (
    <section className={styles.root} id="portfolio">
      <StarField />
      <Container className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Наши работы</span>
          <h1 className={styles.heading}>Портфолио</h1>
          <p className={styles.subtitle}>Проекты, которые мы сделали и продолжаем поддерживать</p>
        </div>

        <ul className={styles.list} role="list">
          {projects.map((project, index) => {
            const isEven = (index + 1) % 2 === 0
            return (
              <li
                key={project.id}
                className={[styles.row, isEven && styles.reversed].filter(Boolean).join(' ')}
              >
                <div className={styles.text}>
                  <ul className={styles.tags} role="list">
                    {project.tags.map((tag) => (
                      <li key={tag} className={styles.tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <h2 className={styles.title}>{project.title}</h2>
                  <p className={styles.description}>{project.description}</p>
                  {project.achievements && (
                    <ul className={styles.achievements} role="list">
                      {project.achievements.map((item) => (
                        <li key={item} className={styles.achievement}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {project.href && (
                  <Button
                    variant="secondary"
                    href={project.href}
                    target="_blank"
                    className={styles.link}
                  >
                    Посмотреть сайт
                    <Icon name="externalLink" size={16} className={styles.icon} />
                  </Button>
                )}

                <div className={styles.mockups}>
                  <div className={styles.desktop}>
                    {project.desktopImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.desktopImageUrl}
                        alt={`${project.title} — десктоп`}
                        className={styles.mockupImg}
                      />
                    ) : (
                      <div className={styles.placeholder} />
                    )}
                  </div>
                  <div className={styles.mobile}>
                    {project.mobileImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.mobileImageUrl}
                        alt={`${project.title} — мобильный`}
                        className={styles.mockupImg}
                      />
                    ) : (
                      <div className={styles.placeholder} />
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
