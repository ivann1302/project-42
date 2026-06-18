'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { getLeadSourcePayload } from '@/shared/lib/leadSource'
import { Icon, StudioButton } from '@/shared/ui'
import styles from './RazrabotkaQuizSection.module.scss'

const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? '/scripts/api/send.php'
const PHONE_PATTERN = /^\+?[\d\s\-()]{7,20}$/u
const TELEGRAM_USERNAME_PATTERN = /^@?[a-zA-Z0-9_]{5,32}$/u
const AUTO_OPEN_DELAY_MS = 10_000

const contactMethods = [
  { label: 'Telegram', value: 'telegram' },
  { label: 'MAX', value: 'max' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Позвонить', value: 'phone' },
] as const

type ContactMethod = (typeof contactMethods)[number]['value']
type FormStatus = 'idle' | 'loading' | 'error'
type QuizStep = 1 | 2 | 3

export function RazrabotkaQuizSection() {
  const openedRef = useRef(false)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<QuizStep>(1)
  const [name, setName] = useState('')
  const [activity, setActivity] = useState('')
  const [method, setMethod] = useState<ContactMethod>('telegram')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [error, setError] = useState('')

  const isTelegram = method === 'telegram'
  const fieldLabel = isTelegram ? 'Ваш ник в Telegram' : 'Ваш телефон'
  const fieldPlaceholder = isTelegram ? '@username' : '+7 (___) ___-__-__'
  const inputType = isTelegram ? 'text' : 'tel'

  const getNormalizedContact = () => {
    const value = contact.trim()

    if (!isTelegram) return value
    if (!value) return value

    return value.startsWith('@') ? value : `@${value}`
  }

  const isValidPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')

    return PHONE_PATTERN.test(value) && digits.length >= 10 && digits.length <= 15
  }

  const openModal = () => {
    setStep(1)
    setError('')
    setStatus('idle')
    setOpen(true)
  }

  useEffect(() => {
    const openOnce = () => {
      if (openedRef.current) return
      openedRef.current = true
      openModal()
    }

    const timerId = window.setTimeout(openOnce, AUTO_OPEN_DELAY_MS)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [])

  useEffect(() => {
    const handleCtaClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        'a[href="#cta"], a[href="#contacts"]',
      )

      if (!link) return
      event.preventDefault()
      openedRef.current = true
      openModal()
    }

    document.addEventListener('click', handleCtaClick, true)

    return () => {
      document.removeEventListener('click', handleCtaClick, true)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open])

  const goToNextStep = () => {
    setError('')

    if (step === 1 && !name.trim()) {
      setError('Укажите имя')
      return
    }

    if (step === 2 && !activity.trim()) {
      setError('Укажите сферу деятельности')
      return
    }

    setStep((currentStep) => Math.min(currentStep + 1, 3) as QuizStep)
  }

  const handleSubmit = async () => {
    setError('')

    const normalizedContact = getNormalizedContact()
    const normalizedName = name.trim()
    const normalizedActivity = activity.trim()

    if (!normalizedName) {
      setStep(1)
      setError('Укажите имя')
      return
    }

    if (!normalizedActivity) {
      setStep(2)
      setError('Укажите сферу деятельности')
      return
    }

    if (!normalizedContact) {
      setError(isTelegram ? 'Укажите ник в Telegram' : 'Укажите телефон')
      return
    }

    if (isTelegram && !TELEGRAM_USERNAME_PATTERN.test(normalizedContact)) {
      setError('Введите ник в Telegram: @username')
      return
    }

    if (!isTelegram && !isValidPhone(normalizedContact)) {
      setError('Введите телефон в формате +7 999 000-00-00')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: normalizedName,
          phone: isTelegram ? undefined : normalizedContact,
          contact: isTelegram ? normalizedContact : undefined,
          message: `Модальное окно. Сфера деятельности: ${normalizedActivity}. Предпочтительный способ связи: ${method}. Контакт: ${normalizedContact}.`,
          service: 'Разработка сайта',
          _page: window.location.pathname,
          ...getLeadSourcePayload('razrabotka_time_modal', 'Модальный квиз на странице разработки'),
          _activity: normalizedActivity,
          _contactMethod: method,
          _contact: normalizedContact,
        }),
      })

      if (!response.ok) throw new Error('Request failed')

      window.location.assign('/thank-you')
    } catch {
      setStatus('error')
    }
  }

  if (!open) return null

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="razrabotka-quiz-title"
      onClick={() => setOpen(false)}
    >
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <button
          className={styles.close}
          type="button"
          aria-label="Закрыть"
          onClick={() => setOpen(false)}
        >
          <Icon name="close" size={20} />
        </button>

        <div className={styles.content}>
          <h2 className={styles.title} id="razrabotka-quiz-title">
            <span>Оставьте заявку</span>
          </h2>
          <p className={styles.text}>
            Мы проконсультируем вас совершенно бесплатно. Это вас ни к чему не обязывает.
          </p>
        </div>

        <div className={styles.form}>
          {step === 1 && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="razrabotka-quiz-name">
                Как вас зовут?
              </label>
              <input
                className={clsx(styles.input, error && styles.inputError)}
                id="razrabotka-quiz-name"
                type="text"
                placeholder="Иван"
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  setError('')
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'razrabotka-quiz-error' : undefined}
                autoFocus
              />
              {error && (
                <span className={styles.error} id="razrabotka-quiz-error">
                  {error}
                </span>
              )}
            </div>
          )}

          {step === 2 && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="razrabotka-quiz-activity">
                Сфера деятельности
              </label>
              <input
                className={clsx(styles.input, error && styles.inputError)}
                id="razrabotka-quiz-activity"
                type="text"
                placeholder="Например, ремонт, медицина, обучение"
                value={activity}
                onChange={(event) => {
                  setActivity(event.target.value)
                  setError('')
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'razrabotka-quiz-error' : undefined}
                autoFocus
              />
              {error && (
                <span className={styles.error} id="razrabotka-quiz-error">
                  {error}
                </span>
              )}
            </div>
          )}

          {step === 3 && (
            <>
              <fieldset className={styles.methods}>
                <legend className={styles.legend}>Где связаться?</legend>
                <div className={styles.methodGrid}>
                  {contactMethods.map((item) => (
                    <label
                      key={item.value}
                      className={clsx(styles.method, method === item.value && styles.methodActive)}
                    >
                      <input
                        type="radio"
                        name="contactMethod"
                        value={item.value}
                        checked={method === item.value}
                        onChange={() => {
                          setMethod(item.value)
                          setContact('')
                          setError('')
                        }}
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="razrabotka-quiz-contact">
                  {fieldLabel}
                </label>
                <input
                  className={clsx(styles.input, error && styles.inputError)}
                  id="razrabotka-quiz-contact"
                  type={inputType}
                  inputMode={isTelegram ? 'text' : 'tel'}
                  placeholder={fieldPlaceholder}
                  value={contact}
                  onChange={(event) => {
                    setContact(event.target.value)
                    setError('')
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'razrabotka-quiz-error' : undefined}
                  autoFocus
                />
                {error && (
                  <span className={styles.error} id="razrabotka-quiz-error">
                    {error}
                  </span>
                )}
                {status === 'error' && (
                  <span className={styles.error}>Не удалось отправить. Попробуйте позже.</span>
                )}
              </div>
            </>
          )}

          <div className={styles.controls}>
            <StudioButton
              className={styles.submit}
              type="button"
              variant="yellow"
              size="md"
              icon={null}
              onClick={step === 3 ? handleSubmit : goToNextStep}
            >
              {step === 3
                ? status === 'loading'
                  ? 'Отправляем...'
                  : 'Получить консультацию'
                : 'Далее'}
            </StudioButton>
          </div>
        </div>
      </div>
    </div>
  )
}
