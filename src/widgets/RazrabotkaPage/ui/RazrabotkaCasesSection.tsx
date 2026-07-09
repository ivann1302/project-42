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
    metricSize: 'large',
    result: ['Стоимость заявки', 'ниже после рекламы'],
    summary: 'Сайт как канал продаж: SEO-структура, заявки и связка с Telegram-ботом.',
    description:
      'ROSA нужен был не просто корпоративный сайт, а понятная система привлечения заявок для строительных услуг. Мы разложили направления компании по SEO-структуре, подготовили страницы под поиск и ИИ-выдачу, добавили блог, формы и передачу обращений в Telegram-бот. В итоге сайт стал рабочей точкой входа из поиска, рекламы и контента, а стоимость заявки после запуска рекламной связки снизилась в разы.',
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
    metricSize: 'large',
    result: ['Рост дохода', 'после запуска лендинга'],
    summary: 'B2B-лендинг, который быстро объясняет продукт и помогает продавать сложную модель.',
    description:
      'TrueTell нужно было быстро объяснять B2B-клиентам ценность сервиса, не перегружая их сложной аналитикой на первом касании. Мы упаковали продукт в короткий маршрут: проблема, решение, польза для бизнеса, доверие и следующий шаг. Такой лендинг удобно использовать в рекламе, переговорах и продажах, когда важно быстро довести потенциального клиента до понимания ценности.',
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
    metricSize: 'large',
    result: ['Клиента', 'до окупаемости проекта'],
    summary: 'Лендинг, квиз и калькулятор для заявок в конкурентной нише покраски.',
    description:
      'В нише покраски важно быстро перевести рекламный трафик в расчет и заявку, иначе человек уходит сравнивать дальше. Для Красим.ру мы собрали связку из лендинга, квиза, калькулятора и логики под Яндекс.Директ. Страница не просто рассказывает об услуге, а ведет клиента по сценарию: понять предложение, прикинуть стоимость и оставить обращение.',
    examples: [],
  },
  {
    project: getProject('project-7'),
    company: 'Sosedi',
    accent: 'orange',
    imageMode: 'fill',
    metric: 'APP',
    metricSize: 'large',
    result: ['Быстрее объясняет', 'ценность приложения'],
    summary: 'Промо-страница, которая объясняет ценность приложения и ведет к скачиванию.',
    description:
      'Sosedi нужно было быстро объяснить новую пользовательскую привычку: вещи можно не покупать, а брать рядом у соседей. Мы сделали страницу, которая показывает бытовую выгоду, сценарии использования и следующий шаг до скачивания приложения. Такой промо-сайт снижает барьер первого знакомства и помогает сервису быстрее донести ценность до аудитории.',
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
    metric: 'скачивание приложения',
    metricSize: 'compact',
    result: ['Ведет пользователя', 'к первой поездке'],
    summary: 'Промо-сайт, который переводит интерес к сервису в первый шаг к поездке.',
    description:
      'Для аренды электровелосипедов важно, чтобы человек быстро понял механику сервиса и не потерял интерес до установки приложения. Мы собрали промо-страницу, которая объясняет сценарий старта, пользу электротранспорта и путь до первой поездки. Сайт работает как точка входа для рекламы, партнерств и первого знакомства с сервисом.',
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
    project: getProject('project-zvezda'),
    company: 'Звезда',
    accent: 'yellow',
    imageMode: 'fill',
    metric: 'Доверие крупного бизнеса',
    metricSize: 'compact',
    result: ['Больше доверия', 'к производству'],
    summary: 'Индустриальный сайт, который усиливает доверие к производству и бренду.',
    description:
      'Заводу трансформаторов «Звезда» нужен был сайт, который выглядит современно и убедительно для B2B-аудитории: клиентов, партнеров и подрядчиков. Мы перевели инженерную эстетику производства в цифровой формат, сохранили ощущение металла, точности и промышленного масштаба, а анимации встроили в общий бренд. В результате сайт работает как презентация компании, которая усиливает доверие к производству.',
    examples: [
      {
        src: '/images/razrabotka/cases/zvz-1.webp',
        alt: 'Пример экрана завода трансформаторов Звезда: индустриальный первый экран',
      },
      {
        src: '/images/razrabotka/cases/zvz-2.webp',
        alt: 'Пример экрана завода трансформаторов Звезда: блок о производстве',
      },
      {
        src: '/images/razrabotka/cases/zvz-3.webp',
        alt: 'Пример экрана завода трансформаторов Звезда: брендовая подача',
      },
      {
        src: '/images/razrabotka/cases/zvz-4.webp',
        alt: 'Пример экрана завода трансформаторов Звезда: секция с анимационной стилистикой',
      },
    ],
  },
  {
    project: getProject('project-9'),
    company: 'AKS-FIT',
    accent: 'pink',
    imageMode: 'fill',
    metric: 'Понятно объясняет пользу для простого человека',
    metricSize: 'compact',
    result: ['Понятная подача', 'и переход к записи'],
    summary: 'Компактная страница, которая объясняет фитнес-проект и ведет к записи.',
    description:
      'AKS-FIT нужна была страница, которую удобно отправлять из соцсетей, рекламы и личных рекомендаций. Мы собрали компактную витрину проекта: формат программы, настроение, польза и понятный переход к записи. Такой сайт помогает быстро объяснить предложение и не терять заинтересованных людей между первым интересом и заявкой на участие.',
    examples: [
      {
        src: '/images/razrabotka/cases/aks-fit-2.webp',
        alt: 'Пример экрана AKS-FIT: блок с программой проекта',
      },
      {
        src: '/images/razrabotka/cases/aks-fit-3.webp',
        alt: 'Пример экрана AKS-FIT: секция для записи на проект',
      },
    ],
  },
] as const

type CaseRow = (typeof caseRows)[number]
type SlideDirection = 'next' | 'previous'

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

type CaseImage = ReturnType<typeof getCaseImages>[number]

export function RazrabotkaCasesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedCase, setSelectedCase] = useState<CaseRow | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [slideTransition, setSlideTransition] = useState<{
    direction: SlideDirection
    leavingImage: CaseImage
  } | null>(null)

  useScrollReveal(sectionRef, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

  const selectedImages = selectedCase ? getCaseImages(selectedCase) : []
  const activeImage = selectedImages[activeImageIndex] ?? selectedImages[0]
  const hasImageCarousel = selectedImages.length > 1

  const openCaseModal = (item: CaseRow) => {
    setSelectedCase(item)
    setActiveImageIndex(0)
    setSlideTransition(null)
  }

  const closeCaseModal = () => {
    setSelectedCase(null)
    setActiveImageIndex(0)
    setSlideTransition(null)
  }

  const showImage = (direction: SlideDirection) => {
    if (!selectedImages.length) return
    if (activeImage) {
      setSlideTransition({ direction, leavingImage: activeImage })
    }
    setActiveImageIndex((current) =>
      direction === 'next'
        ? (current + 1) % selectedImages.length
        : (current - 1 + selectedImages.length) % selectedImages.length,
    )
  }

  const showPreviousImage = () => {
    showImage('previous')
  }

  const showNextImage = () => {
    showImage('next')
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
                      <p
                        className={`${styles.metric} ${
                          item.metricSize === 'compact' ? styles.metricCompact : ''
                        }`}
                      >
                        {item.metric}
                      </p>
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
              <div className={styles.modalScreenshot}>
                {slideTransition && (
                  <span
                    className={`${styles.modalSlide} ${styles.modalSlideLeaving} ${
                      slideTransition.direction === 'next'
                        ? styles.modalSlideLeavingNext
                        : styles.modalSlideLeavingPrevious
                    }`}
                    aria-hidden="true"
                    onAnimationEnd={() => setSlideTransition(null)}
                  >
                    <Image
                      key={`leaving-${slideTransition.leavingImage.src}`}
                      src={slideTransition.leavingImage.src}
                      alt=""
                      fill
                      className={`${styles.image} ${
                        slideTransition.leavingImage.imageMode === 'fill' ? styles.imageFill : ''
                      }`}
                      sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1439px) calc(100vw - 96px), 1280px"
                    />
                  </span>
                )}
                {activeImage && (
                  <span
                    key={activeImage.src}
                    className={`${styles.modalSlide} ${styles.modalSlideActive} ${
                      slideTransition
                        ? slideTransition.direction === 'next'
                          ? styles.modalSlideEnteringNext
                          : styles.modalSlideEnteringPrevious
                        : ''
                    }`}
                  >
                    <Image
                      src={activeImage.src}
                      alt={activeImage.alt}
                      fill
                      className={`${styles.image} ${
                        activeImage.imageMode === 'fill' ? styles.imageFill : ''
                      }`}
                      sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1439px) calc(100vw - 96px), 1280px"
                    />
                  </span>
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
              {selectedCase.project.services && (
                <div className={styles.modalServicesBlock}>
                  <p className={styles.modalServicesTitle}>Оказанные услуги</p>
                  <ul className={styles.modalServicesList} role="list">
                    {selectedCase.project.services.map((service) => (
                      <li key={service} className={styles.modalService}>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
