'use client'

import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import Image from 'next/image'
import { useScrollReveal } from '@/shared/lib'
import { StudioButton } from '@/shared/ui'
import { RazrabotkaChatButton } from '@/widgets/RazrabotkaPage/ui/RazrabotkaChatButton'
import { RazrabotkaFooter } from '@/widgets/RazrabotkaPage/ui/RazrabotkaFooter'
import { RazrabotkaHeader } from '@/widgets/RazrabotkaPage/ui/RazrabotkaHeader'
import { RazrabotkaLevelUpBanner } from '@/widgets/RazrabotkaPage/ui/RazrabotkaLevelUpBanner'
import { RazrabotkaQuizSection } from '@/widgets/RazrabotkaPage/ui/RazrabotkaQuizSection'
import { WorkProcessSection } from '@/widgets/RazrabotkaPage/ui/WorkProcessSection'
import styles from './SmallBusinessPage.module.scss'

const sphereLetters = Array.from('project 42')
const sphereLetterCount = sphereLetters.length + 1
const sphereMaxShiftX = 16
const sphereMaxShiftY = 12
const sphereMaxTilt = 8

function handleSpherePointerMove(event: PointerEvent<HTMLDivElement>) {
  const bounds = event.currentTarget.getBoundingClientRect()

  if (!bounds.width || !bounds.height) return

  const clientX = Number.isFinite(event.clientX) ? event.clientX : bounds.left + bounds.width / 2
  const clientY = Number.isFinite(event.clientY) ? event.clientY : bounds.top + bounds.height / 2
  const x = ((clientX - bounds.left) / bounds.width - 0.5) * 2
  const y = ((clientY - bounds.top) / bounds.height - 0.5) * 2

  event.currentTarget.style.setProperty('--sphere-shift-x', `${(x * sphereMaxShiftX).toFixed(2)}px`)
  event.currentTarget.style.setProperty('--sphere-shift-y', `${(y * sphereMaxShiftY).toFixed(2)}px`)
  event.currentTarget.style.setProperty('--sphere-tilt-x', `${(-y * sphereMaxTilt).toFixed(2)}deg`)
  event.currentTarget.style.setProperty('--sphere-tilt-y', `${(x * sphereMaxTilt).toFixed(2)}deg`)
}

function handleSpherePointerLeave(event: PointerEvent<HTMLDivElement>) {
  event.currentTarget.style.setProperty('--sphere-shift-x', '0px')
  event.currentTarget.style.setProperty('--sphere-shift-y', '0px')
  event.currentTarget.style.setProperty('--sphere-tilt-x', '0deg')
  event.currentTarget.style.setProperty('--sphere-tilt-y', '0deg')
}

const includes = [
  'Анализ ниши и конкурентов',
  'Структура услуг и заявок',
  'Прототип и дизайн',
  'Адаптивная разработка',
  'Базовое SEO',
  'Подготовка к AI-поиску',
  'Яндекс.Метрика и цели',
  'UTM-метки и Telegram-уведомления',
]

const tasks = [
  {
    title: 'Доверие',
    text: 'Показать услуги, цены, примеры работ, отзывы, контакты и понятный порядок обращения.',
  },
  {
    title: 'Заявки',
    text: 'Собрать обращения из SEO, рекламы, карт, мессенджеров, рекомендаций и ИИ-поиска.',
  },
  {
    title: 'Ответы',
    text: 'Снять повторяющиеся вопросы про цену, сроки, условия, гарантии и формат работы.',
  },
]

const noSiteRisks = [
  'заявки уходят конкурентам, у которых понятнее цены, отзывы и примеры',
  'реклама ведет в переписку или агрегатор, где сложно быстро объяснить предложение',
  'клиент не может проверить доверие и откладывает обращение',
  'одни и те же вопросы приходится вручную объяснять каждому новому человеку',
]

const faq = [
  {
    question: 'Можно ли начать с недорогой версии?',
    answer:
      'Да. Для малого бизнеса часто разумнее запустить первую рабочую версию, а потом расширять сайт по заявкам, рекламе и SEO-данным.',
  },
  {
    question: 'Чем это лучше конструктора?',
    answer:
      'Конструктор хорош для быстрого старта. Собственный сайт удобнее, когда нужны SEO-структура, скорость, интеграции, защита форм и развитие без ограничений платформы.',
  },
  {
    question: 'Сколько времени занимает запуск?',
    answer:
      'Обычно от 2 до 5 недель. Срок зависит от количества услуг, материалов, интеграций и готовности текстов.',
  },
]

const whyUs = [
  {
    title: 'Думаем от заявок',
    text: 'Сначала разбираем, кто клиент, что он спрашивает перед обращением и где сейчас теряется доверие.',
  },
  {
    title: 'Не продаем лишний размах',
    text: 'Для малого бизнеса важна рабочая первая версия: услуги, доказательства, контакты, аналитика и понятный путь к заявке.',
  },
  {
    title: 'Закладываем SEO и AI-поиск',
    text: 'Страницы услуг, FAQ, структура, метаданные и понятные формулировки готовятся не после запуска, а в основе сайта.',
  },
  {
    title: 'Собираем систему',
    text: 'Формы, Telegram-уведомления, Яндекс.Метрика, цели и UTM-метки помогают видеть, откуда приходят реальные обращения.',
  },
]

const footerLinks = [
  { label: 'Зачем сайт', href: '#decision-window' },
  { label: 'Что входит', href: '#services' },
  { label: 'Как работаем', href: '#process' },
  { label: 'Почему мы', href: '#why-us' },
  { label: 'К заявке', href: '#cta' },
] as const

export function SmallBusinessPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0)
  const whyUsRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  useScrollReveal(whyUsRef, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' })
  useScrollReveal(ctaRef, { threshold: 0.22, rootMargin: '0px 0px -12% 0px' })

  return (
    <div className={styles.pageCanvas} data-testid="small-business-page-canvas">
      <RazrabotkaHeader />
      <main>
        <section className={styles.hero} id="top" aria-labelledby="small-business-title">
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <p className={styles.kicker}>Создание сайта для малого бизнеса</p>
              <h1 className={styles.heroTitle} id="small-business-title">
                <span className={styles.outlineWord}>САЙТ</span>
                <span className={styles.heroLine}>
                  для <span className={styles.accentWord}>малого</span>
                </span>
                <span className={styles.heroLine}>бизнеса</span>
              </h1>
              <p className={styles.heroText}>
                Чтобы выглядеть надежнее, получать заявки и не зависеть только от Авито, соцсетей,
                сарафана или агрегаторов.
              </p>
              <div className={styles.actions} aria-label="Основные действия">
                <StudioButton className={styles.heroButton} href="#cta" variant="mint">
                  Получить оценку
                </StudioButton>
                <StudioButton className={styles.heroButton} href="#services" variant="peach">
                  Что входит
                </StudioButton>
              </div>
            </div>
            <div
              className={styles.heroVisual}
              role="img"
              aria-label="Вращающаяся сфера Project 42"
              onPointerMove={handleSpherePointerMove}
              onPointerLeave={handleSpherePointerLeave}
              data-cursor-interactive
            >
              <div className={styles.sphereStage}>
                <div className={styles.sphereOrbit} aria-hidden="true">
                  {sphereLetters.map((letter, index) => (
                    <span
                      className={styles.sphereLetter}
                      key={`${letter}-${index}`}
                      style={
                        {
                          '--sphere-index': index / sphereLetterCount,
                        } as CSSProperties
                      }
                    >
                      {letter === ' ' ? '\u00a0' : letter}
                    </span>
                  ))}
                </div>
                <div className={styles.sphereCore} aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        <section
          className={styles.decision}
          id="decision-window"
          aria-labelledby="small-business-decision-title"
        >
          <div className={styles.decisionInner}>
            <h2 className={styles.decisionTitle} id="small-business-decision-title">
              <span className={styles.numberGroup}>
                <span className={styles.number}>30</span>
                <span className={styles.unit}>секунд</span>
              </span>
              <span className={styles.statement}>
                столько нужно клиенту, чтобы понять: вам можно доверять
              </span>
            </h2>
            <p className={styles.decisionText}>
              Поэтому сайт малого бизнеса собирается как короткий маршрут: что вы делаете, сколько
              это стоит, почему вам можно верить и куда нажать дальше.
            </p>
            <ul className={styles.signals}>
              <li>
                <a href="#services">что делаете</a>
              </li>
              <li>
                <a href="#risks">что теряете без сайта</a>
              </li>
              <li>
                <a href="#cta">оставить заявку</a>
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.whatWeDo} id="services" aria-labelledby="small-services-title">
          <div className={styles.whatInner}>
            <div className={styles.statementCard}>
              <h2 className={styles.sectionTitle} id="small-services-title">
                Что делаем?
              </h2>
              <p className={styles.bigStatement}>
                Создаем сайт, который упаковывает малый бизнес в понятное предложение и помогает
                получать заявки.
              </p>
            </div>

            <div className={styles.cards}>
              <article className={styles.scopeCard}>
                <p className={styles.blockHeading}>В проект входит</p>
                <ul className={styles.scopeList}>
                  {includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <aside className={styles.priceCard} aria-label="Сроки и стоимость">
                <p className={styles.blockHeading}>Стоимость</p>
                <p className={styles.priceText}>от 15 тыс. рублей</p>
                <Image
                  className={styles.priceImage}
                  src="/images/razrabotka/price.webp"
                  alt=""
                  width={1536}
                  height={1024}
                  sizes="(max-width: 767px) 220px, 300px"
                  aria-hidden="true"
                />
                <p className={styles.payment}>Оплата поэтапно</p>
              </aside>
            </div>
          </div>
        </section>

        <section className={styles.tasksSection} aria-labelledby="small-tasks-title">
          <div className={styles.tasksHeader}>
            <h2 className={styles.processTitle} id="small-tasks-title">
              <span>Какие задачи</span>
              <span className={styles.processOutline}>решает сайт</span>
            </h2>
          </div>
          <div className={styles.taskGrid}>
            {tasks.map((task) => (
              <article className={styles.taskCard} key={task.title}>
                <h3>{task.title}</h3>
                <p>{task.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.risksSection} id="risks" aria-labelledby="small-risks-title">
          <div className={styles.riskPanel}>
            <h2 id="small-risks-title">Минусы отсутствия сайта у бизнеса</h2>
            <ul>
              {noSiteRisks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <WorkProcessSection />

        <section
          ref={whyUsRef}
          className={styles.whyUsSection}
          id="why-us"
          aria-labelledby="small-why-title"
        >
          <div className={styles.whyUsPanel}>
            <div>
              <p className={styles.whyUsKicker}>Почему мы</p>
              <h2 id="small-why-title">Не просто собираем страницы</h2>
            </div>
            <div className={styles.whyUsGrid}>
              {whyUs.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          ref={ctaRef}
          className={styles.ctaSection}
          id="cta"
          aria-labelledby="small-business-cta-title"
        >
          <span className={styles.contactsAnchor} id="contacts" aria-hidden="true" />
          <div className={styles.ctaShell}>
            <div className={styles.ctaVisual}>
              <Image
                className={styles.ctaImage}
                src="/images/razrabotka/cta-image.webp"
                alt=""
                width={680}
                height={700}
                sizes="(max-width: 767px) 86vw, (max-width: 1023px) 620px, 46vw"
                aria-hidden="true"
              />
            </div>
            <div className={styles.ctaContent}>
              <p className={styles.ctaKicker}>Готовы к заявкам?</p>
              <h2 className={styles.ctaTitle} id="small-business-cta-title">
                <span>Давайте обсудим</span>
                <span className={styles.ctaAccent}>ваш сайт</span>
              </h2>
              <p className={styles.ctaText}>
                Расскажите, чем занимаетесь и какие заявки должен приносить сайт. Предложим первую
                структуру и подскажем, с какой версии разумно начать.
              </p>
              <div className={styles.ctaActions} aria-label="Действия CTA">
                <StudioButton
                  className={styles.ctaPrimaryButton}
                  href="#contacts"
                  variant="yellow"
                  icon={null}
                >
                  Оставить заявку
                </StudioButton>
                <StudioButton
                  className={styles.ctaSecondaryButton}
                  href="#services"
                  variant="outline"
                  icon="externalLink"
                >
                  Что входит
                </StudioButton>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.faqSection} aria-labelledby="small-faq-title">
          <div className={styles.tasksHeader}>
            <h2 className={styles.processTitle} id="small-faq-title">
              <span>Частые</span>
              <span className={styles.processOutline}>вопросы</span>
            </h2>
          </div>
          <div className={styles.faqList}>
            {faq.map((item, index) => {
              const isOpen = openFaqIndex === index
              const answerId = `small-faq-answer-${index}`

              return (
                <article className={styles.faqItem} key={item.question}>
                  <h3>
                    <button
                      className={styles.faqButton}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    >
                      <span>{item.question}</span>
                      <span className={styles.faqIcon} aria-hidden="true">
                        +
                      </span>
                    </button>
                  </h3>
                  <div
                    className={`${styles.faqAnswer} ${isOpen ? styles.faqAnswerOpen : ''}`}
                    id={answerId}
                    aria-hidden={!isOpen}
                  >
                    <p>{item.answer}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <RazrabotkaLevelUpBanner />
        <RazrabotkaQuizSection />
      </main>
      <RazrabotkaChatButton />
      <RazrabotkaFooter
        usePageAnchors
        sectionLinks={footerLinks}
        ariaLabel="Футер страницы сайта для малого бизнеса"
      />
      <RazrabotkaLevelUpBanner placement="mobile" decorative />
    </div>
  )
}
