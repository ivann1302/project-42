import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import type { Article, ArticleParagraph } from '@/entities/Article'
import { ArticleCta } from './ArticleCta'
import { ArticleScreenshot } from './ArticleScreenshot'
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

function renderParagraph(paragraph: ArticleParagraph) {
  if (typeof paragraph === 'string') return paragraph

  const parts: ReactNode[] = [paragraph.text]

  paragraph.links.forEach((link) => {
    const nextParts = parts.flatMap((part) => {
      if (typeof part !== 'string') return [part]

      return part.split(link.label).flatMap((textPart, index, splitParts) => {
        const result: ReactNode[] = []
        if (textPart) result.push(textPart)
        if (index < splitParts.length - 1) {
          const isExternalLink = /^https?:\/\//.test(link.href)

          result.push(
            <Link
              key={`${link.href}-${index}`}
              href={link.href}
              target={isExternalLink ? '_blank' : undefined}
              rel={isExternalLink ? 'noreferrer' : undefined}
            >
              {link.label}
            </Link>,
          )
        }
        return result
      })
    })

    parts.splice(0, parts.length, ...nextParts)
  })

  return parts
}

export function ArticlePage({ article }: Props) {
  return (
    <article className={styles.root}>
      <div className={styles.inner}>
        <div className={`${styles.hero} ${article.coverImage ? '' : styles.heroNoCover}`}>
          <header className={styles.header}>
            <h1 className={styles.heading}>{article.title}</h1>
            <p className={styles.description}>{article.description}</p>
            <div className={styles.meta}>
              <span>{formatDate(article.publishedAt)}</span>
              <span>{article.readingTime}</span>
              <span>{article.category}</span>
            </div>
          </header>

          {article.coverImage ? (
            <Image
              className={styles.cover}
              src={article.coverImage}
              alt=""
              width={1536}
              height={1024}
              sizes="(max-width: 767px) 100vw, 960px"
              priority
            />
          ) : null}
        </div>

        <div className={styles.content}>
          {article.sections.map((section) => (
            <section
              key={section.heading}
              className={`${styles.section} ${
                section.variant === 'highlight' ? styles.highlightSection : ''
              } ${section.variant === 'blueHighlight' ? styles.blueHighlightSection : ''}`}
            >
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={typeof paragraph === 'string' ? paragraph : paragraph.text}>
                  {renderParagraph(paragraph)}
                </p>
              ))}
              {section.list ? (
                <ul className={styles.list}>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.table ? (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        {section.table.headers.map((header) => (
                          <th key={header}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row.join('|')}>
                          {row.map((cell, index) => (
                            <td key={`${row[0]}-${index}`}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              {section.image ? <ArticleScreenshot image={section.image} /> : null}
            </section>
          ))}
        </div>

        {article.cta ? <ArticleCta cta={article.cta} /> : null}

        <div className={styles.footerLinks}>
          <Link href="/blog" className={styles.sourceLink}>
            Все статьи
          </Link>
          {article.sourceUrl ? (
            <Link
              className={styles.sourceLink}
              href={article.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              {article.sourceLabel ?? 'Источник'}
            </Link>
          ) : null}
          {article.footerLinks?.map((link) => (
            <Link
              key={link.href}
              className={styles.sourceLink}
              href={link.href}
              target={/^https?:\/\//.test(link.href) ? '_blank' : undefined}
              rel={/^https?:\/\//.test(link.href) ? 'noreferrer' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </article>
  )
}
