import Image from 'next/image'
import Link from 'next/link'
import { articles, getArticlePath } from '@/entities/Article'
import styles from './BlogPage.module.scss'

const topics = ['Технологии', 'Маркетинг', 'Дизайн'] as const

const upcomingArticles = [
  {
    title: 'Что такое перехват лидов и как от него защититься?',
    image: '/images/blog/article2.webp',
  },
] as const

const blogArticles = [
  ...articles.map((article) => ({
    title: article.title,
    image: article.coverImage ?? '/images/blog/article1.webp',
    href: getArticlePath(article),
  })),
  ...upcomingArticles,
] as const

export function BlogPage() {
  return (
    <>
      <div className={styles.scrollScene}>
        <section className={styles.root} aria-labelledby="blog-title">
          <div className={styles.inner}>
            <h1 className={styles.title} id="blog-title">
              Блог
            </h1>
            <p className={styles.subtitle}>Пишем о том, в чем действительно разбираемся</p>
            <ul className={styles.topics} aria-label="Темы блога">
              {topics.map((topic) => (
                <li key={topic} className={styles.topic}>
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className={styles.articlesSection} aria-label="Статьи блога">
        <div className={styles.articlesInner}>
          <div className={styles.articlesGrid}>
            {blogArticles.map((article) => {
              const cardContent = (
                <>
                  <span className={styles.articleImageWrap}>
                    <Image
                      className={styles.articleImage}
                      src={article.image}
                      alt=""
                      width={1536}
                      height={1024}
                      sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                    />
                  </span>
                  <h2 className={styles.articleTitle}>{article.title}</h2>
                </>
              )

              if ('href' in article) {
                return article.href.startsWith('http') ? (
                  <a
                    key={article.title}
                    className={styles.articleCard}
                    href={article.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {cardContent}
                  </a>
                ) : (
                  <Link key={article.title} className={styles.articleCard} href={article.href}>
                    {cardContent}
                  </Link>
                )
              }

              return (
                <article key={article.title} className={styles.articleCard}>
                  {cardContent}
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
