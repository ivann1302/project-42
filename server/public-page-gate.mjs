import path from 'node:path'

const destination = '/razrabotka'
const allowedPages = new Set(['/admin', '/admin.html', '/admin.txt', '/__health'])
const allowedPrefixes = [
  '/_next/',
  '/api/',
  '/scripts/api/',
  '/images/',
  '/fonts/',
  '/.well-known/',
]

export function getPublicPageRedirectTarget(requestUrl, method) {
  if (method !== 'GET' && method !== 'HEAD') return null

  const pathname = requestUrl.pathname.replace(/\/+$/, '') || '/'
  if (pathname === destination) {
    return requestUrl.pathname === destination ? null : `${destination}${requestUrl.search}`
  }
  if (allowedPages.has(pathname) || allowedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return null
  }

  const extension = path.posix.extname(pathname)
  if (extension && extension !== '.html') return null

  return `${destination}${requestUrl.search}`
}
