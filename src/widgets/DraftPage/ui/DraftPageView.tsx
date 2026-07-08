import type { DraftPage } from '@/entities/DraftPage'
import styles from './DraftPageView.module.scss'

type Props = {
  page: DraftPage
}

export function DraftPageView({ page }: Props) {
  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>
          {page.kind === 'article' ? 'Черновик статьи' : 'Черновик услуги'}
        </p>
        <h1 className={styles.heading}>{page.title}</h1>
        <p className={styles.lead}>{page.lead}</p>

        <div className={styles.section}>
          <h2>Что будет на странице</h2>
          <ul className={styles.list}>
            {page.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <p className={styles.note}>
          Страница подготовлена как черновой URL второго уровня. Финальный текст, кейсы, источники,
          FAQ и коммерческие блоки будут добавлены перед открытием индексации.
        </p>
      </div>
    </section>
  )
}
