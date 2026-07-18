import styles from './NoBuilderNote.module.scss'

const advantages = [
  'Уникальный дизайн без шаблонов',
  'Быстрая загрузка без лишнего кода',
  'Чистая структура для SEO',
  'Нет обязательных тарифов конструктора',
] as const

export function NoBuilderNote() {
  return (
    <aside className={styles.root} aria-labelledby="no-builder-note-title">
      <h3 className={styles.title} id="no-builder-note-title">
        Без конструкторов
      </h3>
      <ul className={styles.advantages}>
        {advantages.map((advantage) => (
          <li className={styles.advantage} key={advantage}>
            <span className={styles.check} aria-hidden="true">
              ✓
            </span>
            <span>{advantage}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}
