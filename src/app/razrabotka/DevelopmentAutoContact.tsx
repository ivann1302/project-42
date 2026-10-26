'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Modal } from '@/shared/ui/Modal/Modal'
import contactModalStyles from './DevelopmentContactModal.module.scss'

const ContactForm = dynamic(() =>
  import('@/features/ContactForm/ui/ContactForm').then((module) => module.ContactForm),
)

const STORAGE_KEY = 'development-contact-prompt-handled'
const PROMPT_DELAY = 30_000
let handledInMemory = false

function wasHandled() {
  if (handledInMemory) return true
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function rememberHandled() {
  handledInMemory = true
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // The in-memory flag still prevents repeats when storage is unavailable.
  }
}

export function DevelopmentAutoContact() {
  const rootRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(false)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (wasHandled()) return

    let handled = false
    let remaining = PROMPT_DELAY
    let startedAt: number | null = null
    let timer: number | undefined
    let openingTimer: number | undefined

    const pauseTimer = () => {
      window.clearTimeout(timer)
      timer = undefined
      window.clearTimeout(openingTimer)
      openingTimer = undefined
      if (startedAt !== null) {
        remaining = Math.max(0, remaining - (performance.now() - startedAt))
        startedAt = null
      }
    }

    const finish = () => {
      handled = true
      pauseTimer()
      observer.disconnect()
      rememberHandled()
    }

    const check = (readyToOpen = false) => {
      if (handled) return

      const dialogs = Array.from(
        document.querySelectorAll<HTMLElement>('[role="dialog"], dialog[open]'),
      ).filter(
        (dialog) =>
          !rootRef.current?.contains(dialog) &&
          dialog.getClientRects().length > 0 &&
          !dialog.closest('[hidden], [aria-hidden="true"]') &&
          window.getComputedStyle(dialog).visibility !== 'hidden',
      )
      const manualContactOpen = dialogs.some((dialog) =>
        dialog.querySelector(`.${contactModalStyles.modal}`),
      )
      const inlineForm = document.querySelector<HTMLFormElement>('#cta form')
      const inlineFormStarted =
        (document.activeElement && inlineForm?.contains(document.activeElement)) ||
        Array.from(
          inlineForm?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
            'input:not([aria-hidden]), textarea',
          ) ?? [],
        ).some((field) => field.value.trim() !== '')

      if (manualContactOpen || inlineFormStarted) {
        finish()
        return
      }
      if (document.hidden) {
        pauseTimer()
        return
      }
      if (remaining <= 0) {
        // Menus and other dialogs can finish before the automatic prompt appears.
        if (dialogs.length) return
        if (!readyToOpen) {
          if (openingTimer === undefined) {
            // Let the previous dialog finish its close event and scroll-lock cleanup.
            openingTimer = window.setTimeout(() => {
              openingTimer = undefined
              check(true)
            }, 0)
          }
          return
        }
        previousFocusRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null
        finish()
        setOpen(true)
        return
      }
      if (timer === undefined) {
        startedAt = performance.now()
        timer = window.setTimeout(() => {
          pauseTimer()
          check()
        }, remaining)
      }
    }

    const onFormInteraction = (event: Event) => {
      if (handled || !(event.target instanceof Element)) return
      if (event.target.closest('#cta form')) finish()
    }

    const reevaluate = () => check()
    const observer = new MutationObserver(reevaluate)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['open', 'hidden', 'aria-hidden', 'role'],
    })
    document.addEventListener('visibilitychange', reevaluate)
    document.addEventListener('focusin', onFormInteraction)
    document.addEventListener('input', onFormInteraction)
    document.addEventListener('change', onFormInteraction)
    check()

    return () => {
      pauseTimer()
      observer.disconnect()
      document.removeEventListener('visibilitychange', reevaluate)
      document.removeEventListener('focusin', onFormInteraction)
      document.removeEventListener('input', onFormInteraction)
      document.removeEventListener('change', onFormInteraction)
    }
  }, [])

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) {
        wasOpenRef.current = false
        if (previousFocusRef.current?.isConnected) {
          previousFocusRef.current.focus({ preventScroll: true })
        }
      }
      return
    }

    wasOpenRef.current = true
    const dialog = rootRef.current?.querySelector<HTMLElement>('[role="dialog"]')
    dialog?.querySelector<HTMLButtonElement>('[aria-label="Закрыть"]')?.focus({
      preventScroll: true,
    })

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !dialog) return
      const controls = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button, input, textarea, select, [tabindex]',
        ),
      ).filter(
        (control) =>
          control.tabIndex >= 0 &&
          !control.matches(':disabled') &&
          !control.closest('[hidden], [aria-hidden="true"]') &&
          control.getClientRects().length > 0,
      )
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (!first || !last) {
        event.preventDefault()
        return
      }
      const outside = !dialog.contains(document.activeElement)
      if (event.shiftKey && (document.activeElement === first || outside)) {
        event.preventDefault()
        last.focus({ preventScroll: true })
      } else if (!event.shiftKey && (document.activeElement === last || outside)) {
        event.preventDefault()
        first.focus({ preventScroll: true })
      }
    }

    document.addEventListener('keydown', trapFocus)
    return () => document.removeEventListener('keydown', trapFocus)
  }, [open])

  return (
    <div ref={rootRef} data-development-auto-contact>
      <Modal
        open={open}
        onClose={close}
        title="Обсудим проект?"
        className={contactModalStyles.modal}
      >
        <ContactForm onSuccess={close} />
      </Modal>
    </div>
  )
}
