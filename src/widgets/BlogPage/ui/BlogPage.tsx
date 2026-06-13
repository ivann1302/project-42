import Link from 'next/link'
import { articles } from '@/entities/Article'
import { Container, Icon, StarField } from '@/shared/ui'
import styles from './BlogPage.module.scss'

const categoryCounts = articles.reduce<Record<string, number>>((acc, article) => {
  acc[article.category] = (acc[article.category] ?? 0) + 1
  return acc
}, {})

const categories = Object.entries(categoryCounts)

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function BlogPage() {
  const [featuredArticle, ...otherArticles] = articles

  return (
    <section className={styles.root}>
      <StarField />
      <Container className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>Блог Project 42</span>
            <h1 className={styles.heading}>Статьи о сайтах, SEO и понятной разработке</h1>
            <p className={styles.subtitle}>
              Пишем о том, как запускать сайты без хаоса, что проверять перед релизом и как улучшать
              страницы после первых заявок.
            </p>
          </div>

          <aside className={styles.digest} aria-label="Темы блога">
            <span className={styles.digestLabel}>Темы</span>
            <ul className={styles.categoryList} role="list">
              {categories.map(([category, count]) => (
                <li key={category} className={styles.categoryItem}>
                  <span>{category}</span>
                  <span>{count}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <article className={styles.featured}>
          <div className={styles.featuredInfo}>
            <span className={styles.badge}>Свежий материал</span>
            <h2 className={styles.featuredTitle}>{featuredArticle.title}</h2>
            <p className={styles.featuredDescription}>{featuredArticle.description}</p>
            <div className={styles.meta}>
              <span>{formatDate(featuredArticle.publishedAt)}</span>
              <span>{featuredArticle.readingTime}</span>
              <span>{featuredArticle.category}</span>
            </div>
          </div>
          <Link href={`/blog/${featuredArticle.slug}`} className={styles.featuredLink}>
            Читать статью
            <Icon name="arrowRight" size={18} className={styles.linkIcon} />
          </Link>
        </article>

        <ul className={styles.grid} role="list" aria-label="Все статьи">
          {otherArticles.map((article) => (
            <li key={article.slug} className={styles.card} data-accent={article.accent}>
              <Link href={`/blog/${article.slug}`} className={styles.cardLink}>
                <div className={styles.cardTop}>
                  <span className={styles.cardCategory}>{article.category}</span>
                  <span className={styles.cardDate}>{formatDate(article.publishedAt)}</span>
                </div>
                <h2 className={styles.cardTitle}>{article.title}</h2>
                <p className={styles.cardDescription}>{article.description}</p>
                <div className={styles.tags}>
                  {article.highlights.map((highlight) => (
                    <span key={highlight} className={styles.tag}>
                      {highlight}
                    </span>
                  ))}
                </div>
                <span className={styles.readMore}>
                  Читать
                  <Icon name="arrowRight" size={16} className={styles.linkIcon} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
