import { DevelopmentRevealText } from './DevelopmentRevealText'
import styles from './DevelopmentProcess.module.scss'

const stages = [
  'Погружение в нишу',
  'Анализ конкурентов',
  'Дизайн',
  'Разработка сайта',
  'Помощь и поддержка',
] as const

export function DevelopmentProcess() {
  return (
    <section className={styles.root} id="process" aria-labelledby="development-process-title">
      <div className={styles.canvas}>
        <h2 className={styles.title} id="development-process-title">
          <DevelopmentRevealText>Как мы работаем</DevelopmentRevealText>
        </h2>
        <ol className={styles.stages}>
          {stages.map((stage, index) => (
            <li
              className={styles.stage}
              key={stage}
              data-development-reveal="rise"
              data-development-order={index}
            >
              <span>{stage}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
