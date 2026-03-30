import type { PropsWithChildrenAndClassName } from '@/shared/types'
import styles from './Container.module.scss'

export function Container({ children, className }: PropsWithChildrenAndClassName) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>
}
