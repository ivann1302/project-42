import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { createLead } from './admin-store.mjs'

const MAX_BODY_BYTES = 1024 * 1024
const SUBMISSION_CACHE_TTL_MS = 10 * 60 * 1000
const MAX_CACHED_SUBMISSIONS = 500
const submissionStates = new Map()

export async function handleContactRequest(req, res) {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'Method not allowed' })
    return
  }

  let body
  try {
    body = JSON.parse(await readRequestBody(req))
  } catch (error) {
    const status = error?.statusCode ?? 400
    sendJson(res, status, {
      ok: false,
      error: status === 413 ? 'Payload too large' : 'Invalid JSON',
    })
    return
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    sendJson(res, 400, { ok: false, error: 'Invalid JSON' })
    return
  }

  if (body._honeypot) {
    sendJson(res, 200, { ok: true })
    return
  }

  const normalized = normalizeContactBody(body)
  const errors = validateContactBody(normalized)

  if (Object.keys(errors).length > 0) {
    sendJson(res, 422, { ok: false, errors })
    return
  }

  const result = await processIdempotentSubmission(normalized)
  sendJson(res, result.statusCode, result.body)
}

async function processIdempotentSubmission(normalized) {
  if (!normalized.requestId) {
    return processContactSubmission(normalized, true)
  }

  const current = submissionStates.get(normalized.requestId)

  if (current?.status === 'pending') return current.promise
  if (current?.status === 'success') return current.result

  const shouldSaveLead = !current?.leadSaved
  const promise = processContactSubmission(normalized, shouldSaveLead).then((result) => {
    rememberSubmission(normalized.requestId, {
      leadSaved: Boolean(current?.leadSaved || result.leadSaved),
      result,
      status: result.body.ok ? 'success' : 'failed',
    })

    return result
  })

  rememberSubmission(normalized.requestId, {
    leadSaved: Boolean(current?.leadSaved),
    promise,
    status: 'pending',
  })

  return promise
}

async function processContactSubmission(normalized, shouldSaveLead) {
  let leadSaved = !shouldSaveLead

  if (shouldSaveLead) {
    try {
      await createLead(normalized)
      leadSaved = true
    } catch (error) {
      console.error('[contact] Failed to save lead:', error?.message || error)
    }
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN ?? ''
  const chatIds = getTelegramChatIds()

  if (!botToken || chatIds.length === 0) {
    console.error('[contact] Telegram env vars are not configured')
    return { body: { ok: true }, leadSaved, statusCode: 200 }
  }

  const text = buildTelegramMessage(normalized)
  let sent = false
  let lastTelegramError = ''

  for (const chatId of chatIds) {
    const { ok, error } = await sendTelegramMessage({ botToken, chatId, text })

    if (ok) {
      sent = true
      continue
    }

    lastTelegramError = sanitizeTelegramError(error, botToken)
    console.error('[contact] Telegram error:', lastTelegramError)
  }

  if (!sent) {
    return {
      body: {
        ok: false,
        error: 'Telegram error',
        details: lastTelegramError,
      },
      leadSaved,
      statusCode: 502,
    }
  }

  return { body: { ok: true }, leadSaved, statusCode: 200 }
}

function rememberSubmission(requestId, state) {
  const expiresAt = Date.now() + SUBMISSION_CACHE_TTL_MS
  const entry = { ...state, expiresAt }

  submissionStates.delete(requestId)
  submissionStates.set(requestId, entry)

  while (submissionStates.size > MAX_CACHED_SUBMISSIONS) {
    const oldestRequestId = submissionStates.keys().next().value
    if (!oldestRequestId) break
    submissionStates.delete(oldestRequestId)
  }

  const timeoutId = setTimeout(() => {
    if (submissionStates.get(requestId)?.expiresAt === expiresAt) {
      submissionStates.delete(requestId)
    }
  }, SUBMISSION_CACHE_TTL_MS)

  timeoutId.unref?.()
}

export async function loadEnv({ cwd = process.cwd(), documentRoot = '' } = {}) {
  const paths = [
    path.join(cwd, '.env.local'),
    path.join(cwd, '.env'),
    documentRoot ? path.join(documentRoot, '.env.local') : '',
    documentRoot ? path.join(documentRoot, '.env') : '',
    documentRoot ? path.join(path.dirname(documentRoot), '.env.local') : '',
    documentRoot ? path.join(path.dirname(documentRoot), '.env') : '',
  ].filter(Boolean)

  for (const envPath of paths) {
    await loadEnvFile(envPath)
  }
}

async function loadEnvFile(envPath) {
  let source
  try {
    source = await readFile(envPath, 'utf8')
  } catch {
    return
  }

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim()

    if (!line || line.startsWith('#') || !line.includes('=')) {
      continue
    }

    const separatorIndex = line.indexOf('=')
    const key = line.slice(0, separatorIndex).trim()
    let value = line.slice(separatorIndex + 1).trim()

    if (!key || process.env[key] !== undefined) {
      continue
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    process.env[key] = value
  }
}

async function readRequestBody(req) {
  const chunks = []
  let size = 0

  for await (const chunk of req) {
    size += chunk.length

    if (size > MAX_BODY_BYTES) {
      const error = new Error('Payload too large')
      error.statusCode = 413
      throw error
    }

    chunks.push(chunk)
  }

  return Buffer.concat(chunks).toString('utf8')
}

function normalizeContactBody(body) {
  return {
    name: toStringValue(body.name),
    phone: toStringValue(body.phone),
    email: toStringValue(body.email),
    contact: toStringValue(body.contact),
    service: toStringValue(body.service),
    message: toStringValue(body.message),
    page: toStringValue(body._page),
    source: toStringValue(body._source),
    sourceLabel: toStringValue(body._sourceLabel),
    sourceUrl: toStringValue(body._sourceUrl),
    landingPage: toStringValue(body._landingPage),
    referrer: toStringValue(body._referrer),
    utmSource: toStringValue(body._utm_source),
    utmMedium: toStringValue(body._utm_medium),
    utmCampaign: toStringValue(body._utm_campaign),
    utmTerm: toStringValue(body._utm_term),
    utmContent: toStringValue(body._utm_content),
    yclid: toStringValue(body._yclid),
    gclid: toStringValue(body._gclid),
    requestId: toStringValue(body._requestId),
  }
}

function validateContactBody(body) {
  const errors = {}
  const nameLength = body.name.length

  if (nameLength < 2 || nameLength > 100) {
    errors.name = ['Введите имя']
  }

  if (body.phone && !/^\+?[\d\s\-()]{7,20}$/u.test(body.phone)) {
    errors.phone = ['Некорректный номер']
  }

  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(body.email)) {
    errors.email = ['Некорректный email']
  }

  if (body.contact.length > 100) {
    errors.contact = ['Контакт слишком длинный']
  }

  if (!body.phone && !body.email && !body.contact) {
    errors.phone = ['Укажите телефон или email']
  }

  if (body.message.length > 1000) {
    errors.message = ['Сообщение слишком длинное']
  }

  if (body.requestId.length > 128) {
    errors._requestId = ['Некорректный идентификатор заявки']
  }

  return errors
}

function buildTelegramMessage(body) {
  const now = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date())

  const lines = [
    '📬 <b>Новая заявка — Project 42</b>',
    '',
    `👤 <b>Имя:</b> ${escapeHtml(body.name)}`,
  ]

  if (body.phone) lines.push(`📞 <b>Телефон:</b> ${escapeHtml(body.phone)}`)
  if (body.email) lines.push(`✉️ <b>Email:</b> ${escapeHtml(body.email)}`)
  if (body.contact) lines.push(`💬 <b>Контакт:</b> ${escapeHtml(body.contact)}`)
  if (body.service) lines.push(`🎯 <b>Услуга:</b> ${escapeHtml(body.service)}`)
  if (body.message) lines.push(`💬 <b>Сообщение:</b> ${escapeHtml(body.message)}`)
  if (body.page) lines.push(`🌐 <b>Страница:</b> ${escapeHtml(body.page)}`)

  const sourceLines = buildSourceLines(body)
  if (sourceLines.length > 0) {
    lines.push('', '🏷 <b>Источник лида</b>', ...sourceLines)
  }

  lines.push('', `🕒 <b>Время:</b> ${now} МСК`)

  return lines.join('\n')
}

function buildSourceLines(body) {
  const label = body.sourceLabel || body.source
  const lines = []

  if (label) lines.push(`Метка: ${escapeHtml(label)}`)
  if (body.sourceUrl) lines.push(`URL заявки: ${escapeHtml(body.sourceUrl)}`)
  if (body.landingPage && body.landingPage !== body.sourceUrl) {
    lines.push(`Первый вход: ${escapeHtml(body.landingPage)}`)
  }
  if (body.referrer) lines.push(`Referrer: ${escapeHtml(body.referrer)}`)

  const utm = [
    ['utm_source', body.utmSource],
    ['utm_medium', body.utmMedium],
    ['utm_campaign', body.utmCampaign],
    ['utm_term', body.utmTerm],
    ['utm_content', body.utmContent],
    ['yclid', body.yclid],
    ['gclid', body.gclid],
  ]
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value}`)

  if (utm.length > 0) lines.push(`UTM: ${escapeHtml(utm.join(', '))}`)

  return lines
}

async function sendTelegramMessage({ botToken, chatId, text }) {
  const parsedAttempts = Number.parseInt(process.env.TELEGRAM_RETRY_ATTEMPTS || '3', 10)
  const attempts = Number.isFinite(parsedAttempts) ? Math.min(4, Math.max(1, parsedAttempts)) : 3
  let lastResult = { ok: false, error: 'Telegram request failed', retryable: true }

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (attempt > 0) await wait(300 * 2 ** (attempt - 1))

    lastResult = await sendTelegramMessageOnce({ botToken, chatId, text })
    if (lastResult.ok || !lastResult.retryable) return lastResult
  }

  return lastResult
}

async function sendTelegramMessageOnce({ botToken, chatId, text }) {
  const apiBase = (process.env.TELEGRAM_API_BASE || 'https://api.telegram.org').replace(/\/+$/, '')
  const timeout = Math.max(1, Number.parseInt(process.env.TELEGRAM_TIMEOUT || '20', 10))
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout * 1000)

  try {
    const response = await fetch(`${apiBase}/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
      signal: controller.signal,
    })
    const responseText = await response.text()
    const data = parseJson(responseText)

    if (response.ok && data?.ok === true) {
      return { ok: true, error: '', retryable: false }
    }

    const description = data?.description || responseText || response.statusText
    return {
      ok: false,
      error: `code=${data?.error_code ?? response.status} ${description}`,
      retryable: response.status === 429 || response.status >= 500,
    }
  } catch (error) {
    return { ok: false, error: error?.message || 'fetch failed', retryable: true }
  } finally {
    clearTimeout(timeoutId)
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function getTelegramChatIds() {
  const raw = [
    process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID || '',
    process.env.TELEGRAM_CHAT_ID_2 || '',
  ]
    .filter(Boolean)
    .join(',')

  return raw
    .split(',')
    .map((chatId) => chatId.trim())
    .filter(Boolean)
}

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
  })
  res.end(JSON.stringify(body))
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CONTACT_ALLOWED_ORIGIN || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function sanitizeTelegramError(error, botToken) {
  return String(error || '')
    .replaceAll(botToken, '[telegram-token]')
    .slice(0, 500)
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function toStringValue(value) {
  return String(value ?? '').trim()
}

function parseJson(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}
