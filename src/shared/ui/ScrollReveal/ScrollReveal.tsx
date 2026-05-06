'use client'

import { useRef, type ElementType, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { useScrollReveal } from '@/shared/lib'

type Props<T extends ElementType> = {
  as?: T
  threshold?: number
  rootMargin?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'children'>

export function ScrollReveal<T extends ElementType = 'div'>({
  as,
  threshold = 0.15,
  rootMargin = '0px',
  children,
  ...rest
}: Props<T>) {
  const Tag = (as ?? 'div') as ElementType
  const ref = useRef<Element>(null)
  useScrollReveal(ref, { threshold, rootMargin })
  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  )
}
