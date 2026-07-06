import Image from 'next/image'
import Link from 'next/link'
import { articles, getArticlePath } from '@/entities/Article'
import styles from './BlogPage.module.scss'

const topics = ['Технологии', 'Маркетинг', 'Дизайн'] as const

const blogArticles = articles.map((article) => ({
  title: article.title,
  image: article.coverImage,
  href: getArticlePath(article),
}))

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
              return (
                <Link
                  key={article.title}
                  className={`${styles.articleCard} ${article.image ? '' : styles.articleCardNoImage}`}
                  href={article.href}
                >
                  {article.image ? (
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
                  ) : null}
                  <h2 className={styles.articleTitle}>{article.title}</h2>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
