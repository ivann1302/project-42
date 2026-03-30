import type { PropsWithClassName } from '@/shared/types'
import styles from './SectionTitle.module.scss'

type Props = PropsWithClassName & {
  eyebrow?: string
  children: React.ReactNode
  align?: 'left' | 'center'
  light?: boolean
}

export function SectionTitle({ eyebrow, children, align = 'left', light, className }: Props) {
  const cls = [styles.root, styles[align], light && styles.light, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 className={styles.heading}>{children}</h2>
    </div>
  )
}
