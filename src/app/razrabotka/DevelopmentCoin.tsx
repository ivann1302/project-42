import type { CSSProperties } from 'react'
import styles from './DevelopmentCoin.module.scss'

const edgeLayers = Array.from({ length: 13 }, (_, index) => index)

export function DevelopmentCoin({
  className = '',
  variant = 'braces',
}: {
  className?: string
  variant?: 'braces' | 'question'
}) {
  return (
    <div className={`${styles.scene} ${className}`} aria-hidden="true">
      <div className={styles.coin}>
        {edgeLayers.map((index) => (
          <span
            className={styles.edge}
            key={index}
            style={{ '--depth': `${index * 2 - 18}px` } as CSSProperties}
          />
        ))}
        <span className={styles.face}>
          {variant === 'question' ? (
            <span className={styles.questionMark}>?</span>
          ) : (
            <span className={styles.braces}>
              <span>{'{'}</span>
              <span>{'}'}</span>
            </span>
          )}
        </span>
      </div>
    </div>
  )
}
