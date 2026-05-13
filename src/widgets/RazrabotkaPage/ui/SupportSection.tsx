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
    text: 'Правим тексты, добавляем блоки и обновляем офферы под новые гипотезы.',
  },
  {
    icon: 'target',
    title: 'Реклама',
    text: 'Адаптируем страницу под новые кампании, аудитории и посадочные сценарии.',
  },
  {
    icon: 'searchUp',
    title: 'Аналитика',
    text: 'Проверяем события, цели, заявки и точки, где пользователи теряют интерес.',
  },
  {
    icon: 'send',
    title: 'Формы',
    text: 'Дорабатываем отправку заявок в Telegram, CRM или почту.',
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
            <p className={styles.supportMuted}>Никуда не пропадем после создания сайта</p>
            <p className={styles.supportAccent}>Мы остаёмся рядом после запуска.</p>
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
