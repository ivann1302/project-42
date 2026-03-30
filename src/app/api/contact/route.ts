import { z } from 'zod'
import { NextResponse } from 'next/server'
import { sendTelegramMessage } from '@/shared/api/telegram'

const schema = z.object({
  name: z.string().min(2, 'Введите имя').max(100),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/, 'Некорректный телефон'),
  service: z.string().optional(),
  message: z.string().max(1000).optional(),
  _honeypot: z.string().max(0, 'Bot detected'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const now = new Intl.DateTimeFormat('ru', {
      timeZone: 'Europe/Moscow',
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date())

    const text = [
      `📬 <b>Новая заявка — Project 42</b>`,
      ``,
      `👤 <b>Имя:</b> ${data.name}`,
      `📞 <b>Телефон:</b> ${data.phone}`,
      data.service ? `🎯 <b>Услуга:</b> ${data.service}` : null,
      data.message ? `💬 <b>Сообщение:</b> ${data.message}` : null,
      ``,
      `🕐 ${now} (МСК)`,
    ]
      .filter((line) => line !== null)
      .join('\n')

    await sendTelegramMessage(text)

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, errors: err.flatten().fieldErrors }, { status: 422 })
    }
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
