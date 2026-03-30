# Project 42 — Web Studio Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Project 42 web studio landing page — Header, Hero, WhyUs, Services, HowItWorks, Portfolio, Stats, Testimonials, Pricing, Cta, Footer — assembled in `page.tsx` with working contact form → Telegram.

**Architecture:** Server components for all static sections; `'use client'` only for Header (scroll + burger state) and Cta (modal open state). Static data lives in `entities/*/model/data.ts`. Widgets import entities and shared UI (`Button`, `SectionTitle`, `Container`, `Icon`, `Modal`). All assembled in `src/app/page.tsx`.

**Tech Stack:** Next.js 15 App Router, TypeScript 5 strict, SCSS Modules + global tokens (`variables.scss`, `mixins.scss`), FSD (app → widgets → features → entities → shared), React Hook Form + Zod, Telegram Bot API.

> **Spec note:** WhyUs section has 6 cards (spec updated from 5) — added "Результат без балласта" differentiator per client requirement.

---

## File Map

**Modified:**

- `src/shared/ui/Icon/icons.ts` — add icons: `monitor`, `code`, `searchUp`, `globe`, `headset`, `zap`, `layers`, `shield`, `rocket`, `target`
- `src/shared/config/seo.ts` — update tagline, description, keywords
- `src/entities/Service/model/types.ts` — define `Service` type
- `src/entities/Service/model/data.ts` — 5 services
- `src/entities/Service/index.ts` — export `services` + `Service`
- `src/entities/Project/model/types.ts` — define `Project` type
- `src/entities/Project/model/data.ts` — 3 placeholder projects
- `src/entities/Project/index.ts` — export
- `src/entities/Testimonial/model/types.ts` — define `Testimonial` type
- `src/entities/Testimonial/model/data.ts` — 3 placeholder testimonials
- `src/entities/Testimonial/index.ts` — export
- `src/features/ContactForm/ui/ContactForm.tsx` — update `SERVICES` options to project types
- `src/app/page.tsx` — uncomment and assemble all widgets

**Created:**

- `src/entities/PricingPlan/model/types.ts`
- `src/entities/PricingPlan/model/data.ts`
- `src/entities/PricingPlan/index.ts`
- `src/widgets/Header/ui/Header.tsx` + `Header.module.scss`
- `src/widgets/Header/index.ts` (replace stub)
- `src/widgets/Hero/ui/Hero.tsx` + `Hero.module.scss`
- `src/widgets/Hero/index.ts`
- `src/widgets/WhyUs/ui/WhyUs.tsx` + `WhyUs.module.scss`
- `src/widgets/WhyUs/index.ts`
- `src/widgets/Services/ui/Services.tsx` + `Services.module.scss`
- `src/widgets/Services/index.ts`
- `src/widgets/HowItWorks/ui/HowItWorks.tsx` + `HowItWorks.module.scss`
- `src/widgets/HowItWorks/index.ts`
- `src/widgets/Portfolio/ui/Portfolio.tsx` + `Portfolio.module.scss`
- `src/widgets/Portfolio/index.ts`
- `src/widgets/Stats/ui/Stats.tsx` + `Stats.module.scss`
- `src/widgets/Stats/index.ts`
- `src/widgets/Testimonials/ui/Testimonials.tsx` + `Testimonials.module.scss`
- `src/widgets/Testimonials/index.ts`
- `src/widgets/Pricing/ui/Pricing.tsx` + `Pricing.module.scss`
- `src/widgets/Pricing/index.ts`
- `src/widgets/Cta/ui/Cta.tsx` + `Cta.module.scss`
- `src/widgets/Cta/index.ts`
- `src/widgets/Footer/ui/Footer.tsx` + `Footer.module.scss`
- `src/widgets/Footer/index.ts`

---

## Task 1: Icons + SEO config

**Files:**

- Modify: `src/shared/ui/Icon/icons.ts`
- Modify: `src/shared/config/seo.ts`

- [ ] **Step 1: Add icons to registry**

```ts
// src/shared/ui/Icon/icons.ts
export const icons = {
  arrowRight: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/>`,
  check: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>`,
  close: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M18 6L6 18M6 6l12 12"/>`,
  menu: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/>`,
  send: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>`,
  instagram: `<rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>`,
  linkedin: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2" fill="none"/>`,
  star: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`,
  phone: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18H5a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.354 1.843.598 2.81.7A2 2 0 0122 14.92z"/>`,
  chevronDown: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6"/>`,
  monitor: `<rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M8 21h8M12 17v4"/>`,
  code: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>`,
  searchUp: `<circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M21 21l-4.35-4.35M11 8v6M8 11l3-3 3 3"/>`,
  globe: `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path stroke="currentColor" stroke-width="2" d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>`,
  headset: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 18v-6a9 9 0 0118 0v6"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>`,
  zap: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>`,
  layers: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>`,
  shield: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
  rocket: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>`,
  target: `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="2" fill="none"/>`,
} as const

export type IconName = keyof typeof icons
```

- [ ] **Step 2: Update SEO config**

```ts
// src/shared/config/seo.ts
export const siteConfig = {
  name: 'Project 42',
  tagline: 'Не ещё одна веб-студия',
  description:
    'Решаем задачи бизнеса, а не просто делаем сайты. Полный цикл: дизайн, разработка, SEO, GEO-оптимизация и поддержка. Не конвейер — не более 5 проектов одновременно.',
  url: 'https://project42.studio',
  locale: 'ru_RU',
  twitterHandle: '@project42studio',
  keywords: [
    'веб-студия',
    'разработка сайтов',
    'ui/ux дизайн',
    'seo продвижение',
    'geo оптимизация',
    'поддержка сайтов',
    'next.js',
    'долгосрочное партнёрство',
  ] as string[],
} as const
```

- [ ] **Step 3: Commit**

```bash
git add src/shared/ui/Icon/icons.ts src/shared/config/seo.ts
git commit -m "feat: add service icons and update SEO config for Project 42"
```

---

## Task 2: Entity types and data

**Files:**

- Modify: `src/entities/Service/model/types.ts`, `data.ts`, `index.ts`
- Modify: `src/entities/Project/model/types.ts`, `data.ts`, `index.ts`
- Modify: `src/entities/Testimonial/model/types.ts`, `data.ts`, `index.ts`
- Create: `src/entities/PricingPlan/model/types.ts`, `data.ts`, `index.ts`

- [ ] **Step 1: Service entity**

```ts
// src/entities/Service/model/types.ts
import type { IconName } from '@/shared/ui/Icon/icons'

export type Service = {
  id: string
  icon: IconName
  title: string
  description: string
}
```

```ts
// src/entities/Service/model/data.ts
import type { Service } from './types'

export const services: Service[] = [
  {
    id: 'design',
    icon: 'monitor',
    title: 'Дизайн',
    description:
      'UX-исследование, прототипирование, UI-дизайн и дизайн-система. Интерфейс, который работает на конверсию.',
  },
  {
    id: 'development',
    icon: 'code',
    title: 'Разработка',
    description:
      'Быстрые, масштабируемые решения на современном стеке. Адаптив, интеграции, чистый код без замков.',
  },
  {
    id: 'seo',
    icon: 'searchUp',
    title: 'SEO',
    description:
      'Технический аудит, контентная стратегия, рост в органическом поиске. Работаем на долгосрочный результат.',
  },
  {
    id: 'geo',
    icon: 'globe',
    title: 'GEO-оптимизация',
    description:
      'Оптимизация под AI-поисковики: Google AI Overviews, ChatGPT, Perplexity. Новый канал трафика уже сейчас.',
  },
  {
    id: 'support',
    icon: 'headset',
    title: 'Поддержка и развитие',
    description:
      'Мониторинг, обновления, доработки и масштабирование. Остаёмся рядом столько, сколько нужно.',
  },
]
```

```ts
// src/entities/Service/index.ts
export { services } from './model/data'
export type { Service } from './model/types'
```

- [ ] **Step 2: Project entity**

```ts
// src/entities/Project/model/types.ts
export type Project = {
  id: string
  title: string
  tags: string[]
  imageUrl?: string
  href?: string
}
```

```ts
// src/entities/Project/model/data.ts
import type { Project } from './types'

export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'Корпоративный сайт',
    tags: ['Дизайн', 'Разработка', 'SEO'],
  },
  {
    id: 'project-2',
    title: 'Лендинг для SaaS',
    tags: ['Дизайн', 'Разработка'],
  },
  {
    id: 'project-3',
    title: 'Интернет-магазин',
    tags: ['Разработка', 'SEO', 'Поддержка'],
  },
]
```

```ts
// src/entities/Project/index.ts
export { projects } from './model/data'
export type { Project } from './model/types'
```

- [ ] **Step 3: Testimonial entity**

```ts
// src/entities/Testimonial/model/types.ts
export type Testimonial = {
  id: string
  text: string
  author: string
  role: string
  company: string
}
```

```ts
// src/entities/Testimonial/model/data.ts
import type { Testimonial } from './types'

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    text: 'Команда погрузилась в задачу с первого звонка. Не просто сделали сайт — предложили решения, о которых мы сами не думали. Проект сдан в срок, без лишних правок.',
    author: 'Алексей М.',
    role: 'Генеральный директор',
    company: 'TechStart',
  },
  {
    id: 't2',
    text: 'Работаем уже полгода после запуска. Всё поддерживается, развивается. Никаких исчезновений после сдачи проекта — это редкость на рынке.',
    author: 'Мария К.',
    role: 'Маркетинг-директор',
    company: 'GrowthLab',
  },
  {
    id: 't3',
    text: 'Приятно работать с людьми, которые говорят на языке бизнеса, а не только на языке технологий. Результат превзошёл ожидания.',
    author: 'Дмитрий Р.',
    role: 'Основатель',
    company: 'Retail360',
  },
]
```

```ts
// src/entities/Testimonial/index.ts
export { testimonials } from './model/data'
export type { Testimonial } from './model/types'
```

- [ ] **Step 4: PricingPlan entity (new)**

```ts
// src/entities/PricingPlan/model/types.ts
export type PricingPlan = {
  id: string
  name: string
  price: string
  priceNote: string
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
}
```

```ts
// src/entities/PricingPlan/model/data.ts
import type { PricingPlan } from './types'

export const pricingPlans: PricingPlan[] = [
  {
    id: 'landing',
    name: 'Лендинг',
    price: 'от 150 000 ₽',
    priceNote: 'Для старта и проверки гипотез',
    description: 'Одностраничный сайт с высокой конверсией и базовым SEO.',
    features: [
      'UX-анализ и дизайн',
      'Адаптивная разработка',
      'Базовое SEO',
      'Форма заявки → CRM/Telegram',
      'Деплой и настройка аналитики',
    ],
    cta: 'Обсудить проект',
  },
  {
    id: 'corporate',
    name: 'Корпоративный сайт',
    price: 'от 400 000 ₽',
    priceNote: 'Полный цикл — самый популярный выбор',
    description: 'Многостраничный сайт с полным циклом: дизайн, разработка, SEO, GEO и поддержка.',
    features: [
      'UX-исследование и дизайн-система',
      'Разработка на современном стеке',
      'SEO-продвижение (3 мес.)',
      'GEO-оптимизация',
      'Интеграции и CMS',
      'Поддержка 3 месяца включена',
    ],
    highlighted: true,
    cta: 'Обсудить проект',
  },
  {
    id: 'custom',
    name: 'Индивидуально',
    price: 'По запросу',
    priceNote: 'Для нестандартных задач',
    description: 'Сложные проекты, платформы, нестандартные интеграции — обсудим под вашу задачу.',
    features: [
      'Полный аудит задачи',
      'Индивидуальная архитектура',
      'Гибкая команда под проект',
      'Долгосрочное партнёрство',
      'Выделенный менеджер проекта',
    ],
    cta: 'Обсудить задачу',
  },
]
```

```ts
// src/entities/PricingPlan/index.ts
export { pricingPlans } from './model/data'
export type { PricingPlan } from './model/types'
```

- [ ] **Step 5: Verify TypeScript — run type check**

```bash
npx tsc --noEmit
```

Expected: no errors in entity files.

- [ ] **Step 6: Commit**

```bash
git add src/entities/
git commit -m "feat: add Service, Project, Testimonial, PricingPlan entities with data"
```

---

## Task 3: Update ContactForm

The existing form has a `service` field. Update the options to match the new project context (лендинг / корпоративный сайт / другое). No schema changes needed — field stays `service: string | optional`.

**Files:**

- Modify: `src/features/ContactForm/ui/ContactForm.tsx`

- [ ] **Step 1: Update SERVICES options**

In `ContactForm.tsx`, replace:

```ts
const SERVICES = ['UI/UX Дизайн', 'Веб-разработка', 'Мобильное приложение', 'SEO & Аналитика']
```

with:

```ts
const SERVICES = [
  'Лендинг',
  'Корпоративный сайт',
  'GEO-оптимизация',
  'Поддержка и развитие',
  'Другое',
]
```

Also update the select label from `Услуга` to `Тип проекта` and placeholder from `Выберите услугу` to `Выберите тип проекта`:

```tsx
<div className={styles.field}>
  <label className={styles.label}>Тип проекта</label>
  <select className={styles.input} {...register('service')}>
    <option value="">Выберите тип проекта</option>
    {SERVICES.map((s) => (
      <option key={s} value={s}>
        {s}
      </option>
    ))}
  </select>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/features/ContactForm/
git commit -m "feat: update ContactForm service options to project types"
```

---

## Task 4: Header widget

**Files:**

- Create: `src/widgets/Header/ui/Header.tsx`
- Create: `src/widgets/Header/ui/Header.module.scss`
- Modify: `src/widgets/Header/index.ts`

- [ ] **Step 1: Create Header.tsx**

```tsx
// src/widgets/Header/ui/Header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button, Container, Icon } from '@/shared/ui'
import styles from './Header.module.scss'

const NAV_LINKS = [
  { label: 'Услуги', href: '#services' },
  { label: 'Как работаем', href: '#process' },
  { label: 'Портфолио', href: '#portfolio' },
  { label: 'Цены', href: '#pricing' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={[styles.root, scrolled && styles.scrolled].filter(Boolean).join(' ')}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Project<span className={styles.accent}>42</span>
        </Link>

        <nav className={[styles.nav, menuOpen && styles.navOpen].filter(Boolean).join(' ')}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.navLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button size="sm" href="#cta" className={styles.cta}>
          Обсудить проект
        </Button>

        <button
          className={styles.burger}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Меню"
          aria-expanded={menuOpen}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
        </button>
      </Container>
    </header>
  )
}
```

- [ ] **Step 2: Create Header.module.scss**

```scss
// src/widgets/Header/ui/Header.module.scss
.root {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition:
    background $transition-slow,
    border-color $transition-slow;
  border-bottom: 1px solid transparent;
}

.scrolled {
  background: rgba($color-bg, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom-color: $color-border;
}

.inner {
  @include flex-between;
  height: 72px;
  gap: $spacing-xl;
}

.logo {
  @include display-text($font-size-lg);
  text-decoration: none;
  color: $color-text;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}

.accent {
  color: $color-accent;
}

.nav {
  display: flex;
  align-items: center;
  gap: $spacing-xl;
  flex: 1;
  justify-content: center;

  @include tablet {
    gap: $spacing-lg;
  }

  @include mobile {
    display: none;

    &.navOpen {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      position: fixed;
      top: 72px;
      left: 0;
      right: 0;
      bottom: 0;
      background: $color-bg;
      padding: $spacing-xl $container-pad-mobile;
      gap: $spacing-lg;
      border-top: 1px solid $color-border;
    }
  }
}

.navLink {
  @include body-text($font-size-base);
  color: $color-text-muted;
  text-decoration: none;
  transition: color $transition-base;

  &:hover {
    color: $color-text;
  }

  @include mobile {
    font-size: $font-size-lg;
  }
}

.cta {
  flex-shrink: 0;

  @include mobile {
    display: none;
  }
}

.burger {
  display: none;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: $color-text;
  cursor: pointer;
  padding: $spacing-sm;

  @include mobile {
    display: flex;
  }
}
```

- [ ] **Step 3: Update index.ts**

```ts
// src/widgets/Header/index.ts
export { Header } from './ui/Header'
```

- [ ] **Step 4: Commit**

```bash
git add src/widgets/Header/
git commit -m "feat: add Header widget with sticky scroll and mobile burger menu"
```

---

## Task 5: Hero widget

**Files:**

- Create: `src/widgets/Hero/ui/Hero.tsx`
- Create: `src/widgets/Hero/ui/Hero.module.scss`
- Modify: `src/widgets/Hero/index.ts`

- [ ] **Step 1: Create Hero.tsx**

```tsx
// src/widgets/Hero/ui/Hero.tsx
import { Button, Container } from '@/shared/ui'
import styles from './Hero.module.scss'

export function Hero() {
  return (
    <section className={styles.root} id="hero">
      <div className={styles.glow} aria-hidden="true" />
      <Container className={styles.inner}>
        <span className={styles.eyebrow}>— Project 42</span>
        <h1 className={styles.heading}>
          Не ещё одна
          <br />
          веб-студия
        </h1>
        <p className={styles.sub}>
          Решаем задачи бизнеса.
          <br />
          Остаёмся рядом, когда задачи меняются.
        </p>
        <div className={styles.actions}>
          <Button size="lg" href="#cta">
            Обсудить проект
          </Button>
          <Button size="lg" variant="ghost" href="#portfolio">
            Посмотреть работы
          </Button>
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Step 2: Create Hero.module.scss**

```scss
// src/widgets/Hero/ui/Hero.module.scss
.root {
  position: relative;
  min-height: 100svh;
  @include flex-center;
  background: $color-bg;
  overflow: hidden;
  padding-top: 72px; // header height offset
}

.glow {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 600px;
  background: radial-gradient(
    ellipse at center,
    rgba($color-purple, 0.18) 0%,
    rgba($color-blue, 0.08) 40%,
    transparent 70%
  );
  pointer-events: none;
  filter: blur(40px);

  @include mobile {
    width: 400px;
    height: 400px;
  }
}

.inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: $spacing-3xl;
  padding-bottom: $spacing-3xl;
  gap: $spacing-xl;
}

.eyebrow {
  @include eyebrow-text;
  color: $color-accent;
}

.heading {
  @include display-text($font-size-3xl);
  color: $color-text;
  max-width: 800px;

  @include tablet {
    font-size: $font-size-2xl;
  }

  @include mobile {
    font-size: $font-size-xl;
    line-height: 1.15;
  }
}

.sub {
  @include body-text($font-size-lg);
  color: $color-text-muted;
  max-width: 480px;
  line-height: 1.7;

  @include mobile {
    font-size: $font-size-md;
  }
}

.actions {
  display: flex;
  gap: $spacing-md;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: $spacing-sm;
}
```

- [ ] **Step 3: Update index.ts**

```ts
// src/widgets/Hero/index.ts
export { Hero } from './ui/Hero'
```

- [ ] **Step 4: Commit**

```bash
git add src/widgets/Hero/
git commit -m "feat: add Hero widget with gradient glow and CTA buttons"
```

---

## Task 6: WhyUs widget

**Files:**

- Create: `src/widgets/WhyUs/ui/WhyUs.tsx`
- Create: `src/widgets/WhyUs/ui/WhyUs.module.scss`
- Create: `src/widgets/WhyUs/index.ts`

- [ ] **Step 1: Create WhyUs.tsx**

```tsx
// src/widgets/WhyUs/ui/WhyUs.tsx
import { Container, Icon, SectionTitle } from '@/shared/ui'
import type { IconName } from '@/shared/ui/Icon/icons'
import styles from './WhyUs.module.scss'

type Item = {
  icon: IconName
  title: string
  description: string
}

const items: Item[] = [
  {
    icon: 'target',
    title: 'Мало проектов',
    description:
      'Одновременно в работе не более 5 проектов. Каждый получает максимальное внимание команды.',
  },
  {
    icon: 'zap',
    title: 'AI как инструмент',
    description:
      'Нейросети ускоряют рутину, не заменяют экспертизу. Ниже цена — не значит ниже качество.',
  },
  {
    icon: 'layers',
    title: 'Отлаженные процессы',
    description:
      'Выверенные процессы и AI-инструменты дают скорость и качество большой студии при стоимости небольшой команды.',
  },
  {
    icon: 'code',
    title: 'Полный цикл',
    description:
      'Дизайн, разработка, SEO, GEO, поддержка — всё под одной крышей. Без потерь на стыках между подрядчиками.',
  },
  {
    icon: 'shield',
    title: 'Код без замков',
    description:
      'Чистый, документированный код. Если понадобится другой специалист — он подхватит проект без боли.',
  },
  {
    icon: 'rocket',
    title: 'Результат без балласта',
    description:
      'Не раздуваем смету, не пишем отчёты ради отчётов и не держим менеджеров, которые съедают ваш бюджет. Только работа и результат.',
  },
]

export function WhyUs() {
  return (
    <section className={styles.root} id="why">
      <Container>
        <SectionTitle eyebrow="Наш подход" align="center">
          Мы устроены иначе
        </SectionTitle>
        <ul className={styles.grid} role="list">
          {items.map((item) => (
            <li key={item.title} className={styles.card}>
              <span className={styles.iconWrap} aria-hidden="true">
                <Icon name={item.icon} size={24} />
              </span>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.desc}>{item.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
```

- [ ] **Step 2: Create WhyUs.module.scss**

```scss
// src/widgets/WhyUs/ui/WhyUs.module.scss
.root {
  @include section-pad;
  background: $color-bg-section;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
  margin-top: $spacing-2xl;
  list-style: none;
  padding: 0;

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.card {
  @include card-base;
  padding: $spacing-xl;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  transition:
    border-color $transition-base,
    transform $transition-base;

  &:hover {
    border-color: rgba($color-purple, 0.5);
    transform: translateY(-2px);
  }
}

.iconWrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: $radius-md;
  background: rgba($color-purple, 0.12);
  color: $color-accent;
  flex-shrink: 0;
}

.title {
  @include body-text($font-size-md);
  font-weight: 600;
  color: $color-text;
}

.desc {
  @include body-text($font-size-base);
  color: $color-text-muted;
}
```

- [ ] **Step 3: Create index.ts**

```ts
// src/widgets/WhyUs/index.ts
export { WhyUs } from './ui/WhyUs'
```

- [ ] **Step 4: Commit**

```bash
git add src/widgets/WhyUs/
git commit -m "feat: add WhyUs widget with 6 differentiator cards"
```

---

## Task 7: Services widget

**Files:**

- Create: `src/widgets/Services/ui/Services.tsx`
- Create: `src/widgets/Services/ui/Services.module.scss`
- Modify: `src/widgets/Services/index.ts`

- [ ] **Step 1: Create Services.tsx**

```tsx
// src/widgets/Services/ui/Services.tsx
import { Container, Icon, SectionTitle } from '@/shared/ui'
import { services } from '@/entities/Service'
import styles from './Services.module.scss'

export function Services() {
  return (
    <section className={styles.root} id="services">
      <Container>
        <SectionTitle eyebrow="Что мы делаем" align="center">
          Полный цикл разработки
        </SectionTitle>
        <ul className={styles.grid} role="list">
          {services.map((service) => (
            <li key={service.id} className={styles.card}>
              <span className={styles.iconWrap} aria-hidden="true">
                <Icon name={service.icon} size={24} />
              </span>
              <h3 className={styles.title}>{service.title}</h3>
              <p className={styles.desc}>{service.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
```

- [ ] **Step 2: Create Services.module.scss**

```scss
// src/widgets/Services/ui/Services.module.scss
.root {
  @include section-pad;
  background: $color-bg;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
  margin-top: $spacing-2xl;
  list-style: none;
  padding: 0;

  // last row: 2 items centered on desktop (5 total = 3+2)
  @include desktop {
    & > li:nth-child(4) {
      grid-column: 1 / 2;
      margin-left: calc(50% + #{$spacing-lg} / 2);
    }

    & > li:nth-child(5) {
      grid-column: 2 / 3;
    }
  }

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.card {
  @include card-base;
  padding: $spacing-xl;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  transition:
    border-color $transition-base,
    transform $transition-base;

  &:hover {
    border-color: rgba($color-purple, 0.5);
    transform: translateY(-2px);
  }
}

.iconWrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: $radius-md;
  background: rgba($color-purple, 0.12);
  color: $color-accent;
  flex-shrink: 0;
}

.title {
  @include body-text($font-size-md);
  font-weight: 600;
  color: $color-text;
}

.desc {
  @include body-text($font-size-base);
  color: $color-text-muted;
}
```

- [ ] **Step 3: Update index.ts**

```ts
// src/widgets/Services/index.ts
export { Services } from './ui/Services'
```

- [ ] **Step 4: Commit**

```bash
git add src/widgets/Services/
git commit -m "feat: add Services widget with 5 service cards"
```

---

## Task 8: HowItWorks widget

**Files:**

- Create: `src/widgets/HowItWorks/ui/HowItWorks.tsx`
- Create: `src/widgets/HowItWorks/ui/HowItWorks.module.scss`
- Modify: `src/widgets/HowItWorks/index.ts`

- [ ] **Step 1: Create HowItWorks.tsx**

```tsx
// src/widgets/HowItWorks/ui/HowItWorks.tsx
import { Container, SectionTitle } from '@/shared/ui'
import styles from './HowItWorks.module.scss'

const steps = [
  {
    num: '01',
    title: 'Погружение',
    description:
      'Исследуем бизнес, цели и аудиторию. Формулируем задачу точнее, чем сформулировал клиент.',
  },
  {
    num: '02',
    title: 'Стратегия',
    description: 'Проектируем решение, согласуем этапы, сроки и KPI.',
  },
  {
    num: '03',
    title: 'Дизайн',
    description: 'Создаём интерфейс, итерируем с клиентом до полного согласования.',
  },
  {
    num: '04',
    title: 'Разработка',
    description:
      'AI ускоряет рутину — код ревьюит человек. Результат: скорость без потери качества.',
  },
  {
    num: '05',
    title: 'Запуск',
    description: 'Деплой, SEO-старт, настройка аналитики.',
  },
  {
    num: '06',
    title: 'Партнёрство',
    description: 'Поддержка, доработки, развитие. Остаёмся рядом столько, сколько нужно.',
  },
]

export function HowItWorks() {
  return (
    <section className={styles.root} id="process">
      <Container>
        <SectionTitle eyebrow="Процесс" align="center">
          От замысла до результата
        </SectionTitle>
        <ol className={styles.list}>
          {steps.map((step, idx) => (
            <li key={step.num} className={styles.step}>
              <div className={styles.numWrap}>
                <span className={styles.num}>{step.num}</span>
                {idx < steps.length - 1 && <span className={styles.line} aria-hidden="true" />}
              </div>
              <div className={styles.content}>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.desc}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
```

- [ ] **Step 2: Create HowItWorks.module.scss**

```scss
// src/widgets/HowItWorks/ui/HowItWorks.module.scss
.root {
  @include section-pad;
  background: $color-bg-section;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: $spacing-2xl;
  list-style: none;
  padding: 0;
  max-width: 720px;
  margin-inline: auto;
  margin-top: $spacing-2xl;
}

.step {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: $spacing-lg;
  position: relative;
}

.numWrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba($color-purple, 0.12);
  border: 1px solid rgba($color-purple, 0.3);
  color: $color-accent;
  font-family: $font-display;
  font-size: $font-size-sm;
  font-weight: 700;
  flex-shrink: 0;
}

.line {
  display: block;
  width: 1px;
  flex: 1;
  min-height: 32px;
  background: linear-gradient(to bottom, rgba($color-purple, 0.3), rgba($color-purple, 0.05));
  margin: $spacing-sm 0;
}

.content {
  padding-bottom: $spacing-2xl;

  .step:last-child & {
    padding-bottom: 0;
  }
}

.title {
  @include body-text($font-size-md);
  font-weight: 600;
  color: $color-text;
  margin-bottom: $spacing-sm;
}

.desc {
  @include body-text($font-size-base);
  color: $color-text-muted;
}
```

- [ ] **Step 3: Update index.ts**

```ts
// src/widgets/HowItWorks/index.ts
export { HowItWorks } from './ui/HowItWorks'
```

- [ ] **Step 4: Commit**

```bash
git add src/widgets/HowItWorks/
git commit -m "feat: add HowItWorks widget with 6-step vertical stepper"
```

---

## Task 9: Portfolio widget

**Files:**

- Create: `src/widgets/Portfolio/ui/Portfolio.tsx`
- Create: `src/widgets/Portfolio/ui/Portfolio.module.scss`
- Modify: `src/widgets/Portfolio/index.ts`

- [ ] **Step 1: Create Portfolio.tsx**

```tsx
// src/widgets/Portfolio/ui/Portfolio.tsx
import { Container, SectionTitle } from '@/shared/ui'
import { projects } from '@/entities/Project'
import styles from './Portfolio.module.scss'

export function Portfolio() {
  return (
    <section className={styles.root} id="portfolio">
      <Container>
        <SectionTitle eyebrow="Наши работы" align="center">
          Проекты
        </SectionTitle>
        <ul className={styles.grid} role="list">
          {projects.map((project) => (
            <li key={project.id} className={styles.card}>
              <div className={styles.image} aria-hidden="true">
                {project.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.imageUrl} alt={project.title} className={styles.img} />
                ) : (
                  <div className={styles.placeholder} />
                )}
              </div>
              <div className={styles.meta}>
                <h3 className={styles.title}>{project.title}</h3>
                <ul className={styles.tags} role="list">
                  {project.tags.map((tag) => (
                    <li key={tag} className={styles.tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
```

- [ ] **Step 2: Create Portfolio.module.scss**

```scss
// src/widgets/Portfolio/ui/Portfolio.module.scss
.root {
  @include section-pad;
  background: $color-bg;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
  margin-top: $spacing-2xl;
  list-style: none;
  padding: 0;

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.card {
  @include card-base;
  overflow: hidden;
  transition:
    border-color $transition-base,
    transform $transition-base;

  &:hover {
    border-color: rgba($color-purple, 0.5);
    transform: translateY(-4px);
  }
}

.image {
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform $transition-slow;

  .card:hover & {
    transform: scale(1.03);
  }
}

.placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba($color-purple, 0.08), rgba($color-blue, 0.05));
}

.meta {
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.title {
  @include body-text($font-size-md);
  font-weight: 600;
  color: $color-text;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
  list-style: none;
  padding: 0;
}

.tag {
  @include eyebrow-text;
  font-size: 10px;
  color: $color-accent;
  background: rgba($color-purple, 0.1);
  border: 1px solid rgba($color-purple, 0.2);
  border-radius: $radius-pill;
  padding: 4px 10px;
}
```

- [ ] **Step 3: Update index.ts**

```ts
// src/widgets/Portfolio/index.ts
export { Portfolio } from './ui/Portfolio'
```

- [ ] **Step 4: Commit**

```bash
git add src/widgets/Portfolio/
git commit -m "feat: add Portfolio widget with project cards grid"
```

---

## Task 10: Stats widget

**Files:**

- Create: `src/widgets/Stats/ui/Stats.tsx`
- Create: `src/widgets/Stats/ui/Stats.module.scss`
- Modify: `src/widgets/Stats/index.ts`

- [ ] **Step 1: Create Stats.tsx**

```tsx
// src/widgets/Stats/ui/Stats.tsx
import { Container } from '@/shared/ui'
import styles from './Stats.module.scss'

const stats = [
  { value: '100%', label: 'проектов сданы в срок' },
  { value: '×2', label: 'быстрее среднего за счёт AI' },
  { value: '≤5', label: 'проектов одновременно' },
  { value: '0', label: 'брошенных проектов' },
]

export function Stats() {
  return (
    <section className={styles.root}>
      <Container>
        <ul className={styles.list} role="list">
          {stats.map((stat) => (
            <li key={stat.label} className={styles.item}>
              <span className={styles.value}>{stat.value}</span>
              <span className={styles.label}>{stat.label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
```

- [ ] **Step 2: Create Stats.module.scss**

```scss
// src/widgets/Stats/ui/Stats.module.scss
.root {
  padding-top: $spacing-2xl;
  padding-bottom: $spacing-2xl;
  background: $color-bg-section;
  border-top: 1px solid $color-border;
  border-bottom: 1px solid $color-border;
}

.list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  list-style: none;
  padding: 0;
  margin: 0;

  @include mobile {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-xl;
  }
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  text-align: center;
  padding: $spacing-lg;
  position: relative;

  // divider between items
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 20%;
    height: 60%;
    width: 1px;
    background: $color-border;

    @include mobile {
      display: none;
    }
  }
}

.value {
  @include gradient-text;
  font-family: $font-display;
  font-size: $font-size-2xl;
  font-weight: 700;
  line-height: 1;

  @include mobile {
    font-size: $font-size-xl;
  }
}

.label {
  @include body-text($font-size-sm);
  color: $color-text-muted;
  max-width: 120px;
}
```

- [ ] **Step 3: Update index.ts**

```ts
// src/widgets/Stats/index.ts
export { Stats } from './ui/Stats'
```

- [ ] **Step 4: Commit**

```bash
git add src/widgets/Stats/
git commit -m "feat: add Stats widget with 4 key metrics"
```

---

## Task 11: Testimonials widget

**Files:**

- Create: `src/widgets/Testimonials/ui/Testimonials.tsx`
- Create: `src/widgets/Testimonials/ui/Testimonials.module.scss`
- Modify: `src/widgets/Testimonials/index.ts`

- [ ] **Step 1: Create Testimonials.tsx**

```tsx
// src/widgets/Testimonials/ui/Testimonials.tsx
import { Container, Icon, SectionTitle } from '@/shared/ui'
import { testimonials } from '@/entities/Testimonial'
import styles from './Testimonials.module.scss'

export function Testimonials() {
  return (
    <section className={styles.root}>
      <Container>
        <SectionTitle eyebrow="Что говорят клиенты" align="center">
          Отзывы
        </SectionTitle>
        <ul className={styles.grid} role="list">
          {testimonials.map((t) => (
            <li key={t.id} className={styles.card}>
              <div className={styles.stars} aria-label="5 из 5 звёзд">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" size={14} />
                ))}
              </div>
              <p className={styles.text}>{t.text}</p>
              <div className={styles.author}>
                <div className={styles.avatar} aria-hidden="true">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className={styles.name}>{t.author}</div>
                  <div className={styles.role}>
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
```

- [ ] **Step 2: Create Testimonials.module.scss**

```scss
// src/widgets/Testimonials/ui/Testimonials.module.scss
.root {
  @include section-pad;
  background: $color-bg;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
  margin-top: $spacing-2xl;
  list-style: none;
  padding: 0;

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.card {
  @include card-base;
  padding: $spacing-xl;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.stars {
  display: flex;
  gap: 4px;
  color: $color-accent;
}

.text {
  @include body-text($font-size-base);
  color: $color-gray-light;
  flex: 1;
  font-style: italic;
  line-height: 1.7;

  &::before {
    content: '"';
  }

  &::after {
    content: '"';
  }
}

.author {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-top: auto;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-purple, $color-blue);
  @include flex-center;
  font-family: $font-display;
  font-weight: 700;
  font-size: $font-size-md;
  color: $color-white;
  flex-shrink: 0;
}

.name {
  @include body-text($font-size-base);
  font-weight: 600;
  color: $color-text;
}

.role {
  @include body-text($font-size-sm);
  color: $color-text-muted;
}
```

- [ ] **Step 3: Update index.ts**

```ts
// src/widgets/Testimonials/index.ts
export { Testimonials } from './ui/Testimonials'
```

- [ ] **Step 4: Commit**

```bash
git add src/widgets/Testimonials/
git commit -m "feat: add Testimonials widget with 3 review cards"
```

---

## Task 12: Pricing widget

**Files:**

- Create: `src/widgets/Pricing/ui/Pricing.tsx`
- Create: `src/widgets/Pricing/ui/Pricing.module.scss`
- Modify: `src/widgets/Pricing/index.ts`

- [ ] **Step 1: Create Pricing.tsx**

```tsx
// src/widgets/Pricing/ui/Pricing.tsx
import { Button, Container, Icon, SectionTitle } from '@/shared/ui'
import { pricingPlans } from '@/entities/PricingPlan'
import styles from './Pricing.module.scss'

export function Pricing() {
  return (
    <section className={styles.root} id="pricing">
      <Container>
        <SectionTitle eyebrow="Прозрачные цены" align="center">
          Выберите формат работы
        </SectionTitle>
        <ul className={styles.grid} role="list">
          {pricingPlans.map((plan) => (
            <li
              key={plan.id}
              className={[styles.card, plan.highlighted && styles.highlighted]
                .filter(Boolean)
                .join(' ')}
            >
              {plan.highlighted && <span className={styles.badge}>Популярный выбор</span>}
              <div className={styles.top}>
                <h3 className={styles.name}>{plan.name}</h3>
                <p className={styles.priceNote}>{plan.priceNote}</p>
                <div className={styles.price}>{plan.price}</div>
                <p className={styles.desc}>{plan.description}</p>
              </div>
              <ul className={styles.features} role="list">
                {plan.features.map((feature) => (
                  <li key={feature} className={styles.feature}>
                    <Icon name="check" size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                href="#cta"
                variant={plan.highlighted ? 'primary' : 'ghost'}
                className={styles.cta}
              >
                {plan.cta}
              </Button>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
```

- [ ] **Step 2: Create Pricing.module.scss**

```scss
// src/widgets/Pricing/ui/Pricing.module.scss
.root {
  @include section-pad;
  background: $color-bg-section;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
  margin-top: $spacing-2xl;
  list-style: none;
  padding: 0;
  align-items: start;

  @include tablet {
    grid-template-columns: 1fr;
    max-width: 480px;
    margin-inline: auto;
  }

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.card {
  @include card-base;
  padding: $spacing-xl;
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
  position: relative;
}

.highlighted {
  border-color: rgba($color-purple, 0.6);
  background: rgba($color-purple, 0.05);
  box-shadow: 0 0 40px rgba($color-purple, 0.1);
}

.badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, $color-purple, $color-blue);
  color: $color-white;
  padding: 4px 16px;
  border-radius: $radius-pill;
  font-size: $font-size-xs;
  font-weight: 600;
  white-space: nowrap;
}

.top {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.name {
  @include body-text($font-size-md);
  font-weight: 700;
  color: $color-text;
}

.priceNote {
  @include eyebrow-text;
  color: $color-text-muted;
}

.price {
  font-family: $font-display;
  font-size: $font-size-xl;
  font-weight: 700;
  color: $color-text;
  line-height: 1.1;
  margin-top: $spacing-sm;
}

.desc {
  @include body-text($font-size-sm);
  color: $color-text-muted;
}

.features {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  flex: 1;
}

.feature {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
  @include body-text($font-size-sm);
  color: $color-gray-light;

  svg {
    color: $color-accent;
    flex-shrink: 0;
    margin-top: 2px;
  }
}

.cta {
  width: 100%;
  justify-content: center;
}
```

- [ ] **Step 3: Update index.ts**

```ts
// src/widgets/Pricing/index.ts
export { Pricing } from './ui/Pricing'
```

- [ ] **Step 4: Commit**

```bash
git add src/widgets/Pricing/
git commit -m "feat: add Pricing widget with 3 plan cards"
```

---

## Task 13: Cta widget

**Files:**

- Create: `src/widgets/Cta/ui/Cta.tsx`
- Create: `src/widgets/Cta/ui/Cta.module.scss`
- Modify: `src/widgets/Cta/index.ts`

- [ ] **Step 1: Create Cta.tsx**

```tsx
// src/widgets/Cta/ui/Cta.tsx
'use client'

import { useState } from 'react'
import { Button, Container, Modal } from '@/shared/ui'
import { ContactForm } from '@/features/ContactForm'
import styles from './Cta.module.scss'

export function Cta() {
  const [open, setOpen] = useState(false)

  return (
    <section className={styles.root} id="cta">
      <div className={styles.glow} aria-hidden="true" />
      <Container className={styles.inner}>
        <p className={styles.eyebrow}>Готовы начать?</p>
        <h2 className={styles.heading}>
          Давайте создадим ваш
          <br />
          следующий проект
        </h2>
        <p className={styles.sub}>Расскажите о задаче — обсудим, как её решить</p>
        <Button size="lg" onClick={() => setOpen(true)}>
          Обсудить проект
        </Button>
      </Container>

      <Modal open={open} onClose={() => setOpen(false)} title="Обсудить проект">
        <ContactForm onSuccess={() => setOpen(false)} />
      </Modal>
    </section>
  )
}
```

- [ ] **Step 2: Create Cta.module.scss**

```scss
// src/widgets/Cta/ui/Cta.module.scss
.root {
  @include section-pad;
  background: $color-bg;
  position: relative;
  overflow: hidden;
}

.glow {
  position: absolute;
  bottom: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 500px;
  background: radial-gradient(
    ellipse at center,
    rgba($color-purple, 0.15) 0%,
    rgba($color-blue, 0.06) 50%,
    transparent 70%
  );
  pointer-events: none;
  filter: blur(40px);
}

.inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: $spacing-xl;
}

.eyebrow {
  @include eyebrow-text;
  color: $color-accent;
}

.heading {
  @include display-text($font-size-2xl);
  color: $color-text;
  max-width: 600px;

  @include mobile {
    font-size: $font-size-xl;
  }
}

.sub {
  @include body-text($font-size-md);
  color: $color-text-muted;
}
```

- [ ] **Step 3: Update index.ts**

```ts
// src/widgets/Cta/index.ts
export { Cta } from './ui/Cta'
```

- [ ] **Step 4: Commit**

```bash
git add src/widgets/Cta/
git commit -m "feat: add Cta widget with modal contact form"
```

---

## Task 14: Footer widget

**Files:**

- Create: `src/widgets/Footer/ui/Footer.tsx`
- Create: `src/widgets/Footer/ui/Footer.module.scss`
- Modify: `src/widgets/Footer/index.ts`

- [ ] **Step 1: Create Footer.tsx**

```tsx
// src/widgets/Footer/ui/Footer.tsx
import Link from 'next/link'
import { Container, Icon } from '@/shared/ui'
import styles from './Footer.module.scss'

const NAV_LINKS = [
  { label: 'Услуги', href: '#services' },
  { label: 'Как работаем', href: '#process' },
  { label: 'Портфолио', href: '#portfolio' },
  { label: 'Цены', href: '#pricing' },
]

export function Footer() {
  return (
    <footer className={styles.root}>
      <Container className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              Project<span className={styles.accent}>42</span>
            </Link>
            <p className={styles.tagline}>Не ещё одна веб-студия</p>
          </div>

          <nav className={styles.nav} aria-label="Навигация в подвале">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className={styles.social}>
            <a
              href="https://t.me/project42studio"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
            >
              <Icon name="send" size={18} />
            </a>
            <a
              href="https://instagram.com/project42studio"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Icon name="instagram" size={18} />
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>© {new Date().getFullYear()} Project 42</p>
          <p className={styles.copy}>Решаем задачи бизнеса</p>
        </div>
      </Container>
    </footer>
  )
}
```

- [ ] **Step 2: Create Footer.module.scss**

```scss
// src/widgets/Footer/ui/Footer.module.scss
.root {
  background: $color-bg-dark;
  border-top: 1px solid $color-border;
}

.inner {
  padding-top: $spacing-2xl;
  padding-bottom: $spacing-xl;
}

.top {
  @include flex-between;
  align-items: flex-start;
  gap: $spacing-xl;
  padding-bottom: $spacing-xl;
  border-bottom: 1px solid $color-border;

  @include mobile {
    flex-direction: column;
    gap: $spacing-lg;
  }
}

.brand {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.logo {
  @include display-text($font-size-md);
  text-decoration: none;
  color: $color-text;
  letter-spacing: -0.02em;
}

.accent {
  color: $color-accent;
}

.tagline {
  @include body-text($font-size-sm);
  color: $color-text-muted;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  @include mobile {
    flex-direction: row;
    flex-wrap: wrap;
    gap: $spacing-md;
  }
}

.navLink {
  @include body-text($font-size-sm);
  color: $color-text-muted;
  text-decoration: none;
  transition: color $transition-base;

  &:hover {
    color: $color-text;
  }
}

.social {
  display: flex;
  gap: $spacing-md;
}

.socialLink {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: $radius-md;
  border: 1px solid $color-border;
  color: $color-text-muted;
  text-decoration: none;
  transition:
    color $transition-base,
    border-color $transition-base;

  &:hover {
    color: $color-text;
    border-color: rgba($color-white, 0.2);
  }
}

.bottom {
  @include flex-between;
  padding-top: $spacing-xl;

  @include mobile {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-sm;
  }
}

.copy {
  @include body-text($font-size-sm);
  color: $color-text-muted;
}
```

- [ ] **Step 3: Update index.ts**

```ts
// src/widgets/Footer/index.ts
export { Footer } from './ui/Footer'
```

- [ ] **Step 4: Commit**

```bash
git add src/widgets/Footer/
git commit -m "feat: add Footer widget with nav, social links and copyright"
```

---

## Task 15: Assemble page.tsx and verify

**Files:**

- Modify: `src/app/page.tsx`

- [ ] **Step 1: Assemble all widgets in page.tsx**

```tsx
// src/app/page.tsx
import { Header } from '@/widgets/Header'
import { Hero } from '@/widgets/Hero'
import { WhyUs } from '@/widgets/WhyUs'
import { Services } from '@/widgets/Services'
import { HowItWorks } from '@/widgets/HowItWorks'
import { Portfolio } from '@/widgets/Portfolio'
import { Stats } from '@/widgets/Stats'
import { Testimonials } from '@/widgets/Testimonials'
import { Pricing } from '@/widgets/Pricing'
import { Cta } from '@/widgets/Cta'
import { Footer } from '@/widgets/Footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhyUs />
        <Services />
        <HowItWorks />
        <Portfolio />
        <Stats />
        <Testimonials />
        <Pricing />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Run type check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Run linter**

```bash
npm run lint
```

Expected: 0 errors.

- [ ] **Step 4: Start dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:3000` and verify:

- Header is sticky, blurs on scroll, burger works on mobile
- Hero shows headline, subtitle, two CTA buttons, gradient glow
- WhyUs shows 6 cards in 3-column grid
- Services shows 5 cards
- HowItWorks shows 6 numbered steps with connecting lines
- Portfolio shows 3 placeholder cards
- Stats shows 4 metrics in one row
- Testimonials shows 3 review cards
- Pricing shows 3 cards, middle one highlighted with badge
- Cta shows headline and button that opens modal with form
- Footer shows logo, nav, social icons, copyright
- All anchor links (`#services`, `#portfolio`, etc.) scroll to correct sections

- [ ] **Step 5: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 6: Final commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble all widgets in page.tsx — landing complete"
```

---

## Self-Review

**Spec coverage check:**

| Spec Section                          | Task    |
| ------------------------------------- | ------- |
| Header — sticky, blur, burger         | Task 4  |
| Hero — headline, glow, CTAs           | Task 5  |
| WhyUs — 6 differentiator cards        | Task 6  |
| Services — 5 service cards            | Task 7  |
| HowItWorks — 6 steps stepper          | Task 8  |
| Portfolio — 3 placeholder cards       | Task 9  |
| Stats — 4 metrics                     | Task 10 |
| Testimonials — 3 reviews              | Task 11 |
| Pricing — 3 plans, middle highlighted | Task 12 |
| Cta — modal with form → Telegram      | Task 13 |
| Footer — nav, social, copyright       | Task 14 |
| SEO config update                     | Task 1  |
| ContactForm options update            | Task 3  |
| All entities with data                | Task 2  |
| Assembly + build verify               | Task 15 |

**Placeholder scan:** No TBD, no TODO, all steps have complete code.

**Type consistency:**

- `IconName` used in `Service.icon`, `WhyUs items`, `Services` — all reference `icons.ts` keys added in Task 1.
- `pricingPlans` imported from `@/entities/PricingPlan` — entity created in Task 2, imported in Task 12.
- `ContactForm` imported in `Cta` — exists at `@/features/ContactForm`, updated in Task 3.
- `services`, `projects`, `testimonials` — all created in Task 2, imported in Tasks 7, 9, 11.
