import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Введите имя').max(100),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/, 'Некорректный номер'),
  service: z.string().optional(),
  message: z.string().max(1000).optional(),
  _honeypot: z.string().max(0),
})

export type ContactFormData = z.infer<typeof contactSchema>
