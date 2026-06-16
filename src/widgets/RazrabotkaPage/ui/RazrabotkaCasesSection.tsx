'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import { useRef } from 'react'
import { projects } from '@/entities/Project'
import { useScrollReveal } from '@/shared/lib'
import styles from './RazrabotkaCasesSection.module.scss'

const getProject = (id: string) => {
  const project = projects.find((item) => item.id === id)
  if (!project) throw new Error(`Project ${id} not found`)
  return project
}

const caseRows = [
  {
    project: getProject('project-1'),
    company: 'ROSA',
    accent: 'mint',
    imageMode: 'cover',
    metric: '3x',
    result: ['Стоимость заявки', 'ниже после рекламы'],
    summary: 'Корпоративный сайт на 300+ страниц с SEO, GEO и заявками в Telegram-бот.',
  },
  {
    project: getProject('project-3'),
    company: 'TrueTell',
    accent: 'pink',
    imageMode: 'cover',
    metric: 'x10+',
    result: ['Рост дохода', 'после запуска лендинга'],
    summary: 'B2B-лендинг, который объяснил сложную модель и помог привлечь крупных клиентов.',
  },
  {
    project: getProject('project-5'),
    company: 'Красим.ру',
    accent: 'yellow',
    imageMode: 'cover',
    metric: '2',
    result: ['Клиента', 'до окупаемости проекта'],
    summary: 'Рекламная связка с лендингом, квизом и калькулятором для конкурентной ниши.',
  },
  {
    project: getProject('project-7'),
    company: 'Sosedi',
    accent: 'orange',
    imageMode: 'contain',
    metric: 'APP',
    result: ['Промо сайт', 'для шеринга вещей'],
    summary: 'Промо страница для приложения, где соседи делятся вещами и экономят бюджет.',
  },
] as const

export function RazrabotkaCasesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

  return (
    <section
      ref={sectionRef}
      className={styles.root}
      id="projects"
      aria-labelledby="razrabotka-cases-title"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <p className={styles.kicker}>Реальные проекты, реальные результаты</p>
            <h2 className={styles.title} id="razrabotka-cases-title" aria-label="Наши кейсы">
              <span>Наши</span>
              <span className={styles.outlineWord}>Кейсы</span>
            </h2>
          </div>

          <div className={styles.headerAside}>
            <p className={styles.description}>
              Показываем задачи, решения и эффект для бизнеса. Не просто запускаем сайты - собираем
              точки роста.
            </p>
          </div>
        </div>

        <ol className={styles.list} aria-label="Кейсы Project 42">
          {caseRows.map((item, index) => (
            <li
              key={item.project.id}
              className={`${styles.row} ${styles[item.accent]}`}
              style={{ '--case-index': index } as CSSProperties}
            >
              <div className={styles.strip}>
                <span className={styles.company}>{item.company}</span>
                <span className={styles.stripTitle}>{item.project.title}</span>
              </div>

              <div className={styles.rowBody}>
                <div className={styles.metricColumn}>
                  <p className={styles.metric}>{item.metric}</p>
                  <div className={styles.result}>
                    {item.result.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </div>
                  <h3 className={styles.projectTitle}>{item.project.title}</h3>
                  <p className={styles.summary}>{item.summary}</p>
                </div>

                <div className={styles.mockup}>
                  <div className={styles.browserBar} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className={styles.screenshot}>
                    {item.project.desktopImageUrl && (
                      <Image
                        src={item.project.desktopImageUrl}
                        alt={item.project.title}
                        fill
                        className={`${styles.image} ${item.imageMode === 'contain' ? styles.imageContain : ''}`}
                        sizes="(max-width: 767px) 92vw, (max-width: 1439px) 58vw, 760px"
                      />
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
