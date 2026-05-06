'use client'

import { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import type { PropsWithClassName } from '@/shared/types'
import { Icon } from '../Icon'
import styles from './Select.module.scss'

type Option = { label: string; value: string }

type Props = PropsWithClassName & {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function Select({ options, value, onChange, placeholder, className }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className={clsx(styles.root, className)}>
      <button
        type="button"
        className={clsx(styles.trigger, open && styles.open)}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={selected ? styles.value : styles.placeholder}>
          {selected ? selected.label : placeholder}
        </span>
        <Icon
          name="chevronDown"
          size={16}
          className={clsx(styles.arrow, open && styles.arrowOpen)}
        />
      </button>

      {open && (
        <ul className={styles.dropdown} role="listbox">
          {options.map((opt) => (
            <li key={opt.value} role="option" aria-selected={opt.value === value}>
              <button
                type="button"
                className={clsx(styles.option, opt.value === value && styles.optionActive)}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
