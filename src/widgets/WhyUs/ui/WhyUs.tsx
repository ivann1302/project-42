import { Container, Icon, SectionTitle, StarField } from '@/shared/ui'
import type { IconName } from '@/shared/ui/Icon/icons'
import styles from './WhyUs.module.scss'

type Item = {
  icon: IconName
  title: string
  description: string
}

const items: Item[] = [
  {
    icon: 'target',
    title: 'Мало проектов',
    description:
      'Одновременно в работе не более 5 проектов. Каждый получает максимальное внимание команды.',
  },
  {
    icon: 'zap',
    title: 'AI как инструмент',
    description:
      'Нейросети ускоряют рутину, не заменяют экспертизу. Ниже цена — не значит ниже качество.',
  },
  {
    icon: 'layers',
    title: 'Отлаженные процессы',
    description:
      'Выверенные процессы и AI-инструменты дают скорость и качество большой студии при стоимости небольшой команды.',
  },
  {
    icon: 'code',
    title: 'Полный цикл',
    description:
      'Дизайн, разработка, SEO, GEO, поддержка — всё под одной крышей. Без потерь на стыках между подрядчиками.',
  },
  {
    icon: 'shield',
    title: 'Код без замков',
    description:
      'Чистый, документированный код. Если понадобится другой специалист — он подхватит проект без боли.',
  },
  {
    icon: 'rocket',
    title: 'Результат без балласта',
    description:
      'Не раздуваем смету, не пишем отчёты ради отчётов и не держим менеджеров, которые съедают ваш бюджет. Только работа и результат.',
  },
]

export function WhyUs() {
  return (
    <section className={styles.root} id="why">
      <StarField />
      <Container>
        <SectionTitle eyebrow="Наш подход" align="center">
          Мы устроены иначе
        </SectionTitle>
        <ul className={styles.grid} role="list">
          {items.map((item) => (
            <li key={item.title} className={styles.card}>
              <span className={styles.iconWrap} aria-hidden="true">
                <Icon name={item.icon} size={24} />
              </span>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.desc}>{item.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
