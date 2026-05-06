import type { CSSProperties } from 'react'
import { Container, ScrollReveal, SectionTitle, StarField } from '@/shared/ui'
import type { HowItWorksStep } from '@/entities/ServicePage'
import styles from './HowItWorks.module.scss'

const defaultSteps: HowItWorksStep[] = [
  {
    num: '01',
    title: 'Погружение',
    description:
      'Исследуем бизнес, цели и аудиторию. Формулируем задачу точнее, чем сформулировал клиент.',
  },
  {
    num: '02',
    title: 'Стратегия',
    description: 'Проектируем решение, согласуем этапы, сроки и KPI.',
  },
  {
    num: '03',
    title: 'Дизайн',
    description: 'Создаём интерфейс, итерируем с клиентом до полного согласования.',
  },
  {
    num: '04',
    title: 'Разработка',
    description:
      'AI ускоряет рутину — код ревьюит человек. Результат: скорость без потери качества.',
  },
  {
    num: '05',
    title: 'Запуск',
    description: 'Деплой, SEO-старт, настройка аналитики.',
  },
  {
    num: '06',
    title: 'Партнёрство',
    description: 'Поддержка, доработки, развитие. Остаёмся рядом столько, сколько нужно.',
  },
]

type Props = {
  eyebrow?: string
  title?: string
  steps?: HowItWorksStep[]
}

export function HowItWorks({
  eyebrow = 'Процесс',
  title = 'От замысла до результата',
  steps = defaultSteps,
}: Props) {
  return (
    <section className={styles.root} id="process">
      <StarField />
      <Container>
        <SectionTitle eyebrow={eyebrow} align="center">
          {title}
        </SectionTitle>
        <ScrollReveal as="ol" className={styles.list} threshold={0.1}>
          {steps.map((step, idx) => (
            <li key={step.num} className={styles.step} style={{ '--i': idx } as CSSProperties}>
              <div className={styles.numWrap}>
                <span className={styles.num}>{step.num}</span>
                {idx < steps.length - 1 && <span className={styles.line} aria-hidden="true" />}
              </div>
              <div className={styles.content}>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.desc}>{step.description}</p>
              </div>
            </li>
          ))}
        </ScrollReveal>
      </Container>
    </section>
  )
}
