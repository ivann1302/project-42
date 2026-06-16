import type { PropsWithClassName } from '@/shared/types'
import styles from './SectionTitle.module.scss'

type Props = PropsWithClassName & {
  eyebrow?: string
  children: React.ReactNode
  align?: 'left' | 'center'
  light?: boolean
  headingClassName?: string
}

export function SectionTitle({
  eyebrow,
  children,
  align = 'left',
  light,
  className,
  headingClassName,
}: Props) {
  const cls = [styles.root, styles[align], light && styles.light, className]
    .filter(Boolean)
    .join(' ')
  const headingCls = [styles.heading, headingClassName].filter(Boolean).join(' ')

  return (
    <div className={cls}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 className={headingCls}>{children}</h2>
    </div>
  )
}
