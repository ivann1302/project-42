import type { ReactNode } from 'react'
import styles from './DevelopmentMotion.module.scss'

interface DevelopmentRevealTextProps {
  children: ReactNode
  entrance?: boolean
}

export function DevelopmentRevealText({ children, entrance = false }: DevelopmentRevealTextProps) {
  return (
    <span
      className={styles.mask}
      data-development-reveal={entrance ? undefined : 'heading'}
      data-development-enter={entrance ? 'heading' : undefined}
    >
      <span className={styles.text}>{children}</span>
    </span>
  )
}
