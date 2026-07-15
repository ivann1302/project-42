'use client'

import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { useScrollReveal } from '@/shared/lib'
import { getLeadSourcePayload } from '@/shared/lib/leadSource'
import {
  trackYandexMetrikaLeadConversion,
  YANDEX_METRIKA_LEAD_THANK_YOU_URL,
} from '@/shared/lib/metrika'
import { StudioButton } from '@/shared/ui'
import styles from './RazrabotkaProcessCtaSection.module.scss'

const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? '/scripts/api/send.php'
const PHONE_PATTERN = /^\+?[\d\s\-()]{7,20}$/u
const TELEGRAM_USERNAME_PATTERN = /^@?[a-zA-Z0-9_]{5,32}$/u
const NETWORK_RETRY_DELAY_MS = 450

const contactMethods = [
  { label: 'Telegram', value: 'telegram' },
  { label: 'MAX', value: 'max' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Позвонить', value: 'phone' },
] as const

type ContactMethod = (typeof contactMethods)[number]['value']
type FieldName = 'name' | 'activity' | 'contact' | 'submit'

function createSubmissionId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function waitForNetworkRetry() {
  return new Promise((resolve) => window.setTimeout(resolve, NETWORK_RETRY_DELAY_MS))
}

async function sendContactRequest(payload: Record<string, unknown>) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (error) {
      if (attempt === 1) throw error
      await waitForNetworkRetry()
    }
  }

  throw new Error('Contact request failed')
}

export function RazrabotkaProcessCtaSection() {
  const router = useRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const submissionIdRef = useRef<string | null>(null)
  const [name, setName] = useState('')
  const [activity, setActivity] = useState('')
  const [method, setMethod] = useState<ContactMethod>('telegram')
  const [contact, setContact] = useState('')
  const [error, setError] = useState<{ field: FieldName; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  useScrollReveal(sectionRef, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })

  const isTelegram = method === 'telegram'
  const contactLabel = isTelegram ? 'Ваш ник в Telegram' : 'Ваш телефон'
  const contactPlaceholder = isTelegram ? '@username' : '+7 (___) ___-__-__'

  const resetSubmission = () => {
    submissionIdRef.current = null
    setError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (loading) return
    setError(null)

    const normalizedName = name.trim()
    const normalizedActivity = activity.trim()
    const rawContact = contact.trim()
    const normalizedContact =
      isTelegram && rawContact && !rawContact.startsWith('@') ? `@${rawContact}` : rawContact

    if (!normalizedName) {
      setError({ field: 'name', message: 'Укажите имя' })
      return
    }
    if (!normalizedActivity) {
      setError({ field: 'activity', message: 'Укажите сферу деятельности' })
      return
    }
    if (!normalizedContact) {
      setError({
        field: 'contact',
        message: isTelegram ? 'Укажите ник в Telegram' : 'Укажите телефон',
      })
      return
    }
    if (isTelegram && !TELEGRAM_USERNAME_PATTERN.test(normalizedContact)) {
      setError({ field: 'contact', message: 'Введите ник в Telegram: @username' })
      return
    }
    if (!isTelegram) {
      const digits = normalizedContact.replace(/\D/g, '')
      if (!PHONE_PATTERN.test(normalizedContact) || digits.length < 10 || digits.length > 15) {
        setError({ field: 'contact', message: 'Введите телефон в формате +7 999 000-00-00' })
        return
      }
    }

    const submissionId = submissionIdRef.current ?? createSubmissionId()
    submissionIdRef.current = submissionId
    setLoading(true)
    try {
      const response = await sendContactRequest({
        name: normalizedName,
        phone: isTelegram ? undefined : normalizedContact,
        contact: isTelegram ? normalizedContact : undefined,
        message: `CTA после этапов работы. Сфера деятельности: ${normalizedActivity}. Предпочтительный способ связи: ${method}. Контакт: ${normalizedContact}.`,
        service: 'Разработка сайта',
        _page: window.location.pathname,
        ...getLeadSourcePayload(
          'razrabotka_process_cta',
          'CTA-форма после секции «Как мы работаем»',
        ),
        _activity: normalizedActivity,
        _contactMethod: method,
        _contact: normalizedContact,
        _requestId: submissionId,
      })

      if (!response.ok) throw new Error('Request failed')
      await trackYandexMetrikaLeadConversion()
      router.push(YANDEX_METRIKA_LEAD_THANK_YOU_URL)
    } catch {
      setError({ field: 'submit', message: 'Не удалось отправить. Попробуйте позже.' })
      setLoading(false)
    }
  }

  return (
    <section ref={sectionRef} className={styles.root} aria-labelledby="process-cta-title">
      <div className={styles.panel}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>Следующий шаг — за нами</span>
          <h2 className={styles.title} id="process-cta-title">
            Обсудим ваш будущий сайт
          </h2>
          <p className={styles.description}>
            Расскажите о задаче — предложим структуру, формат и понятный план запуска без навязчивых
            продаж.
          </p>
          <div className={styles.promise}>
            <span className={styles.promiseAccent}>Ответим</span>
            <span>в течение дня</span>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="process-cta-name">Как вас зовут?</label>
            <input
              id="process-cta-name"
              className={clsx(error?.field === 'name' && styles.inputError)}
              value={name}
              placeholder="Иван"
              autoComplete="name"
              onChange={(event) => {
                setName(event.target.value)
                resetSubmission()
              }}
              aria-invalid={error?.field === 'name'}
            />
            {error?.field === 'name' && <span className={styles.error}>{error.message}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="process-cta-activity">Сфера деятельности</label>
            <input
              id="process-cta-activity"
              className={clsx(error?.field === 'activity' && styles.inputError)}
              value={activity}
              placeholder="Например, медицина или обучение"
              onChange={(event) => {
                setActivity(event.target.value)
                resetSubmission()
              }}
              aria-invalid={error?.field === 'activity'}
            />
            {error?.field === 'activity' && <span className={styles.error}>{error.message}</span>}
          </div>

          <fieldset className={styles.methods}>
            <legend>Где связаться?</legend>
            <div className={styles.methodGrid}>
              {contactMethods.map((item) => (
                <label
                  className={clsx(styles.method, method === item.value && styles.methodActive)}
                  key={item.value}
                >
                  <input
                    type="radio"
                    name="processContactMethod"
                    value={item.value}
                    checked={method === item.value}
                    onChange={() => {
                      setMethod(item.value)
                      setContact('')
                      resetSubmission()
                    }}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className={styles.field}>
            <label htmlFor="process-cta-contact">{contactLabel}</label>
            <input
              id="process-cta-contact"
              className={clsx(error?.field === 'contact' && styles.inputError)}
              type={isTelegram ? 'text' : 'tel'}
              inputMode={isTelegram ? 'text' : 'tel'}
              value={contact}
              placeholder={contactPlaceholder}
              autoComplete={isTelegram ? 'off' : 'tel'}
              onChange={(event) => {
                setContact(event.target.value)
                resetSubmission()
              }}
              aria-invalid={error?.field === 'contact'}
            />
            {error?.field === 'contact' && <span className={styles.error}>{error.message}</span>}
          </div>

          <StudioButton
            className={styles.submit}
            type="submit"
            variant="yellow"
            size="md"
            icon={null}
            aria-disabled={loading}
          >
            {loading ? 'Отправляем...' : 'Получить рекомендации'}
          </StudioButton>
          {error?.field === 'submit' && <span className={styles.error}>{error.message}</span>}
          <p className={styles.consent}>
            Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
          </p>
        </form>
      </div>
    </section>
  )
}
