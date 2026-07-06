import { createReadStream } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleContactRequest, loadEnv } from './contact-handler.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const staticDir = path.resolve(process.env.STATIC_DIR || path.join(projectRoot, 'out'))
const parsedLegacyStaticReleaseLimit = Number.parseInt(process.env.LEGACY_STATIC_RELEASES || '30', 10)
const legacyStaticReleaseLimit = Number.isFinite(parsedLegacyStaticReleaseLimit)
  ? parsedLegacyStaticReleaseLimit
  : 30
const hostname = process.env.HOSTNAME || '127.0.0.1'
const port = Number.parseInt(process.env.PORT || '3000', 10)
const canonicalHost = (process.env.CANONICAL_HOST || 'project42-studio.ru').toLowerCase()
const canonicalProtocol = (process.env.CANONICAL_PROTOCOL || 'https').replace(/:$/, '')
const passenger = globalThis.PhusionPassenger

const contactEndpoints = new Set(['/scripts/api/send.php', '/scripts/api/send', '/api/send'])
const permanentRedirects = new Map([
  [
    '/blog/marketing/chatgpt-klient-stroitelnaya-kompaniya',
    '/blog/chatgpt-klient-stroitelnaya-kompaniya',
  ],
  [
    '/blog/razrabotka/sayt-na-konstruktore-ili-sobstvennom-kode',
    '/blog/sayt-na-konstruktore-ili-sobstvennom-kode',
  ],
  [
    '/blog/razrabotka/zashchita-sayta-ot-botov-i-perekhvata-zayavok',
    '/blog/zashchita-sayta-ot-botov-i-perekhvata-zayavok',
  ],
])

passenger?.configure?.({ autoInstall: false })

await loadEnv({ cwd: projectRoot, documentRoot: staticDir })
await assertStaticDir(staticDir)

const server = createServer(async (req, res) => {
  const requestUrl = getRequestUrl(req)

  if (!requestUrl) {
    sendPlain(res, 400, 'Bad Request')
    return
  }

  const canonicalRedirectTarget = getCanonicalRedirectTarget(requestUrl)

  if (canonicalRedirectTarget) {
    sendRedirect(res, 301, canonicalRedirectTarget)
    return
  }

  if (requestUrl.pathname === '/__health') {
    sendPlain(res, 200, 'ok')
    return
  }

  if (contactEndpoints.has(requestUrl.pathname)) {
    await handleContactRequest(req, res)
    return
  }

  const redirectTarget = getPermanentRedirectTarget(requestUrl)

  if (redirectTarget) {
    sendRedirect(res, 301, redirectTarget)
    return
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendPlain(res, 405, 'Method Not Allowed')
    return
  }

  const file = await resolveStaticFile(requestUrl.pathname)

  if (!file) {
    await serveFile(res, path.join(staticDir, '404.html'), 404, req.method === 'HEAD')
    return
  }

  await serveFile(res, file, 200, req.method === 'HEAD')
})

if (passenger) {
  server.listen('passenger', () => {
    console.log(`[static-node] Serving ${staticDir}`)
    console.log('[static-node] Listening through Phusion Passenger')
  })
} else {
  server.listen(port, hostname, () => {
    console.log(`[static-node] Serving ${staticDir}`)
    console.log(`[static-node] Listening on http://${hostname}:${port}`)
  })
}

async function assertStaticDir(dir) {
  try {
    const info = await stat(dir)
    if (!info.isDirectory()) throw new Error()
  } catch {
    console.error(`[static-node] Static directory does not exist: ${dir}`)
    console.error('[static-node] Run npm run build:static first.')
    process.exit(1)
  }
}

function getRequestUrl(req) {
  try {
    return new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
  } catch {
    return null
  }
}

async function resolveStaticFile(urlPathname) {
  const pathname = decodePathname(urlPathname)
  if (pathname === null || hasBlockedPathSegment(pathname)) return null

  const candidates = getStaticCandidates(pathname)

  for (const candidate of candidates) {
    const file = safeResolve(staticDir, candidate)
    if (!file) continue

    try {
      const info = await stat(file)
      if (info.isFile()) return file
    } catch {
      // Try the next candidate.
    }
  }

  const legacyFile = await resolveLegacyNextStaticFile(pathname, candidates)
  if (legacyFile) return legacyFile

  return null
}

function decodePathname(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return null
  }
}

function hasBlockedPathSegment(value) {
  return value
    .split('/')
    .filter(Boolean)
    .some((segment) => segment.startsWith('.') && segment !== '.well-known')
}

function getPermanentRedirectTarget(requestUrl) {
  const pathname = requestUrl.pathname.replace(/\/+$/, '') || '/'
  const target = permanentRedirects.get(pathname)

  if (!target) return null

  return `${target}${requestUrl.search}`
}

function getCanonicalRedirectTarget(requestUrl) {
  if (requestUrl.hostname.toLowerCase() !== `www.${canonicalHost}`) {
    return null
  }

  return `${canonicalProtocol}://${canonicalHost}${requestUrl.pathname}${requestUrl.search}`
}

function getStaticCandidates(pathname) {
  const cleanPath = pathname.replace(/^\/+/, '')

  if (!cleanPath) {
    return ['index.html']
  }

  const extension = path.extname(cleanPath)

  if (extension) {
    return [cleanPath]
  }

  return [`${cleanPath}.html`, path.join(cleanPath, 'index.html')]
}

async function resolveLegacyNextStaticFile(pathname, candidates) {
  const cleanPath = pathname.replace(/^\/+/, '')

  if (!cleanPath.startsWith('_next/static/')) {
    return null
  }

  const releasesDir = path.join(path.dirname(path.dirname(staticDir)), 'releases')
  let releases

  try {
    releases = await readdir(releasesDir, { withFileTypes: true })
  } catch {
    return null
  }

  const releaseNames = releases
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse()
    .slice(0, legacyStaticReleaseLimit)

  for (const releaseName of releaseNames) {
    const releaseOutDir = safeResolve(releasesDir, path.join(releaseName, 'out'))
    if (!releaseOutDir) continue

    for (const candidate of candidates) {
      const file = safeResolve(releaseOutDir, candidate)
      if (!file) continue

      try {
        const info = await stat(file)
        if (info.isFile()) return file
      } catch {
        // Try the next release.
      }
    }
  }

  return null
}

function safeResolve(baseDir, relativePath) {
  const resolved = path.resolve(baseDir, relativePath)
  const base = `${baseDir}${path.sep}`

  if (resolved !== baseDir && !resolved.startsWith(base)) {
    return null
  }

  return resolved
}

async function serveFile(res, file, statusCode, headOnly) {
  let info
  try {
    info = await stat(file)
  } catch {
    sendPlain(res, statusCode, statusCode === 404 ? 'Not Found' : 'File not found')
    return
  }

  res.writeHead(statusCode, {
    'Content-Length': info.size,
    'Content-Type': getContentType(file),
    'Cache-Control': getCacheControl(file),
  })

  if (headOnly) {
    res.end()
    return
  }

  createReadStream(file).pipe(res)
}

function sendPlain(res, statusCode, message) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end(message)
}

function sendRedirect(res, statusCode, location) {
  res.writeHead(statusCode, {
    Location: location,
    'Cache-Control': 'public, max-age=3600',
  })
  res.end()
}

function getContentType(file) {
  const extension = path.extname(file).toLowerCase()

  return (
    {
      '.css': 'text/css; charset=utf-8',
      '.gif': 'image/gif',
      '.html': 'text/html; charset=utf-8',
      '.ico': 'image/x-icon',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.js': 'text/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.txt': 'text/plain; charset=utf-8',
      '.webp': 'image/webp',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.xml': 'application/xml; charset=utf-8',
    }[extension] || 'application/octet-stream'
  )
}

function getCacheControl(file) {
  const normalized = file.replaceAll(path.sep, '/')

  if (normalized.includes('/_next/static/')) {
    return 'public, max-age=31536000, immutable'
  }

  if (path.extname(file).toLowerCase() === '.html') {
    return 'no-store, max-age=0, must-revalidate'
  }

  return 'public, max-age=86400'
}
