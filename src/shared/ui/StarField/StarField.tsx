import styles from './StarField.module.scss'

type StarFieldProps = {
  blobColor?: string
  blobPosition?: 'top-right' | 'bottom-left'
  blobTop?: string
}

export function StarField({ blobColor, blobPosition = 'top-right', blobTop }: StarFieldProps) {
  const blobClass = blobPosition === 'bottom-left' ? styles.blobBottomLeft : styles.blobTopRight

  return (
    <>
      <div className={styles.stars1} aria-hidden="true" data-testid="star-layer" />
      <div className={styles.stars2} aria-hidden="true" data-testid="star-layer" />
      <div className={styles.stars3} aria-hidden="true" data-testid="star-layer" />
      {blobColor && (
        <div
          className={`${styles.blob} ${blobClass}`}
          aria-hidden="true"
          data-testid="starfield-blob"
          style={{
            background: `radial-gradient(ellipse at center, ${blobColor} 0%, transparent 65%)`,
            ...(blobTop !== undefined && { top: blobTop }),
          }}
        />
      )}
    </>
  )
}
