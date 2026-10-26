'use client'

import { useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Select } from '@/shared/ui'
import { getLeadSourcePayload } from '@/shared/lib/leadSource'
import {
  trackYandexMetrikaLeadConversion,
  YANDEX_METRIKA_LEAD_THANK_YOU_URL,
} from '@/shared/lib/metrika'
import { contactSchema, type ContactFormData } from '../model/schema'
import styles from './ContactForm.module.scss'

const SERVICES = [
  'Лендинг',
  'Корпоративный сайт',
  'Интернет-магазин',
  'SEO-оптимизация',
  'Поддержка и развитие',
  'Настройка и запуск рекламы',
  'Другое',
]

const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? '/scripts/api/send.php'

type Props = { onSuccess?: () => void; initialService?: string }
export function ContactForm({ onSuccess, initialService }: Props) {
  const router = useRouter()
  const formId = useId()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { _honeypot: '', service: initialService ?? '' },
  })

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading')
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          _page: window.location.pathname,
          ...getLeadSourcePayload('contact_form', 'Обычная форма заявки'),
        }),
      })
      if (!res.ok) throw new Error()
      const result = await res.json()
      if (result?.ok !== true) throw new Error()
      reset()
      await trackYandexMetrikaLeadConversion()
      onSuccess?.()
      router.push(YANDEX_METRIKA_LEAD_THANK_YOU_URL)
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        tabIndex={-1}
        aria-hidden
        className={styles.honeypot}
        {...register('_honeypot')}
      />

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${formId}-name`}>
          Имя *
        </label>
        <input
          id={`${formId}-name`}
          autoComplete="name"
          className={clsx(styles.input, 'ym-disable-keys', errors.name && styles.inputError)}
          placeholder="Иван Иванов"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          {...register('name')}
        />
        {errors.name && (
          <span id={`${formId}-name-error`} className={styles.error}>
            {errors.name.message}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${formId}-phone`}>
          Телефон
        </label>
        <input
          id={`${formId}-phone`}
          type="tel"
          autoComplete="tel"
          className={clsx(styles.input, 'ym-disable-keys', errors.phone && styles.inputError)}
          placeholder="+7 (___) ___-__-__"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? `${formId}-phone-error` : undefined}
          {...register('phone')}
        />
        {errors.phone && (
          <span id={`${formId}-phone-error`} className={styles.error}>
            {errors.phone.message}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${formId}-email`}>
          Email
        </label>
        <input
          id={`${formId}-email`}
          type="email"
          autoComplete="email"
          className={clsx(styles.input, 'ym-disable-keys', errors.email && styles.inputError)}
          placeholder="example@company.ru"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          {...register('email')}
        />
        {errors.email && (
          <span id={`${formId}-email-error`} className={styles.error}>
            {errors.email.message}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label
          id={`${formId}-service-label`}
          className={styles.label}
          htmlFor={`${formId}-service`}
        >
          Тип проекта
        </label>
        <Controller
          name="service"
          control={control}
          render={({ field }) => (
            <Select
              id={`${formId}-service`}
              aria-labelledby={`${formId}-service-label`}
              options={SERVICES.map((s) => ({ label: s, value: s }))}
              value={field.value ?? ''}
              onChange={field.onChange}
              placeholder="Выберите тип проекта"
            />
          )}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${formId}-message`}>
          Сообщение
        </label>
        <textarea
          id={`${formId}-message`}
          className={clsx(styles.textarea, 'ym-disable-keys', errors.message && styles.inputError)}
          placeholder="Расскажите о вашем проекте..."
          rows={4}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          {...register('message')}
        />
        {errors.message && (
          <span id={`${formId}-message-error`} className={styles.error}>
            {errors.message.message}
          </span>
        )}
      </div>

      {status === 'error' && (
        <p className={styles.error} role="alert">
          Ошибка отправки. Попробуйте позже.
        </p>
      )}

      <Button type="submit" size="lg" loading={status === 'loading'} className={styles.submit}>
        Отправить заявку
      </Button>
    </form>
  )
}
