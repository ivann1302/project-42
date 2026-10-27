import styles from './DevelopmentPromises.module.scss'

const promises = [
  {
    title: 'Личное ведение без лишних менеджеров',
    viewBox: '0 0 120 120',
    strokeWidth: 4.5,
    icon: (
      <>
        <path className={styles.accentStroke} d="M7 43h14v40H7zM99 43h14v40H99z" />
        <path d="m21 49 10-8c5-4 9-5 15-4l14 3m39 9-9-8c-5-4-10-5-16-3l-11 4-17 15c-3 3-3 7 0 10 3 3 7 3 10 0l11-10 24 21" />
        <path d="m21 76 10 7c4 3 8 4 12 1l7-6m17-21 24 21c3 3 3 7 0 10-3 3-7 3-10 0L67 76m14 12c0 4-2 7-6 8-3 1-6 0-8-2L56 84m19 12c-1 4-4 6-8 6-2 0-4-1-6-3l-10-9" />
      </>
    ),
  },
  {
    title: 'Срок от 7 дней',
    viewBox: '0 0 24 24',
    strokeWidth: 1.1,
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path className={styles.accentStroke} d="M12 7v5l3.5 2" />
      </>
    ),
  },
  {
    title: 'По договору с гарантией и поддержкой',
    viewBox: '0 0 24 24',
    strokeWidth: 1.1,
    icon: (
      <>
        <path d="M6 2.5h8l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 20V4a1.5 1.5 0 0 1 1-1.5Z" />
        <path d="M14 2.5V7h4M8 11h7m-7 3h4" />
        <path className={styles.accentStroke} d="m8 18 1.5 1.5L13 16" />
      </>
    ),
  },
  {
    title: 'Не пропадаем после запуска и всегда остаёмся на связи',
    viewBox: '0 0 24 24',
    strokeWidth: 1.1,
    icon: (
      <>
        <path d="M20.5 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-3.5-.7L3 21l1.7-5.3A8.5 8.5 0 1 1 20.5 11.5Z" />
        <path className={styles.accentStroke} d="M8 11.5h8m-8 3h5" />
      </>
    ),
  },
] as const

export function DevelopmentPromises() {
  return (
    <section className={styles.root} aria-label="Преимущества работы с нами">
      <ul className={styles.grid}>
        {promises.map((promise) => (
          <li className={styles.card} key={promise.title}>
            <span className={styles.icon} aria-hidden="true">
              <svg
                viewBox={promise.viewBox}
                fill="none"
                stroke="currentColor"
                strokeWidth={promise.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                focusable="false"
              >
                {promise.icon}
              </svg>
            </span>
            <p className={styles.title}>{promise.title}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
