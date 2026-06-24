export const YANDEX_METRIKA_ID = 109427452
export const YANDEX_METRIKA_CONTACT_FORM_GOAL = 'contact_form_submit'
export const YANDEX_METRIKA_LEAD_THANK_YOU_URL = '/thank-you'

const METRIKA_CALLBACK_TIMEOUT_MS = 700
const MANUAL_HIT_STORAGE_KEY = 'project42.metrikaManualHit'
const MANUAL_HIT_SKIP_TTL_MS = 10_000

export function reachYandexMetrikaGoal(goal: string): Promise<void> {
  if (typeof window === 'undefined' || !window.ym) return Promise.resolve()

  const ym = window.ym

  return new Promise((resolve) => {
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      resolve()
    }

    window.setTimeout(finish, METRIKA_CALLBACK_TIMEOUT_MS)

    try {
      ym(YANDEX_METRIKA_ID, 'reachGoal', goal, undefined, finish)
    } catch {
      finish()
    }
  })
}

export function hitYandexMetrikaPage(url: string): Promise<boolean> {
  if (typeof window === 'undefined' || !window.ym) return Promise.resolve(false)

  const ym = window.ym

  return new Promise((resolve) => {
    let finished = false
    let sent = false

    const finish = (wasSent = sent) => {
      if (finished) return
      finished = true
      resolve(wasSent)
    }

    window.setTimeout(() => finish(), METRIKA_CALLBACK_TIMEOUT_MS)

    try {
      sent = true
      ym(YANDEX_METRIKA_ID, 'hit', url, {
        callback: () => finish(true),
        referer: window.location.href,
        title: getPageTitleForMetrikaHit(url),
      })
    } catch {
      finish(false)
    }
  })
}

export async function trackYandexMetrikaLeadConversion(): Promise<void> {
  const [, thankYouHitSent] = await Promise.all([
    reachYandexMetrikaGoal(YANDEX_METRIKA_CONTACT_FORM_GOAL),
    hitYandexMetrikaPage(YANDEX_METRIKA_LEAD_THANK_YOU_URL),
  ])

  if (thankYouHitSent) {
    rememberManualYandexMetrikaHit(YANDEX_METRIKA_LEAD_THANK_YOU_URL)
  }
}

export function shouldSkipYandexMetrikaHit(url: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    const raw = window.sessionStorage.getItem(MANUAL_HIT_STORAGE_KEY)
    if (!raw) return false

    const parsed = JSON.parse(raw) as { url?: string; timestamp?: number }
    const timestamp = Number(parsed.timestamp)
    const isExpired = !timestamp || Date.now() - timestamp > MANUAL_HIT_SKIP_TTL_MS

    if (isExpired) {
      window.sessionStorage.removeItem(MANUAL_HIT_STORAGE_KEY)
      return false
    }

    if (parsed.url !== normalizeMetrikaUrl(url)) return false

    window.sessionStorage.removeItem(MANUAL_HIT_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

function rememberManualYandexMetrikaHit(url: string) {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(
      MANUAL_HIT_STORAGE_KEY,
      JSON.stringify({
        url: normalizeMetrikaUrl(url),
        timestamp: Date.now(),
      }),
    )
  } catch {
    // Session storage can be unavailable in strict privacy modes.
  }
}

function normalizeMetrikaUrl(url: string) {
  if (typeof window === 'undefined') return url

  try {
    const parsed = new URL(url, window.location.origin)
    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return url
  }
}

function getPageTitleForMetrikaHit(url: string) {
  if (normalizeMetrikaUrl(url).startsWith(YANDEX_METRIKA_LEAD_THANK_YOU_URL)) {
    return 'Спасибо за заявку'
  }

  return document.title
}
