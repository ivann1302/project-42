import styles from './DevelopmentPromotion.module.scss'

export function DevelopmentPromotion() {
  return (
    <section className={styles.root} id="promotion" aria-labelledby="development-promotion-title">
      <div className={styles.inner} data-development-reveal="rise">
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 18 12-12" />
          <circle cx="7" cy="7" r="2.5" />
          <circle cx="17" cy="17" r="2.5" />
        </svg>
        <h2 className={styles.title} id="development-promotion-title">
          Продвижение со скидкой
        </h2>
        <div className={styles.details}>
          <ul className={styles.services} role="list">
            <li>
              <div>
                <strong>SEO-продвижение</strong>
                <p className={styles.description}>Улучшаем сайт и контент для поиска.</p>
              </div>
            </li>
            <li>
              <div>
                <strong>Продвижение в нейросетях</strong>
                <p className={styles.description}>Готовим материалы для ответов нейросетей.</p>
              </div>
            </li>
            <li>
              <div>
                <strong>Реклама в Яндекс Директе</strong>
                <p className={styles.description}>Настройка и ведение кампаний.</p>
              </div>
            </li>
          </ul>
          <p className={styles.copy}>
            При заказе сайта — скидка на продвижение. Размер обсудим лично.
          </p>
        </div>
      </div>
    </section>
  )
}
