import Link from 'next/link'
import type { PropsWithClassName } from '@/shared/types'
import styles from './Button.module.scss'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type Props = PropsWithClassName & {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
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
  type = 'button',
  disabled,
  loading,
  onClick,
  className,
  children,
}: Props) {
  const cls = [styles.root, styles[variant], styles[size], className].filter(Boolean).join(' ')

  if (href) {
    return (
      <Link href={href} className={cls}>
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
