'use client'

import { forwardRef } from 'react'
import type { MouseEventHandler } from 'react'
import styles from './ShinyButton.module.scss'

type ShinyButtonProps = {
  label: string
  onClick: MouseEventHandler<HTMLButtonElement>
  className?: string
}

export const ShinyButton = forwardRef<HTMLButtonElement, ShinyButtonProps>(function ShinyButton(
  { label, onClick, className },
  ref,
) {
  return (
    <button
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(' ')}
      type="button"
      onClick={onClick}
    >
      <span>{label}</span>
    </button>
  )
})
