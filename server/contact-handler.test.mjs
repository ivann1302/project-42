import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
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
