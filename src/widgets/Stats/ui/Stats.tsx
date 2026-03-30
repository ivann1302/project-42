import { Container } from '@/shared/ui'
import styles from './Stats.module.scss'

const stats = [
  { value: '100%', label: 'проектов сданы в срок' },
  { value: '×2', label: 'быстрее среднего за счёт AI' },
  { value: '≤5', label: 'проектов одновременно' },
  { value: '0', label: 'брошенных проектов' },
]

export function Stats() {
  return (
    <section className={styles.root}>
      <Container>
        <ul className={styles.list} role="list">
          {stats.map((stat) => (
            <li key={stat.label} className={styles.item}>
              <span className={styles.value}>{stat.value}</span>
              <span className={styles.label}>{stat.label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
