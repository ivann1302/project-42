import Link from 'next/link'
import type { Article } from '@/entities/Article'
import { Container, Icon, StarField } from '@/shared/ui'
import styles from './ArticlePage.module.scss'

type Props = {
  article: Article
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function ArticlePage({ article }: Props) {
  return (
    <article className={styles.root}>
      <StarField />
      <Container className={styles.container}>
        <Link href="/blog" className={styles.backLink}>
          <Icon name="arrowLeft" size={18} />
          Все статьи
        </Link>

        <header className={styles.header}>
          <span className={styles.category}>{article.category}</span>
          <h1 className={styles.heading}>{article.title}</h1>
          <p className={styles.description}>{article.description}</p>
          <div className={styles.meta}>
            <span>{formatDate(article.publishedAt)}</span>
            <span>{article.readingTime}</span>
            <span>{article.author}</span>
          </div>
        </header>

        <div className={styles.layout}>
          <aside className={styles.sidebar} aria-label="Ключевые темы">
            <span className={styles.sidebarTitle}>В материале</span>
            <ul className={styles.highlights} role="list">
              {article.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </aside>

          <div className={styles.content}>
            {article.sections.map((section) => (
              <section key={section.heading} className={styles.section}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </Container>
    </article>
  )
}
