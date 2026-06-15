import Link from 'next/link'
import clsx from 'clsx'
import type { IconName } from '../Icon'
import { Icon } from '../Icon'
import styles from './StudioButton.module.scss'

type StudioButtonVariant = 'mint' | 'peach' | 'yellow' | 'outline'
type StudioButtonSize = 'md' | 'lg'

type Props = {
  children: React.ReactNode
  variant?: StudioButtonVariant
  size?: StudioButtonSize
  href?: string
  type?: 'button' | 'submit' | 'reset'
  className?: string
  icon?: IconName | null
  onClick?: () => void
}

export function StudioButton({
  children,
  variant = 'mint',
  size = 'lg',
  href,
  type = 'button',
  className,
  icon = 'externalLink',
  onClick,
}: Props) {
  const buttonClassName = clsx(styles.root, styles[variant], styles[size], className)
  const content = (
    <>
      <span>{children}</span>
      {icon && <Icon name={icon} size={16} />}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={buttonClassName}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={buttonClassName} onClick={onClick}>
      {content}
    </button>
  )
}
