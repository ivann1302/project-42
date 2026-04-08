import styles from './GlowBlob.module.scss'

type BlobColor = 'purple' | 'blue' | 'mint'

type Props = {
  color?: BlobColor
  size?: number
  /** Horizontal position in percent, default 50 */
  x?: number
  /** Vertical position in percent, default 50 */
  y?: number
  className?: string
}

export function GlowBlob({ color = 'purple', size = 800, x = 50, y = 50, className }: Props) {
  return (
    <div
      className={[styles.blob, styles[color], className].filter(Boolean).join(' ')}
      aria-hidden="true"
      style={
        {
          '--blob-size': `${size}px`,
          '--blob-x': `${x}%`,
          '--blob-y': `${y}%`,
        } as React.CSSProperties
      }
    />
  )
}
