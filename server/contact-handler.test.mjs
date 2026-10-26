import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { Readable } from 'node:stream'
import test from 'node:test'
import { handleContactRequest } from './contact-handler.mjs'

test('retries Telegram and deduplicates repeated request ids', async () => {
  const temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'project42-contact-'))
  const originalFetch = globalThis.fetch
  const originalEnvironment = {
    adminDataFile: process.env.ADMIN_DATA_FILE,
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatIds: process.env.TELEGRAM_CHAT_IDS,
    retryAttempts: process.env.TELEGRAM_RETRY_ATTEMPTS,
    timeout: process.env.TELEGRAM_TIMEOUT,
  }

  process.env.ADMIN_DATA_FILE = path.join(temporaryDirectory, 'admin.json')
  process.env.TELEGRAM_BOT_TOKEN = 'test-token'
  process.env.TELEGRAM_CHAT_IDS = 'test-chat'
  process.env.TELEGRAM_RETRY_ATTEMPTS = '2'
  process.env.TELEGRAM_TIMEOUT = '1'

  let telegramCalls = 0
  globalThis.fetch = async () => {
    telegramCalls += 1
    if (telegramCalls === 1) throw new Error('socket reset')

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  }

  const payload = {
    _requestId: 'process-cta-request-1',
    contact: '@project42',
    message: 'Тест устойчивости формы',
    name: 'Иван',
    service: 'Разработка сайта',
  }

  try {
    const firstResponse = await invokeContactHandler(payload)
    const repeatedResponse = await invokeContactHandler(payload)

    assert.equal(firstResponse.statusCode, 200)
    assert.equal(repeatedResponse.statusCode, 200)
    assert.equal(telegramCalls, 2)
    const storedData = JSON.parse(await readFile(process.env.ADMIN_DATA_FILE, 'utf8'))
    assert.equal(storedData.leads.length, 1)
    assert.equal(storedData.leads[0].requestId, payload._requestId)
  } finally {
    globalThis.fetch = originalFetch
    restoreEnvironment('ADMIN_DATA_FILE', originalEnvironment.adminDataFile)
    restoreEnvironment('TELEGRAM_BOT_TOKEN', originalEnvironment.botToken)
    restoreEnvironment('TELEGRAM_CHAT_IDS', originalEnvironment.chatIds)
    restoreEnvironment('TELEGRAM_RETRY_ATTEMPTS', originalEnvironment.retryAttempts)
    restoreEnvironment('TELEGRAM_TIMEOUT', originalEnvironment.timeout)
    await rm(temporaryDirectory, { force: true, recursive: true })
  }
})

test('does not report success when neither storage nor Telegram can accept the lead', async () => {
  const temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'project42-contact-failure-'))
  const keys = ['ADMIN_DATA_FILE', 'TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_IDS', 'TELEGRAM_CHAT_ID']
  const originalEnvironment = Object.fromEntries(keys.map((key) => [key, process.env[key]]))
  const blockedDirectory = path.join(temporaryDirectory, 'not-a-directory')
  await writeFile(blockedDirectory, 'blocked')
  process.env.ADMIN_DATA_FILE = path.join(blockedDirectory, 'leads.json')
  process.env.TELEGRAM_BOT_TOKEN = ''
  process.env.TELEGRAM_CHAT_IDS = ''
  process.env.TELEGRAM_CHAT_ID = ''

  try {
    const failed = await invokeContactHandler({ name: 'Проверка', email: 'audit@example.com' })
    assert.equal(failed.statusCode, 503)
    assert.equal(failed.body.ok, false)

    process.env.ADMIN_DATA_FILE = path.join(temporaryDirectory, 'leads.json')
    const saved = await invokeContactHandler({ name: 'Проверка', email: 'audit@example.com' })
    assert.equal(saved.statusCode, 200)
    assert.equal(saved.body.ok, true)
    const data = JSON.parse(await readFile(process.env.ADMIN_DATA_FILE, 'utf8'))
    assert.equal(data.leads.length, 1)
  } finally {
    keys.forEach((key) => restoreEnvironment(key, originalEnvironment[key]))
    await rm(temporaryDirectory, { force: true, recursive: true })
  }
})

async function invokeContactHandler(payload) {
  const request = Readable.from([Buffer.from(JSON.stringify(payload))])
  request.method = 'POST'

  let statusCode = 0
  let responseBody = ''
  const response = {
    end(body = '') {
      responseBody = String(body)
    },
    setHeader() {},
    writeHead(status) {
      statusCode = status
    },
  }

  await handleContactRequest(request, response)

  return { body: JSON.parse(responseBody), statusCode }
}

function restoreEnvironment(key, value) {
  if (value === undefined) {
    delete process.env[key]
    return
  }

  process.env[key] = value
}
