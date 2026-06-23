'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Select } from '@/shared/ui'
import { getLeadSourcePayload } from '@/shared/lib/leadSource'
import { reachYandexMetrikaGoal, YANDEX_METRIKA_CONTACT_FORM_GOAL } from '@/shared/lib/metrika'
import { contactSchema, type ContactFormData } from '../model/schema'
import styles from './ContactForm.module.scss'

const SERVICES = [
  'Лендинг',
  'Корпоративный сайт',
  'SEO-оптимизация',
  'Поддержка и развитие',
  'Настройка и запуск рекламы',
  'Другое',
]

const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? '/scripts/api/send.php'

type Props = { onSuccess?: () => void }
export function ContactForm({ onSuccess }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { _honeypot: '' },
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
      reset()
      await reachYandexMetrikaGoal(YANDEX_METRIKA_CONTACT_FORM_GOAL)
      onSuccess?.()
      router.push('/thank-you')
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
        <label className={styles.label}>Имя *</label>
        <input
          className={clsx(styles.input, errors.name && styles.inputError)}
          placeholder="Иван Иванов"
          {...register('name')}
        />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Телефон</label>
        <input
          type="tel"
          className={clsx(styles.input, errors.phone && styles.inputError)}
          placeholder="+7 (___) ___-__-__"
          {...register('phone')}
        />
        {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input
          type="email"
          className={clsx(styles.input, errors.email && styles.inputError)}
          placeholder="example@company.ru"
          {...register('email')}
        />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Тип проекта</label>
        <Controller
          name="service"
          control={control}
          render={({ field }) => (
            <Select
              options={SERVICES.map((s) => ({ label: s, value: s }))}
              value={field.value ?? ''}
              onChange={field.onChange}
              placeholder="Выберите тип проекта"
            />
          )}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Сообщение</label>
        <textarea
          className={styles.textarea}
          placeholder="Расскажите о вашем проекте..."
          rows={4}
          {...register('message')}
        />
      </div>

      {status === 'error' && <p className={styles.error}>Ошибка отправки. Попробуйте позже.</p>}

      <Button type="submit" size="lg" loading={status === 'loading'} className={styles.submit}>
        Отправить заявку
      </Button>
    </form>
  )
}
