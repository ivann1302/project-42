import { Icon } from '@/shared/ui/Icon'
import type { IconName } from '@/shared/ui/Icon'
import styles from './IconCard.module.scss'

type Props = {
  icon: IconName
  title: string
  description: string
}

export function IconCard({ icon, title, description }: Props) {
  return (
    <li className={styles.root}>
      <span className={styles.iconWrap} aria-hidden="true">
        <Icon name={icon} size={24} />
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{description}</p>
    </li>
  )
}
