import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

const DEFAULT_DATA_DIR = path.join(process.cwd(), 'data')
const STATUSES = new Set(['new', 'in_progress', 'done', 'archived'])
const PROJECT_STAGES = new Set([
  'lead',
  'brief',
  'estimate',
  'prepayment',
  'design',
  'development',
  'content',
  'review',
  'launch',
  'support',
  'closed',
])

export function getAdminDataFile() {
  return process.env.ADMIN_DATA_FILE || path.join(DEFAULT_DATA_DIR, 'project42-admin.json')
}

export async function createLead(payload) {
  const now = new Date().toISOString()
  const lead = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: 'new',
    isCompleted: false,
    isPaid: false,
    income: 0,
    taxPercent: 0,
    projectStage: 'lead',
    comments: [],
    ...pickLeadFields(payload),
  }

  const data = await readData()
  data.leads.unshift(lead)
  await writeData(data)

  return lead
}

export async function listLeads() {
  const data = await readData()

  return data.leads
}

export async function listExpenses() {
  const data = await readData()

  return data.expenses
}

export async function listArticles() {
  const data = await readData()

  return data.articles
}

export async function createExpense(payload) {
  const title = toStringValue(payload.title)
  const amount = toMoneyNumber(payload.amount)

  if (!title || amount <= 0) return null

  const now = new Date().toISOString()
  const expense = {
    id: randomUUID(),
    title: title.slice(0, 120),
    amount,
    category: toStringValue(payload.category).slice(0, 80),
    createdAt: now,
  }

  const data = await readData()
  data.expenses.unshift(expense)
  await writeData(data)

  return expense
}

export async function deleteExpense(id) {
  const data = await readData()
  const nextExpenses = data.expenses.filter((expense) => expense.id !== id)

  if (nextExpenses.length === data.expenses.length) return false

  data.expenses = nextExpenses
  await writeData(data)

  return true
}

export async function deleteLead(id) {
  const data = await readData()
  const nextLeads = data.leads.filter((lead) => lead.id !== id)

  if (nextLeads.length === data.leads.length) return false

  data.leads = nextLeads
  await writeData(data)

  return true
}

export async function createArticle(payload) {
  const title = toStringValue(payload.title)
  const url = toStringValue(payload.url)

  if (!title || !url) return null

  const now = new Date().toISOString()
  const article = {
    id: randomUUID(),
    title: title.slice(0, 180),
    platform: toStringValue(payload.platform).slice(0, 120),
    url: url.slice(0, 500),
    status: toStringValue(payload.status).slice(0, 80) || 'Опубликована',
    note: toStringValue(payload.note).slice(0, 500),
    publishedAt: toStringValue(payload.publishedAt).slice(0, 40),
    createdAt: now,
  }

  const data = await readData()
  data.articles.unshift(article)
  await writeData(data)

  return article
}

export async function deleteArticle(id) {
  const data = await readData()
  const nextArticles = data.articles.filter((article) => article.id !== id)

  if (nextArticles.length === data.articles.length) return false

  data.articles = nextArticles
  await writeData(data)

  return true
}

export async function updateLead(id, patch) {
  const data = await readData()
  const index = data.leads.findIndex((lead) => lead.id === id)

  if (index === -1) return null

  const lead = data.leads[index]
  const next = {
    ...lead,
    ...pickUpdateFields(patch),
    updatedAt: new Date().toISOString(),
  }

  if (next.status === 'done') next.isCompleted = true
  if (next.status !== 'done' && patch.isCompleted === false) next.isCompleted = false
  if (next.isCompleted && next.status === 'new') next.status = 'done'

  data.leads[index] = next
  await writeData(data)

  return next
}

export async function addLeadComment(id, text) {
  const normalizedText = String(text ?? '').trim()
  if (!normalizedText) return null

  const data = await readData()
  const index = data.leads.findIndex((lead) => lead.id === id)

  if (index === -1) return null

  const comment = {
    id: randomUUID(),
    text: normalizedText.slice(0, 1000),
    createdAt: new Date().toISOString(),
  }

  data.leads[index] = {
    ...data.leads[index],
    comments: [...(data.leads[index].comments || []), comment],
    updatedAt: comment.createdAt,
  }

  await writeData(data)

  return data.leads[index]
}

async function readData() {
  try {
    const raw = await readFile(getAdminDataFile(), 'utf8')
    const data = JSON.parse(raw)

    return {
      leads: Array.isArray(data.leads) ? data.leads : [],
      expenses: Array.isArray(data.expenses) ? data.expenses : [],
      articles: Array.isArray(data.articles) ? data.articles : [],
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      console.error('[admin-store] Failed to read data file:', error?.message || error)
    }

    return { leads: [], expenses: [], articles: [] }
  }
}

async function writeData(data) {
  const file = getAdminDataFile()
  await mkdir(path.dirname(file), { recursive: true })

  const temporaryFile = `${file}.${process.pid}.${Date.now()}.tmp`
  await writeFile(temporaryFile, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  await rename(temporaryFile, file)
}

function pickLeadFields(payload) {
  return {
    name: toStringValue(payload.name),
    phone: toStringValue(payload.phone),
    email: toStringValue(payload.email),
    contact: toStringValue(payload.contact),
    service: toStringValue(payload.service),
    message: toStringValue(payload.message),
    page: toStringValue(payload.page),
    source: toStringValue(payload.source),
    sourceLabel: toStringValue(payload.sourceLabel),
    sourceType: toStringValue(payload.sourceType),
    manualSource: toStringValue(payload.manualSource),
    sourceUrl: toStringValue(payload.sourceUrl),
    landingPage: toStringValue(payload.landingPage),
    referrer: toStringValue(payload.referrer),
    utmSource: toStringValue(payload.utmSource),
    utmMedium: toStringValue(payload.utmMedium),
    utmCampaign: toStringValue(payload.utmCampaign),
    utmTerm: toStringValue(payload.utmTerm),
    utmContent: toStringValue(payload.utmContent),
    yclid: toStringValue(payload.yclid),
    gclid: toStringValue(payload.gclid),
    requestId: toStringValue(payload.requestId),
  }
}

function pickUpdateFields(patch) {
  const next = {}

  if (STATUSES.has(patch.status)) next.status = patch.status
  if (typeof patch.isCompleted === 'boolean') next.isCompleted = patch.isCompleted
  if (typeof patch.isPaid === 'boolean') next.isPaid = patch.isPaid
  if (patch.income !== undefined) next.income = toMoneyNumber(patch.income)
  if (patch.taxPercent !== undefined) next.taxPercent = toPercentNumber(patch.taxPercent)
  if (PROJECT_STAGES.has(patch.projectStage)) next.projectStage = patch.projectStage
  if (patch.sourceType !== undefined) next.sourceType = toStringValue(patch.sourceType).slice(0, 60)
  if (patch.manualSource !== undefined)
    next.manualSource = toStringValue(patch.manualSource).slice(0, 160)

  return next
}

function toMoneyNumber(value) {
  const number = Number(value)

  if (!Number.isFinite(number) || number < 0) return 0

  return Math.round(number * 100) / 100
}

function toPercentNumber(value) {
  const number = Number(value)

  if (!Number.isFinite(number) || number < 0) return 0
  if (number > 100) return 100

  return Math.round(number * 100) / 100
}

function toStringValue(value) {
  return String(value ?? '').trim()
}
