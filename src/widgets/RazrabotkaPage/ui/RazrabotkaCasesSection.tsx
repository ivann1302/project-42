'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { projects } from '@/entities/Project'
import { useScrollReveal } from '@/shared/lib'
import { Icon, Modal } from '@/shared/ui'
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
    imageMode: 'fill',
    metric: '3x',
    result: ['Стоимость заявки', 'ниже после рекламы'],
    summary: 'Корпоративный сайт на 300+ страниц с SEO, GEO и заявками в Telegram-бот.',
    description:
      'Для ROSA собрали большой корпоративный сайт, который не просто выглядит современно, а помогает продавать сложные строительные услуги. Продумали структуру под поиск, добавили страницы услуг, настроили заявки в Telegram и запустили рекламу. В результате сайт стал рабочим каналом привлечения клиентов, а стоимость заявки после запуска рекламной связки снизилась в разы.',
    examples: [
      {
        src: '/images/razrabotka/cases/rosa-1.webp',
        alt: 'Пример экрана ROSA: блок полезных ссылок и форма заявки',
      },
      {
        src: '/images/razrabotka/cases/rosa-2.webp',
        alt: 'Пример экрана ROSA: страницы услуг и доверительные блоки',
      },
    ],
  },
  {
    project: getProject('project-3'),
    company: 'TrueTell',
    accent: 'pink',
    imageMode: 'fill',
    metric: 'x10+',
    result: ['Рост дохода', 'после запуска лендинга'],
    summary: 'B2B-лендинг, который объяснил сложную модель и помог привлечь крупных клиентов.',
    description:
      'TrueTell нужно было быстро объяснить B2B-клиентам, чем полезен сервис и почему ему можно доверять. Мы упаковали сложную аналитику в понятный лендинг: с ясным первым экраном, логикой предложения и акцентом на ценность для бизнеса. После запуска компании стало проще проводить клиентов через презентацию и договариваться о крупных проектах.',
    examples: [
      {
        src: '/images/razrabotka/cases/truetell-1.webp',
        alt: 'Пример экрана TrueTell: первый экран лендинга',
      },
      {
        src: '/images/razrabotka/cases/truetell-2.webp',
        alt: 'Пример экрана TrueTell: блок преимуществ и сценариев',
      },
      {
        src: '/images/razrabotka/cases/truetell-3.webp',
        alt: 'Пример экрана TrueTell: секция для принятия решения',
      },
    ],
  },
  {
    project: getProject('project-5'),
    company: 'Красим.ру',
    accent: 'yellow',
    imageMode: 'cover',
    metric: '2',
    result: ['Клиента', 'до окупаемости проекта'],
    summary: 'Рекламная связка с лендингом, квизом и калькулятором для конкурентной ниши.',
    description:
      'Для Красим.ру сделали лендинг под рекламный трафик в конкурентной нише покраски. Вместо длинной страницы “обо всём” собрали понятный маршрут: показать услугу, быстро вовлечь через квиз и помочь человеку прикинуть стоимость. Такой формат упростил путь до заявки и помог проекту окупиться уже после первых клиентов.',
    examples: [],
  },
  {
    project: getProject('project-7'),
    company: 'Sosedi',
    accent: 'orange',
    imageMode: 'fill',
    metric: 'APP',
    result: ['Промо сайт', 'для шеринга вещей'],
    summary: 'Промо страница для приложения, где соседи делятся вещами и экономят бюджет.',
    description:
      'Sosedi нужен был промо сайт, который за несколько секунд объясняет идею приложения: вещи можно не покупать, а брать рядом у соседей. Мы сделали страницу с дружелюбной подачей, понятными сценариями использования и фокусом на скачивание приложения. Получилась витрина, которая помогает быстро донести пользу сервиса до новой аудитории.',
    examples: [
      {
        src: '/images/razrabotka/cases/sosedi-ex1.webp',
        alt: 'Пример экрана Sosedi: объяснение идеи приложения',
      },
      {
        src: '/images/razrabotka/cases/sosedi-ex2.webp',
        alt: 'Пример экрана Sosedi: сценарии использования сервиса',
      },
    ],
  },
  {
    project: getProject('project-8'),
    company: 'Ziptron',
    accent: 'mint',
    imageMode: 'fill',
    metric: 'E-BIKE',
    result: ['Промо сайт', 'для аренды электровелосипедов'],
    summary: 'Промо-страница для приложения аренды электровелосипедов с быстрым сценарием старта.',
    description:
      'Ziptron нужен был сайт, который сразу передаёт ощущение быстрого городского сервиса. Мы сделали промо страницу для аренды электровелосипедов: показали механику старта, пользу электротранспорта и путь пользователя до поездки. Страница работает как понятная точка входа для тех, кто впервые знакомится с сервисом.',
    examples: [
      {
        src: '/images/razrabotka/cases/ziptron-1.webp',
        alt: 'Пример экрана Ziptron: первый экран промо страницы',
      },
      {
        src: '/images/razrabotka/cases/ziptron-2.webp',
        alt: 'Пример экрана Ziptron: преимущества аренды электровелосипедов',
      },
      {
        src: '/images/razrabotka/cases/ziptron-3.webp',
        alt: 'Пример экрана Ziptron: сценарий начала поездки',
      },
    ],
  },
  {
    project: getProject('project-9'),
    company: 'AKS-FIT',
    accent: 'pink',
    imageMode: 'fill',
    metric: 'FIT',
    result: ['Атмосферная страница', 'для ознакомления и записи на проект'],
    summary: 'Сайт-визитка для фитнес-проекта с ясной подачей программы и записью на участие.',
    description:
      'Для AKS-FIT собрали компактный сайт-визитку, который знакомит человека с проектом без лишнего шума. На странице быстро считываются формат, настроение программы и следующий шаг для записи. Такой сайт удобно использовать в соцсетях, рекламе и личных рекомендациях, когда нужно красиво и понятно показать проект.',
    examples: [],
  },
] as const

type CaseRow = (typeof caseRows)[number]

const getCaseImages = (item: CaseRow) => [
  ...(item.project.desktopImageUrl
    ? [
        {
          src: item.project.desktopImageUrl,
          alt: item.project.title,
          imageMode: item.imageMode,
        },
      ]
    : []),
  ...item.examples.map((example) => ({
    ...example,
    imageMode: 'cover' as const,
  })),
]

export function RazrabotkaCasesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedCase, setSelectedCase] = useState<CaseRow | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useScrollReveal(sectionRef, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

  const selectedImages = selectedCase ? getCaseImages(selectedCase) : []
  const activeImage = selectedImages[activeImageIndex] ?? selectedImages[0]
  const hasImageCarousel = selectedImages.length > 1

  const openCaseModal = (item: CaseRow) => {
    setSelectedCase(item)
    setActiveImageIndex(0)
  }

  const closeCaseModal = () => {
    setSelectedCase(null)
    setActiveImageIndex(0)
  }

  const showPreviousImage = () => {
    if (!selectedImages.length) return
    setActiveImageIndex((current) => (current - 1 + selectedImages.length) % selectedImages.length)
  }

  const showNextImage = () => {
    if (!selectedImages.length) return
    setActiveImageIndex((current) => (current + 1) % selectedImages.length)
  }

  return (
    <>
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
                Показываем задачи, решения и эффект для бизнеса. Не просто запускаем сайты -
                собираем точки роста.
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
                <button
                  type="button"
                  className={styles.cardButton}
                  onClick={() => openCaseModal(item)}
                  aria-label={`Открыть кейс ${item.company}`}
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
                            className={`${styles.image} ${item.imageMode === 'fill' ? styles.imageFill : ''}`}
                            sizes="(max-width: 767px) 92vw, (max-width: 1439px) 58vw, 760px"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Modal
        open={Boolean(selectedCase)}
        onClose={closeCaseModal}
        title={selectedCase?.company}
        className={styles.caseModal}
      >
        {selectedCase && (
          <div className={styles.modalContent}>
            <div className={styles.modalMockup}>
              <div className={styles.browserBar} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className={styles.modalScreenshot}>
                {activeImage && (
                  <Image
                    key={activeImage.src}
                    src={activeImage.src}
                    alt={activeImage.alt}
                    fill
                    className={`${styles.image} ${activeImage.imageMode === 'fill' ? styles.imageFill : ''}`}
                    sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1439px) calc(100vw - 96px), 1280px"
                  />
                )}

                {hasImageCarousel && (
                  <>
                    <button
                      type="button"
                      className={`${styles.modalImageButton} ${styles.modalImageButtonPrev}`}
                      onClick={showPreviousImage}
                      aria-label="Предыдущее изображение"
                    >
                      <Icon name="arrowLeft" size={20} />
                    </button>
                    <button
                      type="button"
                      className={`${styles.modalImageButton} ${styles.modalImageButtonNext}`}
                      onClick={showNextImage}
                      aria-label="Следующее изображение"
                    >
                      <Icon name="arrowRight" size={20} />
                    </button>
                    <span className={styles.modalImageCounter} aria-live="polite">
                      {activeImageIndex + 1} / {selectedImages.length}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className={styles.modalText}>
              <p className={styles.modalProjectTitle}>{selectedCase.project.title}</p>
              <p className={styles.modalDescription}>{selectedCase.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
