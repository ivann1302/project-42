import assert from 'node:assert/strict'
import test from 'node:test'
import { getPublicPageRedirectTarget } from './public-page-gate.mjs'

test('temporarily redirects public pages to development', () => {
  for (const pathname of [
    '/',
    '/portfolio',
    '/blog/article',
    '/thank-you',
    '/index.html',
    '/missing',
  ]) {
    assert.equal(
      getPublicPageRedirectTarget(new URL(`https://project42-studio.ru${pathname}`), 'GET'),
      '/razrabotka',
    )
  }

  assert.equal(
    getPublicPageRedirectTarget(new URL('https://project42-studio.ru/blog?utm_source=ad'), 'HEAD'),
    '/razrabotka?utm_source=ad',
  )
})

test('keeps the development page and operational routes available', () => {
  for (const pathname of [
    '/razrabotka',
    '/admin',
    '/api/admin/leads',
    '/scripts/api/send.php',
    '/_next/static/chunk.js',
    '/images/logo.webp',
    '/robots.txt',
    '/__health',
  ]) {
    assert.equal(
      getPublicPageRedirectTarget(new URL(`https://project42-studio.ru${pathname}`), 'GET'),
      null,
      pathname,
    )
  }

  assert.equal(
    getPublicPageRedirectTarget(new URL('https://project42-studio.ru/razrabotka/'), 'GET'),
    '/razrabotka',
  )

  assert.equal(
    getPublicPageRedirectTarget(new URL('https://project42-studio.ru/portfolio'), 'POST'),
    null,
  )
})
