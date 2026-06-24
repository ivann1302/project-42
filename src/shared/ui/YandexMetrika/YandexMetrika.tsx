'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { shouldSkipYandexMetrikaHit, YANDEX_METRIKA_ID } from '@/shared/lib/metrika'

export function YandexMetrika() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isInitialRender = useRef(true)

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }

    const query = searchParams.toString()
    const url = `${window.location.origin}${pathname}${query ? `?${query}` : ''}`

    if (shouldSkipYandexMetrikaHit(url)) return

    window.ym?.(YANDEX_METRIKA_ID, 'hit', url)
  }, [pathname, searchParams])

  return null
}
