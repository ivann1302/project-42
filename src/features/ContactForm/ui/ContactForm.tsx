'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/ui'
import { contactSchema, type ContactFormData } from '../model/schema'
import styles from './ContactForm.module.scss'

const SERVICES = [
  'Лендинг',
  'Корпоративный сайт',
  'GEO-оптимизация',
  'Поддержка и развитие',
  'Другое',
]

type Props = { onSuccess?: () => void }

export function ContactForm({ onSuccess }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { _honeypot: '' },
  })

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      reset()
      onSuccess?.()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success}>
        <span className={styles.successIcon}>✓</span>
        <p>Заявка отправлена! Свяжемся в течение 24 часов.</p>
      </div>
    )
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
          className={[styles.input, errors.name && styles.inputError].filter(Boolean).join(' ')}
          placeholder="Иван Иванов"
          {...register('name')}
        />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Телефон *</label>
        <input
          type="tel"
          className={[styles.input, errors.phone && styles.inputError].filter(Boolean).join(' ')}
          placeholder="+7 (___) ___-__-__"
          {...register('phone')}
        />
        {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Тип проекта</label>
        <select className={styles.input} {...register('service')}>
          <option value="">Выберите тип проекта</option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
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
