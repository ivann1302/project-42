import type { PropsWithClassName } from '@/shared/types'
import { icons, type IconName } from './icons'
import styles from './Icon.module.scss'

type Props = PropsWithClassName & {
  name: IconName
  size?: number
  color?: string
  'aria-hidden'?: boolean
}

export function Icon({
  name,
  size = 24,
  color,
  className,
  'aria-hidden': ariaHidden = true,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      color={color}
      aria-hidden={ariaHidden}
      className={[styles.root, className].filter(Boolean).join(' ')}
      dangerouslySetInnerHTML={{ __html: icons[name] }}
    />
  )
}
