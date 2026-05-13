import { Container, Icon, SectionTitle, StarField } from '@/shared/ui'
import type { IconName } from '@/shared/ui'
import styles from './RazrabotkaPage.module.scss'

type Props = {
  aboutText: string
}

const aboutItems = [
  {
    icon: 'target',
    title: 'Анализ ниши и конкурентов',
    text: 'Изучаем рынок, сильные стороны конкурентов и собираем путь клиента от первого касания до заявки.',
  },
  {
    icon: 'eye',
    title: 'Уникальный дизайн',
    text: 'Создаём визуальную подачу под ваш оффер, помогаем с контентом и текстами, если их нет, чтобы сайт выделялся среди конкурентов.',
  },
  {
    icon: 'code',
    title: 'Разработка сайта',
    text: 'Собираем понятную структуру, быстрые страницы и полноценную мобильную версию для удобного просмотра с телефона.',
  },
  {
    icon: 'searchUp',
    title: 'SEO, аналитика и GEO',
    text: 'Настраиваем базовую SEO-оптимизацию, события аналитики и дополнительно готовим сайт к попаданию в AI-выдачу.',
  },
] satisfies Array<{ icon: IconName; title: string; text: string }>

export function AboutSection({ aboutText }: Props) {
  return (
    <section className={styles.about} aria-label="О подходе к лендингам">
      <StarField />
      <Container className={styles.aboutInner}>
        <div className={styles.aboutIntro}>
          <SectionTitle eyebrow="Подход">
            Лендинг должен{' '}
            <span className={styles.aboutGradientText}>объяснять оффер и приводить заявку</span>
          </SectionTitle>
          <p>{aboutText}</p>
        </div>
        <ol className={styles.aboutList}>
          {aboutItems.map((item) => (
            <li key={item.title} className={styles.aboutItem}>
              <span className={styles.aboutIcon} aria-hidden="true">
                <Icon name={item.icon} size={28} />
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
