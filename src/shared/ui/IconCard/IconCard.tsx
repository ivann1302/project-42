import type React from 'react'
import { Icon } from '@/shared/ui/Icon'
import type { IconName } from '@/shared/ui/Icon'
import styles from './IconCard.module.scss'

type Props = {
  icon: IconName
  title: string
  description: string
  style?: React.CSSProperties
  className?: string
}

export function IconCard({ icon, title, description, style, className }: Props) {
  return (
    <li className={[styles.root, className].filter(Boolean).join(' ')} style={style}>
      <span className={styles.iconWrap} aria-hidden="true">
        <Icon name={icon} size={24} />
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{description}</p>
    </li>
  )
}
