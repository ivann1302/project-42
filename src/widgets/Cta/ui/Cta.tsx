'use client'

import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Container, StarField } from '@/shared/ui'
import { useScrollReveal } from '@/shared/lib'
import { getLeadSourcePayload } from '@/shared/lib/leadSource'
import {
  trackYandexMetrikaLeadConversion,
  YANDEX_METRIKA_LEAD_THANK_YOU_URL,
} from '@/shared/lib/metrika'
import styles from './Cta.module.scss'

const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? '/scripts/api/send.php'
const CONTENT_OPTIONS = ['Да, всё готово', 'Частично готов', 'Нужно подготовить'] as const
const URGENCY_OPTIONS = ['Как можно быстрее', 'В течение недели', 'Не тороплюсь'] as const
const CONTACT_METHOD_OPTIONS = ['Telegram', 'WhatsApp', 'MAX', 'По телефону'] as const
const TOTAL_STEPS = 4
const PHONE_CONTACT_METHODS = new Set<string>(['WhatsApp', 'По телефону'])
const PHONE_PATTERN = /^\+?[\d\s\-()]{7,20}$/u
const TELEGRAM_USERNAME_PATTERN = /^@?[a-zA-Z0-9_]{5,32}$/u

type Props = {
  eyebrow?: string
  heading?: string
  sub?: string
  buttonText?: string
  modalTitle?: string
}

type QuizAnswers = {
  sphere: string
  content: string
  urgency: string
  contact: string
  contactMethod: string
  _honeypot: string
}

export function Cta({
  eyebrow = 'Готовы начать?',
  heading = 'Сейчас мы открыты\nдля 1–2 новых проектов',
  sub = 'Расскажите о задаче — решим, подходим ли мы друг другу. Это бесплатно.',
  buttonText = 'Забронировать место',
  modalTitle = 'Обсудить проект',
}: Props) {
  const router = useRouter()
  const innerRef = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({
    sphere: '',
    content: '',
    urgency: '',
    contact: '',
    contactMethod: '',
    _honeypot: '',
  })
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  useScrollReveal(innerRef, { threshold: 0.2 })

  const updateAnswer = (field: keyof QuizAnswers, value: string) => {
    setAnswers((current) => ({ ...current, [field]: value }))
    setError('')
    if (status === 'error') setStatus('idle')
  }

  const getCurrentAnswer = (override: Partial<QuizAnswers> = {}) => {
    const values = { ...answers, ...override }

    if (step === 0) return values.sphere.trim()
    if (step === 1) return values.content
    if (step === 2) return values.urgency
    return values.contact.trim() && values.contactMethod
  }

  const normalizeContact = (values: QuizAnswers) => {
    const contact = values.contact.trim()

    if (values.contactMethod !== 'Telegram' || !contact) return contact

    return contact.startsWith('@') ? contact : `@${contact}`
  }

  const isValidPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')

    return PHONE_PATTERN.test(value) && digits.length >= 10 && digits.length <= 15
  }

  const nextStep = (override?: Partial<QuizAnswers>) => {
    if (!getCurrentAnswer(override)) {
      setError('Заполните этот шаг, чтобы продолжить.')
      return
    }
    setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1))
  }

  const prevStep = () => {
    setError('')
    setStep((current) => Math.max(current - 1, 0))
  }

  const submitQuiz = async (override: Partial<QuizAnswers> = {}) => {
    const values = { ...answers, ...override }

    const normalizedContact = normalizeContact(values)

    if (!normalizedContact) {
      setError('Укажите телефон или ник в Telegram.')
      return
    }

    if (!values.contactMethod) {
      setError('Выберите удобный способ связи.')
      return
    }

    if (values.contactMethod === 'Telegram' && !TELEGRAM_USERNAME_PATTERN.test(normalizedContact)) {
      setError('Введите ник в Telegram: @username')
      return
    }

    if (PHONE_CONTACT_METHODS.has(values.contactMethod) && !isValidPhone(normalizedContact)) {
      setError('Введите телефон в формате +7 999 000-00-00')
      return
    }

    setStatus('loading')
    setError('')

    try {
      const message = [
        'Ответы из квиза CTA:',
        `Сфера деятельности: ${values.sphere}`,
        `Контент для сайта: ${values.content}`,
        `Срочность: ${values.urgency}`,
        `Контакт: ${normalizedContact}`,
        `Удобнее связаться: ${values.contactMethod}`,
      ].join('\n')
      const isPhoneContact = PHONE_CONTACT_METHODS.has(values.contactMethod)

      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Заявка из квиза CTA',
          phone: isPhoneContact ? normalizedContact : undefined,
          contact: isPhoneContact ? undefined : normalizedContact,
          service: 'Квиз на сайте',
          message,
          _honeypot: values._honeypot,
          _page: window.location.pathname,
          ...getLeadSourcePayload('cta_quiz', 'CTA-квиз на сайте'),
          quiz: {
            sphere: values.sphere,
            content: values.content,
            urgency: values.urgency,
            contact: normalizedContact,
            contactMethod: values.contactMethod,
          },
        }),
      })

      if (!res.ok) throw new Error()
      await trackYandexMetrikaLeadConversion()
      router.push(YANDEX_METRIKA_LEAD_THANK_YOU_URL)
    } catch {
      setStatus('error')
    }
  }

  const handleQuizSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'loading') return

    if (step < TOTAL_STEPS - 1) {
      nextStep()
      return
    }

    void submitQuiz()
  }

  const handleOptionEnter = (
    e: KeyboardEvent<HTMLButtonElement>,
    field: keyof QuizAnswers,
    value: string,
  ) => {
    if (e.key !== 'Enter') return

    e.preventDefault()
    const override = { [field]: value } as Partial<QuizAnswers>
    updateAnswer(field, value)

    if (step < TOTAL_STEPS - 1) {
      nextStep(override)
      return
    }

    void submitQuiz(override)
  }

  const currentStep = step + 1

  return (
    <section ref={innerRef} className={styles.root} id="cta">
      <StarField />
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />
      <div className={styles.blob3} aria-hidden="true" />
      <Container className={styles.inner}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.heading}>
          {heading.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h2>
        <p className={styles.sub}>{sub}</p>
        <div className={styles.quizPanel}>
          <div className={styles.quizHeader}>
            <h3 className={styles.quizTitle}>{modalTitle}</h3>
          </div>

          <form className={styles.quiz} onSubmit={handleQuizSubmit} noValidate>
            <input
              type="text"
              tabIndex={-1}
              aria-hidden
              className={styles.honeypot}
              value={answers._honeypot}
              onChange={(e) => updateAnswer('_honeypot', e.target.value)}
            />

            <div className={styles.quizProgress}>
              <span>
                Шаг {currentStep} из {TOTAL_STEPS}
              </span>
              <div className={styles.progressTrack} aria-hidden="true">
                <span
                  className={styles.progressValue}
                  style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>

            {step === 0 && (
              <div className={styles.quizStep}>
                <label className={styles.quizLabel} htmlFor="quiz-sphere">
                  Сфера деятельности
                </label>
                <input
                  id="quiz-sphere"
                  className={styles.quizInput}
                  value={answers.sphere}
                  placeholder="Строительство, медицина, и т.д."
                  onChange={(e) => updateAnswer('sphere', e.target.value)}
                />
              </div>
            )}

            {step === 1 && (
              <fieldset className={styles.quizStep}>
                <legend className={styles.quizLabel}>
                  Есть ли контент для сайта: текст, изображения и другое?
                </legend>
                <div className={styles.optionGrid}>
                  {CONTENT_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={[
                        styles.optionButton,
                        answers.content === option ? styles.optionButtonActive : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => updateAnswer('content', option)}
                      onKeyDown={(e) => handleOptionEnter(e, 'content', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset className={styles.quizStep}>
                <legend className={styles.quizLabel}>Как срочно нужно?</legend>
                <div className={styles.optionGrid}>
                  {URGENCY_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={[
                        styles.optionButton,
                        answers.urgency === option ? styles.optionButtonActive : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => updateAnswer('urgency', option)}
                      onKeyDown={(e) => handleOptionEnter(e, 'urgency', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 3 && (
              <div className={styles.quizStep}>
                <label className={styles.quizLabel} htmlFor="quiz-contact">
                  Телефон или ник в Telegram
                </label>
                <input
                  id="quiz-contact"
                  className={styles.quizInput}
                  value={answers.contact}
                  placeholder="+7 999 000-00-00 или @username"
                  required
                  onChange={(e) => updateAnswer('contact', e.target.value)}
                />
                <fieldset className={styles.inlineFieldset}>
                  <legend className={styles.quizLabel}>Как удобнее связаться?</legend>
                  <div className={styles.optionGrid}>
                    {CONTACT_METHOD_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={[
                          styles.optionButton,
                          answers.contactMethod === option ? styles.optionButtonActive : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => updateAnswer('contactMethod', option)}
                        onKeyDown={(e) => handleOptionEnter(e, 'contactMethod', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {error && <p className={styles.quizError}>{error}</p>}
            {status === 'error' && (
              <p className={styles.quizError}>Ошибка отправки. Попробуйте позже.</p>
            )}

            <div className={styles.quizActions}>
              {step > 0 && (
                <Button type="button" variant="ghost" size="md" onClick={prevStep}>
                  Назад
                </Button>
              )}
              {step < TOTAL_STEPS - 1 ? (
                <Button type="submit" size="md">
                  Далее
                </Button>
              ) : (
                <Button type="submit" size="md" loading={status === 'loading'}>
                  {buttonText}
                </Button>
              )}
            </div>
          </form>
        </div>
      </Container>
    </section>
  )
}
