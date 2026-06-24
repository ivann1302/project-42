declare module '*.scss' {
  const styles: { [className: string]: string }
  export default styles
}

interface Window {
  ym?: (
    counterId: number,
    method: 'hit' | 'init' | 'reachGoal',
    paramsOrTarget?:
      | string
      | {
          accurateTrackBounce?: boolean
          callback?: () => void
          clickmap?: boolean
          ecommerce?: string
          referer?: string
          referrer?: string
          ssr?: boolean
          title?: string
          trackLinks?: boolean
          url?: string
          webvisor?: boolean
        },
    optionsOrParams?: Record<string, unknown>,
    callback?: () => void,
  ) => void
  dataLayer?: unknown[]
}
