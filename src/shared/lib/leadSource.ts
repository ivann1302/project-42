const STORAGE_KEY = 'project42.leadAttribution'

const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'yclid',
  'gclid',
] as const

type TrackingParam = (typeof TRACKING_PARAMS)[number]

type LeadAttribution = {
  landingPage: string
  referrer: string
  capturedAt: string
} & Partial<Record<TrackingParam, string>>

export type LeadSourcePayload = {
  _source: string
  _sourceLabel: string
  _sourceUrl?: string
  _landingPage?: string
  _referrer?: string
  _utm_source?: string
  _utm_medium?: string
  _utm_campaign?: string
  _utm_term?: string
  _utm_content?: string
  _yclid?: string
  _gclid?: string
}

export function captureLeadAttribution() {
  if (typeof window === 'undefined') return

  try {
    const current = window.sessionStorage.getItem(STORAGE_KEY)
    if (current) return

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(readCurrentAttribution()))
  } catch {
    // Session storage can be unavailable in strict privacy modes.
  }
}

export function getLeadSourcePayload(source: string, sourceLabel: string): LeadSourcePayload {
  if (typeof window === 'undefined') {
    return { _source: source, _sourceLabel: sourceLabel }
  }

  const attribution = getStoredAttribution() ?? readCurrentAttribution()

  return removeEmpty({
    _source: source,
    _sourceLabel: sourceLabel,
    _sourceUrl: window.location.href,
    _landingPage: attribution.landingPage,
    _referrer: attribution.referrer,
    _utm_source: attribution.utm_source,
    _utm_medium: attribution.utm_medium,
    _utm_campaign: attribution.utm_campaign,
    _utm_term: attribution.utm_term,
    _utm_content: attribution.utm_content,
    _yclid: attribution.yclid,
    _gclid: attribution.gclid,
  })
}

function getStoredAttribution() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<LeadAttribution>
    if (!parsed.landingPage) return null

    return parsed as LeadAttribution
  } catch {
    return null
  }
}

function readCurrentAttribution(): LeadAttribution {
  const searchParams = new URLSearchParams(window.location.search)
  const attribution: LeadAttribution = {
    landingPage: window.location.href,
    referrer: document.referrer,
    capturedAt: new Date().toISOString(),
  }

  for (const param of TRACKING_PARAMS) {
    const value = searchParams.get(param)?.trim()
    if (value) attribution[param] = value
  }

  return attribution
}

function removeEmpty(payload: LeadSourcePayload): LeadSourcePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => Boolean(value)),
  ) as LeadSourcePayload
}
