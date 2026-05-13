declare module '*.scss' {
  const styles: { [className: string]: string }
  export default styles
}

interface Window {
  ym?: (
    counterId: number,
    method: 'hit' | 'init' | 'reachGoal',
    params?:
      | string
      | {
          accurateTrackBounce?: boolean
          clickmap?: boolean
          ecommerce?: string
          referrer?: string
          ssr?: boolean
          trackLinks?: boolean
          url?: string
          webvisor?: boolean
        },
  ) => void
  dataLayer?: unknown[]
}
