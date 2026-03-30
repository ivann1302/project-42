'use client'

import { useEffect, useCallback } from 'react'
import type { PropsWithChildrenAndClassName } from '@/shared/types'
import { Icon } from '../Icon'
import styles from './Modal.module.scss'

type Props = PropsWithChildrenAndClassName & {
  open: boolean
  onClose: () => void
  title?: string
}

export function Modal({ open, onClose, title, children, className }: Props) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal aria-label={title}>
      <div
        className={[styles.modal, className].filter(Boolean).join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          <button className={styles.close} onClick={onClose} aria-label="Закрыть">
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}
