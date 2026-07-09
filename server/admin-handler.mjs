import { timingSafeEqual } from 'node:crypto'
import {
  addLeadComment,
  createArticle,
  createExpense,
  createLead,
  deleteArticle,
  deleteExpense,
  listArticles,
  listExpenses,
  listLeads,
  updateLead,
} from './admin-store.mjs'

const MAX_BODY_BYTES = 1024 * 1024

export async function handleAdminApiRequest(req, res, requestUrl) {
  if (!isAdminAuthorized(req)) {
    requestBasicAuth(res)
    return
  }

  if (requestUrl.pathname === '/api/admin/leads' && req.method === 'GET') {
    const leads = await listLeads()
    const expenses = await listExpenses()
    const articles = await listArticles()
    sendJson(res, 200, {
      ok: true,
      leads,
      expenses,
      articles,
      summary: buildSummary(leads, expenses),
    })
    return
  }

  if (requestUrl.pathname === '/api/admin/leads' && req.method === 'POST') {
    const body = await readJsonBody(req, res)
    if (!body) return

    if (!hasManualLeadContent(body)) {
      sendJson(res, 422, {
        ok: false,
        error: 'Add at least a name, contact, service, or message',
      })
      return
    }

    const lead = await createLead({
      ...body,
      source: body.source || 'manual_admin',
      sourceLabel: body.sourceLabel || 'Добавлено вручную',
    })
    const patchedLead = await updateLead(lead.id, body)

    sendJson(res, 201, { ok: true, lead: patchedLead || lead })
    return
  }

  if (requestUrl.pathname === '/api/admin/expenses' && req.method === 'POST') {
    const body = await readJsonBody(req, res)
    if (!body) return

    const expense = await createExpense(body)
    if (!expense) {
      sendJson(res, 422, { ok: false, error: 'Add expense title and amount' })
      return
    }

    sendJson(res, 201, { ok: true, expense })
    return
  }

  if (requestUrl.pathname === '/api/admin/articles' && req.method === 'POST') {
    const body = await readJsonBody(req, res)
    if (!body) return

    const article = await createArticle(body)
    if (!article) {
      sendJson(res, 422, { ok: false, error: 'Add article title and URL' })
      return
    }

    sendJson(res, 201, { ok: true, article })
    return
  }

  const expenseMatch = requestUrl.pathname.match(/^\/api\/admin\/expenses\/([^/]+)$/)

  if (expenseMatch && req.method === 'DELETE') {
    const deleted = await deleteExpense(decodeURIComponent(expenseMatch[1]))

    if (!deleted) {
      sendJson(res, 404, { ok: false, error: 'Expense not found' })
      return
    }

    sendJson(res, 200, { ok: true })
    return
  }

  const articleMatch = requestUrl.pathname.match(/^\/api\/admin\/articles\/([^/]+)$/)

  if (articleMatch && req.method === 'DELETE') {
    const deleted = await deleteArticle(decodeURIComponent(articleMatch[1]))

    if (!deleted) {
      sendJson(res, 404, { ok: false, error: 'Article not found' })
      return
    }

    sendJson(res, 200, { ok: true })
    return
  }

  const leadMatch = requestUrl.pathname.match(/^\/api\/admin\/leads\/([^/]+)$/)

  if (leadMatch && req.method === 'PATCH') {
    const body = await readJsonBody(req, res)
    if (!body) return

    const lead = await updateLead(decodeURIComponent(leadMatch[1]), body)
    if (!lead) {
      sendJson(res, 404, { ok: false, error: 'Lead not found' })
      return
    }

    sendJson(res, 200, { ok: true, lead })
    return
  }

  const commentMatch = requestUrl.pathname.match(/^\/api\/admin\/leads\/([^/]+)\/comments$/)

  if (commentMatch && req.method === 'POST') {
    const body = await readJsonBody(req, res)
    if (!body) return

    const lead = await addLeadComment(decodeURIComponent(commentMatch[1]), body.text)
    if (!lead) {
      sendJson(res, 404, { ok: false, error: 'Lead not found' })
      return
    }

    sendJson(res, 200, { ok: true, lead })
    return
  }

  sendJson(res, 404, { ok: false, error: 'Not found' })
}

export function isAdminAuthorized(req) {
  const username = process.env.ADMIN_USERNAME || ''
  const password = process.env.ADMIN_PASSWORD || ''

  if (!username || !password) {
    return false
  }

  const header = req.headers.authorization || ''
  if (!header.startsWith('Basic ')) return false

  const decoded = Buffer.from(header.slice('Basic '.length), 'base64').toString('utf8')
  const separatorIndex = decoded.indexOf(':')

  if (separatorIndex === -1) return false

  return safeEqual(decoded.slice(0, separatorIndex), username) &&
    safeEqual(decoded.slice(separatorIndex + 1), password)
}

export function requestBasicAuth(res) {
  res.writeHead(401, {
    'Content-Type': 'text/plain; charset=utf-8',
    'WWW-Authenticate': 'Basic realm="Project 42 admin", charset="UTF-8"',
    'Cache-Control': 'no-store',
    ...getAdminSecurityHeaders(),
  })
  res.end('Authentication required')
}

async function readJsonBody(req, res) {
  let raw
  try {
    raw = await readRequestBody(req)
  } catch (error) {
    sendJson(res, error?.statusCode ?? 400, {
      ok: false,
      error: error?.statusCode === 413 ? 'Payload too large' : 'Invalid request',
    })
    return null
  }

  try {
    return JSON.parse(raw || '{}')
  } catch {
    sendJson(res, 400, { ok: false, error: 'Invalid JSON' })
    return null
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

function buildSummary(leads, expenses) {
  const leadSummary = leads.reduce(
    (summary, lead) => {
      const income = Number(lead.income) || 0
      const taxPercent = Number(lead.taxPercent) || 0
      const tax = Math.max(0, income * (taxPercent / 100))
      const profit = income - tax

      summary.total += 1
      summary.income += income
      summary.tax += tax
      summary.profit += profit
      if (lead.status === 'new') summary.new += 1
      if (lead.status === 'in_progress') summary.inProgress += 1
      if (lead.isCompleted) summary.completed += 1
      if (lead.isPaid) summary.paid += 1

      return summary
    },
    {
      total: 0,
      new: 0,
      inProgress: 0,
      completed: 0,
      paid: 0,
      income: 0,
      tax: 0,
      profit: 0,
      expenses: 0,
      netProfit: 0,
    },
  )

  leadSummary.expenses = expenses.reduce((total, expense) => total + (Number(expense.amount) || 0), 0)
  leadSummary.netProfit = leadSummary.profit - leadSummary.expenses

  return leadSummary
}

function hasManualLeadContent(body) {
  return [
    body.name,
    body.phone,
    body.email,
    body.contact,
    body.service,
    body.message,
  ].some((value) => String(value ?? '').trim())
}

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...getAdminSecurityHeaders(),
  })
  res.end(JSON.stringify(body))
}

export function getAdminSecurityHeaders() {
  return {
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'same-origin',
  }
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) return false

  return timingSafeEqual(leftBuffer, rightBuffer)
}
