import Image from 'next/image'
import styles from './WorkProcessSection.module.scss'

const steps = [
  {
    number: '01',
    title: 'Анализ ниши и конкурентов',
    text: 'Разбираем продукт, аудиторию и конкурентную среду, чтобы найти сильные точки для лендинга.',
    image: '/images/razrabotka/work-step-01.webp',
    alt: 'Иллюстрация анализа ниши и конкурентов',
  },
  {
    number: '02',
    title: 'Создание прототипа и дизайна',
    text: 'Собираем структуру страницы, сценарий блоков и визуальный образ будущего сайта.',
    image: '/images/razrabotka/work-step-02.webp',
    alt: 'Иллюстрация прототипа и дизайна сайта',
  },
  {
    number: '03',
    title: 'Разработка сайта и SEO',
    text: 'Верстаем сайт, подключаем базовую SEO-настройку и готовим проект к запуску.',
    image: '/images/razrabotka/work-step-03.webp',
    alt: 'Иллюстрация разработки сайта и SEO',
  },
]

export function WorkProcessSection() {
  return (
    <section className={styles.root} id="process" aria-labelledby="work-process-title">
      <div className={styles.header}>
        <h2 className={styles.title} id="work-process-title">
          <span>Как мы</span>
          <span className={styles.outlineWord}>работаем</span>
        </h2>
      </div>

      <div className={styles.carousel} aria-label="Этапы работы">
        <ol className={styles.steps}>
          {steps.map((step) => (
            <li className={styles.card} key={step.number}>
              <div className={styles.cardTop}>
                <span className={styles.number}>{step.number}</span>
                <Image
                  className={styles.image}
                  src={step.image}
                  alt={step.alt}
                  width={1536}
                  height={1024}
                  sizes="(max-width: 767px) 78vw, 28vw"
                />
              </div>
              <div className={styles.cardText}>
                <h3 className={step.number === '03' ? styles.cardTitlePlain : styles.cardTitle}>
                  {step.title}
                </h3>
                <p className={styles.cardDescription}>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
