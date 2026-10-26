'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import styles from './DevelopmentHeader.module.scss'

const navigation = [
  { label: 'Наши работы', href: '#projects' },
  { label: 'Преимущества', href: '#benefits' },
  { label: 'Стоимость', href: '#pricing' },
] as const

export function DevelopmentHeader() {
  const menuId = useId()
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const header = headerRef.current
    const hero = header?.closest<HTMLElement>('#top')
    if (!header || !hero) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let previousProgress = ''

    const updatePosition = () => {
      frame = 0
      if (reducedMotion.matches) {
        header.style.removeProperty('--header-progress')
        previousProgress = ''
        return
      }

      const progress = Math.min(
        1,
        Math.max(0, -hero.getBoundingClientRect().top / Math.max(1, header.offsetHeight)),
      ).toFixed(4)
      if (progress === previousProgress) return
      previousProgress = progress
      header.style.setProperty('--header-progress', progress)
    }

    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updatePosition)
    }

    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    reducedMotion.addEventListener('change', requestUpdate)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      reducedMotion.removeEventListener('change', requestUpdate)
      header.style.removeProperty('--header-progress')
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const desktop = window.matchMedia('(min-width: 768px)')
    const closeOnDesktop = () => {
      if (desktop.matches) menuRef.current?.close()
    }
    desktop.addEventListener('change', closeOnDesktop)
    closeOnDesktop()

    return () => {
      document.body.style.overflow = previousOverflow
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [menuOpen])

  const openMenu = () => {
    menuRef.current?.showModal()
    setMenuOpen(true)
    closeRef.current?.focus()
  }

  const closeMenu = () => menuRef.current?.close()

  return (
    <>
      <header ref={headerRef} className={`${styles.header} ${menuOpen ? styles.headerHidden : ''}`}>
        <div className={styles.bar}>
          <Link className={styles.logo} href="/" prefetch={false}>
            Project <span>42</span>
          </Link>

          <nav className={styles.navigation} aria-label="Разделы страницы">
            <ul className={styles.navigationList}>
              {navigation.map(({ label, href }) => (
                <li key={href}>
                  <Link className={styles.navigationLink} href={href} data-label={label}>
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            className={styles.menuButton}
            type="button"
            aria-label="Открыть меню"
            aria-controls={menuId}
            aria-expanded={menuOpen}
            onClick={openMenu}
          >
            <span className={styles.menuIcon} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <dialog
        ref={menuRef}
        id={menuId}
        className={styles.menu}
        aria-label="Меню"
        onClose={() => setMenuOpen(false)}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return

          const controls = event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled])',
          )
          const first = controls[0]
          const last = controls[controls.length - 1]

          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
          }
        }}
      >
        <div className={`${styles.bar} ${styles.menuBar}`}>
          <Link className={styles.logo} href="/" prefetch={false} onClick={closeMenu}>
            Project <span>42</span>
          </Link>
          <button
            ref={closeRef}
            className={styles.menuButton}
            type="button"
            aria-label="Закрыть меню"
            onClick={closeMenu}
          >
            <span className={`${styles.menuIcon} ${styles.closeIcon}`} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>

        <nav className={styles.menuNavigation} aria-label="Разделы сайта">
          <ul className={styles.menuList}>
            {navigation.map(({ label, href }) => (
              <li className={styles.menuItem} key={href}>
                <Link href={href} onClick={closeMenu}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </>
  )
}
