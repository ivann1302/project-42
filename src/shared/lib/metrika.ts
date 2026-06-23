export const YANDEX_METRIKA_ID = 109427452
export const YANDEX_METRIKA_CONTACT_FORM_GOAL = 'contact_form_submit'

const GOAL_CALLBACK_TIMEOUT_MS = 700

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

    window.setTimeout(finish, GOAL_CALLBACK_TIMEOUT_MS)

    try {
      ym(YANDEX_METRIKA_ID, 'reachGoal', goal, undefined, finish)
    } catch {
      finish()
    }
  })
}
