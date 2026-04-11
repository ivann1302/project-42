import { z } from 'zod'

export const contactSchema = z
  .object({
    name: z.string().min(2, 'Введите имя').max(100),
    phone: z
      .string()
      .regex(/^\+?[\d\s\-()]{7,20}$/, 'Некорректный номер')
      .optional()
      .or(z.literal('')),
    email: z.string().email('Некорректный email').optional().or(z.literal('')),
    service: z.string().optional(),
    message: z.string().max(1000).optional(),
    _honeypot: z.string().max(0),
  })
  .refine((data) => data.phone || data.email, {
    message: 'Укажите телефон или email',
    path: ['phone'],
  })

export type ContactFormData = z.infer<typeof contactSchema>
