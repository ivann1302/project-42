import { Container, Icon, SectionTitle, StarField } from '@/shared/ui'
import type { IconName } from '@/shared/ui'
import type { RazrabotkaPageConfig } from '@/entities/ServicePage'
import styles from './RazrabotkaPage.module.scss'

type Props = {
  support: RazrabotkaPageConfig['support']
}

const supportItems: Array<{ icon: IconName; title: string; text: string }> = [
  {
    icon: 'layers',
    title: 'Контент',
    text: 'Обновляем тексты, блоки и офферы.',
  },
  {
    icon: 'target',
    title: 'Реклама',
    text: 'Адаптируем страницу под кампании.',
  },
  {
    icon: 'searchUp',
    title: 'Аналитика',
    text: 'Смотрим цели, заявки и слабые места.',
  },
  {
    icon: 'send',
    title: 'Формы',
    text: 'Настраиваем отправку заявок.',
  },
]

export function SupportSection({ support }: Props) {
  return (
    <section className={styles.support} aria-labelledby="landing-support-title">
      <StarField />
      <Container className={styles.supportInner}>
        <div className={styles.supportIntro}>
          <SectionTitle eyebrow="Поддержка">
            <span id="landing-support-title">{support.title}</span>
          </SectionTitle>
          <div className={styles.supportStatement}>
            <p className={styles.supportAccent}>Остаёмся рядом.</p>
          </div>
          <p>{support.text}</p>
        </div>
        <div className={styles.supportPanel}>
          {supportItems.map((item) => (
            <article key={item.title} className={styles.supportPanelItem}>
              <span className={styles.supportIcon} aria-hidden="true">
                <Icon name={item.icon} size={22} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
