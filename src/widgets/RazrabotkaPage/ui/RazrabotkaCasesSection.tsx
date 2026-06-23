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
      'Для ROSA собрали большой корпоративный сайт, который не просто выглядит современно, а помогает продавать сложные строительные услуги. Начали со структуры: разложили направления компании по понятным разделам, подготовили страницы под SEO и GEO, добавили блог и точки входа для заявок. Затем настроили передачу обращений в Telegram-бот, подключили рекламную связку и оставили проект в развитии. В результате сайт стал рабочим каналом привлечения клиентов, а стоимость заявки после запуска рекламы снизилась в разы.',
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
      'TrueTell нужно было быстро объяснить B2B-клиентам, чем полезен сервис и почему ему можно доверять. Мы перевели сложную аналитику в понятный лендинг: собрали структуру оффера, продумали первый экран, визуально разложили преимущества и подготовили страницу к рекламному запуску. Такой формат помогает не перегружать клиента деталями на старте, а вести его по спокойной логике: проблема, решение, польза для бизнеса и следующий шаг.',
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
      'Для Красим.ру сделали лендинг под рекламный трафик в конкурентной нише покраски. Вместо длинной страницы “обо всём” собрали понятный маршрут: показать услугу, быстро вовлечь через квиз, помочь человеку прикинуть стоимость и подтолкнуть к заявке. Дополнительно подготовили рекламную логику для Яндекс.Директа, чтобы трафик попадал не просто на красивую страницу, а в сценарий, где пользователю понятно, что делать дальше.',
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
      'Sosedi нужен был промо сайт, который за несколько секунд объясняет идею приложения: вещи можно не покупать, а брать рядом у соседей. Мы собрали страницу с дружелюбной подачей, понятными сценариями использования и фокусом на скачивание приложения. Важным было не просто показать интерфейс, а упаковать идею осознанного потребления так, чтобы человек сразу понимал бытовую выгоду и мог представить сервис в своей жизни.',
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
      'Ziptron нужен был сайт, который сразу передает ощущение быстрого городского сервиса. Мы сделали промо-страницу для аренды электровелосипедов: показали механику старта, пользу электротранспорта, мобильный сценарий и путь пользователя до поездки. Страница работает как понятная точка входа для тех, кто впервые знакомится с сервисом, и помогает быстро перейти от интереса к использованию приложения.',
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
    metric: 'IND',
    result: ['Стильный сайт', 'для завода трансформаторов'],
    summary: 'Индустриальный сайт с анимациями в стилистике общего брендинга завода.',
    description:
      'Для завода трансформаторов «Звезда» сделали сайт, который доказывает: промышленный проект может выглядеть стильно и современно. Основной упор был на индустриальный дизайн, сильную визуальную подачу и анимации, которые поддерживают общий брендинг, а не спорят с ним. Мы сохранили ощущение производства, металла и инженерной точности, но перевели это в современный цифровой формат, чтобы сайт выглядел как часть сильного промышленного бренда.',
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
    metric: 'FIT',
    result: ['Атмосферная страница', 'для ознакомления и записи на проект'],
    summary: 'Сайт-визитка для фитнес-проекта с ясной подачей программы и записью на участие.',
    description:
      'Для AKS-FIT собрали компактный сайт-визитку, который знакомит человека с проектом без лишнего шума. На странице быстро считываются формат, настроение программы и следующий шаг для записи. Мы сделали акцент на визуальной упаковке, коротком маршруте до действия и адаптивности, чтобы страницу было удобно отправлять из соцсетей, рекламы и личных рекомендаций, когда нужно красиво и понятно показать проект.',
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
