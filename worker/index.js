export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return corsResponse(null, 204)
    }

    if (request.method !== 'POST') {
      return corsResponse({ success: false }, 405)
    }

    let data
    try {
      data = await request.json()
    } catch {
      return corsResponse({ success: false }, 400)
    }

    // Honeypot check
    if (data._honeypot) {
      return corsResponse({ success: true }, 200)
    }

    const name    = String(data.name    ?? '').trim()
    const phone   = String(data.phone   ?? '').trim()
    const email   = String(data.email   ?? '').trim()
    const service = String(data.service ?? '').trim()
    const message = String(data.message ?? '').trim()

    const now = new Intl.DateTimeFormat('ru', {
      timeZone: 'Europe/Moscow',
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date())

    const lines = [
      `📬 <b>Новая заявка — Project 42</b>`,
      ``,
      `👤 <b>Имя:</b> ${name}`,
      phone   ? `📞 <b>Телефон:</b> ${phone}`   : null,
      email   ? `✉️ <b>Email:</b> ${email}`      : null,
      service ? `🎯 <b>Услуга:</b> ${service}`   : null,
      message ? `💬 <b>Сообщение:</b> ${message}` : null,
      ``,
      `🕐 ${now} (МСК)`,
    ].filter((l) => l !== null).join('\n')

    const res = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: lines,
          parse_mode: 'HTML',
        }),
      }
    )

    const json = await res.json()
    if (json.ok) {
      return corsResponse({ success: true }, 200)
    }

    return corsResponse({ success: false }, 500)
  },
}

function corsResponse(body, status) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }
  return new Response(body ? JSON.stringify(body) : null, { status, headers })
}
