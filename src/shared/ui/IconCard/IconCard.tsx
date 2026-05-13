import type React from 'react'
import Link from 'next/link'
import { Icon } from '@/shared/ui/Icon'
import type { IconName } from '@/shared/ui/Icon'
import styles from './IconCard.module.scss'

type Props = {
  icon: IconName
  title: string
  description: string
  href?: string
  style?: React.CSSProperties
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function IconCard({
  icon,
  title,
  description,
  href,
  style,
  className,
  titleClassName,
  descriptionClassName,
}: Props) {
  return (
    <li
      className={[styles.root, href && styles.linked, className].filter(Boolean).join(' ')}
      style={style}
    >
      {href && <Link href={href} className={styles.overlay} aria-label={title} tabIndex={0} />}
      <span className={styles.iconWrap} aria-hidden="true">
        <Icon name={icon} size={24} />
      </span>
      <h3 className={[styles.title, titleClassName].filter(Boolean).join(' ')}>{title}</h3>
      <p className={[styles.desc, descriptionClassName].filter(Boolean).join(' ')}>{description}</p>
    </li>
  )
}
