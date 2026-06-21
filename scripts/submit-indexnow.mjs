import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_ENDPOINT = 'https://www.bing.com/indexnow'
const KEY_FILE_PATTERN = /^[A-Za-z0-9-]{8,128}\.txt$/u
const SUCCESS_STATUSES = new Set([200, 202])

const rootDir = process.cwd()
const sitemapPath = path.resolve(rootDir, process.env.INDEXNOW_SITEMAP || 'out/sitemap.xml')
const endpoint = process.env.INDEXNOW_ENDPOINT || DEFAULT_ENDPOINT
const dryRun = process.env.INDEXNOW_DRY_RUN === '1'

const sitemapXml = await readFile(sitemapPath, 'utf8')
const urls = getSitemapUrls(sitemapXml)

if (urls.length === 0) {
  throw new Error(`No URLs found in ${sitemapPath}`)
}

const host = new URL(urls[0]).host
const urlList = urls.filter((url) => {
  const parsedUrl = new URL(url)

  return parsedUrl.host === host && ['http:', 'https:'].includes(parsedUrl.protocol)
})

if (urlList.length === 0) {
  throw new Error(`No valid URLs for host ${host} found in ${sitemapPath}`)
}

const key = process.env.INDEXNOW_KEY || (await discoverIndexNowKey())
const keyLocation = process.env.INDEXNOW_KEY_LOCATION || `${new URL(urlList[0]).origin}/${key}.txt`
const payload = {
  host,
  key,
  keyLocation,
  urlList,
}

console.log(`[indexnow] Submitting ${urlList.length} URLs for ${host}`)
console.log(`[indexnow] Key location: ${keyLocation}`)

if (dryRun) {
  console.log('[indexnow] Dry run enabled; request was not sent.')
  console.log(JSON.stringify(payload, null, 2))
  process.exit(0)
}

const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  body: JSON.stringify(payload),
})

const responseBody = await response.text()

if (!SUCCESS_STATUSES.has(response.status)) {
  throw new Error(
    `[indexnow] ${endpoint} returned ${response.status} ${response.statusText}: ${responseBody}`,
  )
}

console.log(`[indexnow] Accepted by ${endpoint}: ${response.status} ${response.statusText}`)

function getSitemapUrls(xml) {
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/gu), (match) => decodeXmlEntity(match[1]))
}

function decodeXmlEntity(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
}

async function discoverIndexNowKey() {
  const candidates = [
    path.resolve(rootDir, 'out'),
    path.resolve(rootDir, 'public'),
  ]

  for (const directory of candidates) {
    const key = await findKeyInDirectory(directory)

    if (key) return key
  }

  throw new Error('IndexNow key was not found. Set INDEXNOW_KEY or add {key}.txt to public/.')
}

async function findKeyInDirectory(directory) {
  let entries

  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch {
    return null
  }

  for (const entry of entries) {
    if (!entry.isFile() || !KEY_FILE_PATTERN.test(entry.name)) continue

    const key = entry.name.replace(/\.txt$/u, '')
    const content = (await readFile(path.join(directory, entry.name), 'utf8')).trim()

    if (content === key) return key
  }

  return null
}
