'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const destination = '/razrabotka'
const allowedPages = new Set([destination, '/admin', '/admin/', '/admin.html'])

export function PublicPageGate() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname && !allowedPages.has(pathname)) {
      window.location.replace(`${destination}${window.location.search}`)
    }
  }, [pathname])

  useEffect(() => {
    const redirectPageLink = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const anchor =
        event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null
      if (
        !anchor ||
        anchor.hasAttribute('download') ||
        (anchor.target && anchor.target !== '_self')
      ) {
        return
      }

      const url = new URL(anchor.href)
      if (url.origin !== window.location.origin || allowedPages.has(url.pathname)) return

      const extension = url.pathname
        .split('/')
        .at(-1)
        ?.match(/\.[^.]+$/)?.[0]
      if (extension && extension !== '.html') return

      event.preventDefault()
      window.location.replace(`${destination}${url.search}`)
    }

    document.addEventListener('click', redirectPageLink, true)
    return () => document.removeEventListener('click', redirectPageLink, true)
  }, [])

  return null
}
