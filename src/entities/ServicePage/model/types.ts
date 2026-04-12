import type { IconName } from '@/shared/ui/Icon'

export type HeroConfig = {
  eyebrow: string
  headingText: string
  sub: string
  ctaPrimary: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
}

export type HowItWorksStep = {
  num: string
  title: string
  description: string
}

export type StatItem = {
  value: number
  prefix: string
  suffix: string
  label: string
  static?: boolean
}

export type CtaConfig = {
  eyebrow: string
  heading: string
  sub: string
  buttonText: string
  modalTitle: string
}

export type SeoConfig = {
  title: string
  description: string
}

export type ServiceIconItem = {
  icon: IconName
  title: string
  description: string
}
