'use client'

import { useEffect, useRef, useState } from 'react'
import { DevelopmentCoin } from './DevelopmentCoin'
import { DevelopmentRevealText } from './DevelopmentRevealText'
import styles from './DevelopmentFaq.module.scss'

const questions = [
  {
    question: 'Что входит в цену?',
    answer:
      'Основные работы указаны в карточках выше. Точный перечень страниц и функций, сроки и итоговую стоимость согласуем перед стартом. Дополнительные задачи оцениваем отдельно.',
  },
  {
    question: 'Когда нужно оплачивать сайт?',
    answer:
      'Предоплату не берём. Сначала показываем готовый сайт на временной ссылке. Всю стоимость вы оплачиваете только перед загрузкой сайта на хостинг.',
  },
  {
    question: 'Кто пишет тексты?',
    answer:
      'Вы рассказываете о своём бизнесе и передаёте материалы, которые уже есть. Мы помогаем подготовить тексты и контент для сайта; объём этой работы согласуем заранее.',
  },
  {
    question: 'Что, если дизайн не подойдёт?',
    answer:
      'Покажем дизайн на согласование и обсудим ваши замечания. В стоимость входят две итерации правок. Если после согласования понадобится изменить утверждённую концепцию или объём работ, отдельно согласуем стоимость.',
  },
  {
    question: 'Смогу ли я менять сайт сам?',
    answer:
      'Да, если предусмотреть такую возможность в проекте. До старта определим, какие разделы вы хотите обновлять самостоятельно, и включим подходящий способ редактирования в оценку. После полной оплаты передадим доступы.',
  },
  {
    question: 'Что оплачивается после запуска?',
    answer:
      'В течение 30 дней после завершения проекта бесплатно исправляем технические ошибки. Новые функции, блоки, изменения дизайна и продвижение оцениваем отдельно перед началом работ.',
  },
  {
    question: 'Занимаетесь ли вы продвижением?',
    answer:
      'Да. Помогаем с SEO и продвижением в нейросетях, настраиваем и ведём рекламу в Яндекс Директе. Продвижение оцениваем отдельно; для клиентов разработки действуют специальные условия — размер скидки обсудим лично.',
  },
] as const

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false)
  const answerId = `development-faq-answer-${index}`

  return (
    <div
      className={styles.item}
      data-open={open}
      data-development-reveal="rise"
      data-development-order={index}
    >
      <h3 className={styles.rowHeading}>
        <button
          className={styles.trigger}
          type="button"
          aria-expanded={open}
          aria-controls={answerId}
          onClick={() => setOpen((current) => !current)}
        >
          <span className={styles.question}>{question}</span>
          <span className={styles.icon} aria-hidden="true" />
        </button>
      </h3>
      <div className={styles.answer} id={answerId} aria-hidden={!open}>
        <div className={styles.answerClip}>
          <p>{answer}</p>
        </div>
      </div>
    </div>
  )
}

export function DevelopmentFaq() {
  const sectionRef = useRef<HTMLElement>(null)
  const coinMotionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const coinMotion = coinMotionRef.current
    if (!section || !coinMotion) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const updateCoin = () => {
      frame = 0
      if (reducedMotion.matches) {
        coinMotion.style.removeProperty('--faq-coin-progress')
        return
      }

      const bounds = section.getBoundingClientRect()
      const start = window.innerHeight * 0.82
      const end = -Math.min(bounds.height * 0.25, window.innerHeight * 0.25)
      const progress = Math.min(1, Math.max(0, (start - bounds.top) / (start - end)))
      coinMotion.style.setProperty('--faq-coin-progress', String(1 - progress * 2))
    }

    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateCoin)
    }

    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    reducedMotion.addEventListener('change', requestUpdate)
    const resizeObserver = new ResizeObserver(requestUpdate)
    resizeObserver.observe(section)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      reducedMotion.removeEventListener('change', requestUpdate)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <section
      className={styles.root}
      id="faq"
      aria-labelledby="development-faq-title"
      ref={sectionRef}
    >
      <div className={styles.inner}>
        <div className={styles.side}>
          <h2 className={styles.title} id="development-faq-title">
            <DevelopmentRevealText>Частые вопросы</DevelopmentRevealText>
          </h2>
          <div className={styles.coinMotion} ref={coinMotionRef}>
            <DevelopmentCoin variant="question" className={styles.coin} />
          </div>
        </div>

        <div className={styles.list}>
          {questions.map(({ question, answer }, index) => (
            <FaqItem question={question} answer={answer} index={index} key={question} />
          ))}
        </div>
      </div>
    </section>
  )
}
