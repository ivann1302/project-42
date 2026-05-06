import Link from 'next/link'
import clsx from 'clsx'
import type { PropsWithClassName } from '@/shared/types'
import styles from './Button.module.scss'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type Props = PropsWithClassName & {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  target?: string
  rel?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  type = 'button',
  disabled,
  loading,
  onClick,
  className,
  children,
}: Props) {
  const cls = clsx(styles.root, styles[variant], styles[size], className)

  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
      >
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={cls} disabled={disabled || loading} onClick={onClick}>
      {loading ? <span className={styles.spinner} /> : children}
    </button>
  )
}
