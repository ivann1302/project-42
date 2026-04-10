# SEO Аудит — Project 42

**Дата:** 2026-04-10  
**Сайт:** https://project42.studio  
**Тип бизнеса:** Агентство (веб-разработка, дизайн, SEO/GEO)  
**Страниц в индексе:** 3 (/, /portfolio, /services)

---

## SEO Health Score: 48 / 100

| Категория                         | Вес | Оценка | Итог      |
| --------------------------------- | --- | ------ | --------- |
| Технический SEO                   | 25% | 45/100 | 11.25     |
| Качество контента                 | 25% | 55/100 | 13.75     |
| On-Page SEO                       | 20% | 50/100 | 10.00     |
| Schema / Структурированные данные | 10% | 0/100  | 0.00      |
| Производительность (CWV)          | 10% | 65/100 | 6.50      |
| Изображения                       | 5%  | 40/100 | 2.00      |
| AI Search Readiness               | 5%  | 50/100 | 2.50      |
| **Итого**                         |     |        | **46.00** |

---

## Топ-5 критических проблем

1. **Нет структурированных данных (Schema.org)** — ни одного JSON-LD блока на сайте
2. **`/services` — пустая страница** — находится в sitemap, но рендерит только `{/* Services page sections */}`
3. **`/portfolio` отсутствует в sitemap.ts** — страница не попадает в индекс через карту сайта
4. **Нет robots.txt** — поисковики не знают правил обхода
5. **Нет OG-изображения** — превью при репосте в соцсетях/мессенджерах отсутствует

## Топ-5 быстрых побед (Quick Wins)

1. Добавить Organization + WebSite schema — 30 минут, +10 к score
2. Добавить `/portfolio` в sitemap.ts — 2 минуты
3. Создать robots.txt — 5 минут
4. Заменить `<img>` на `<Image>` из Next.js в Portfolio — 15 минут
5. Добавить favicon — 10 минут

---

## Технический SEO

### robots.txt

- **Статус:** ОТСУТСТВУЕТ
- Файл `public/robots.txt` не создан
- Поисковые роботы работают по дефолтным правилам, не зная о `/sitemap.xml`

### Sitemap

- **Файл:** `src/app/sitemap.ts` — генерируется правильно через Next.js
- **Проблема 1:** `/portfolio` не включён в sitemap
  ```
  Текущие URL: /, /services
  Отсутствует: /portfolio
  ```
- **Проблема 2:** `/services` — пустая страница — её не стоит включать в sitemap до наполнения
- `changeFrequency: 'monthly'` — подходит для агентства

### Canonical

- Нет ручных canonical тегов — Next.js устанавливает их автоматически. **ОК.**

### `next.config.ts`

- Нет настроек для оптимизации изображений через `<Image>` (domains/remotePatterns)
- Нет заголовков безопасности (X-Frame-Options, CSP, X-Content-Type-Options)

### Заголовки безопасности

Не настроены в next.config.ts. Влияет на технический SEO скор в Lighthouse:

- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`

---

## On-Page SEO

### Главная страница (`/`)

| Элемент     | Текущее значение                                            | Проблема                                              |
| ----------- | ----------------------------------------------------------- | ----------------------------------------------------- |
| Title       | `Project 42 — Не ещё одна веб-студия`                       | "Не" в заголовке — негативное слово, хуже ранжируется |
| Description | `Решаем задачи бизнеса, а не просто делаем сайты...`        | "не просто" — снова негатив; описание слишком общее   |
| H1          | `AI-студия полного цикла разработки и сопровождения сайтов` | Нет ключевых слов города/региона                      |
| Keywords    | `['веб-студия', ..., 'next.js', ...]`                       | `next.js` — ключ для разработчиков, не для клиентов   |
| OG Image    | Не задано                                                   | При шэринге нет превью                                |
| Favicon     | Не настроен в layout                                        | Нет иконки во вкладке браузера                        |

### Страница `/portfolio`

| Элемент     | Значение                                               | Оценка                                               |
| ----------- | ------------------------------------------------------ | ---------------------------------------------------- |
| Title       | `Портфолио \| Project 42`                              | ОК                                                   |
| Description | `...корпоративные сайты, лендинги, интернет-магазины.` | Упомянуты интернет-магазины, которых нет в портфолио |

### Страница `/services`

| Элемент   | Значение                         | Оценка                               |
| --------- | -------------------------------- | ------------------------------------ |
| Контент   | `{/* Services page sections */}` | Пустая страница — тонкий контент     |
| В sitemap | Да                               | Нельзя индексировать пустую страницу |

---

## Schema / Структурированные данные

**Статус: полностью отсутствуют (0/100)**

Ни один тип Schema.org не реализован. Для агентства с данным контентом критично добавить:

### Приоритет 1 — Organization (сайт агентства)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Project 42",
  "url": "https://project42.studio",
  "logo": "https://project42.studio/logo.png",
  "description": "AI-студия полного цикла разработки и сопровождения сайтов",
  "sameAs": ["https://t.me/project42studio", "https://instagram.com/project42studio"],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "Russian"
  }
}
```

### Приоритет 2 — WebSite (поиск по сайту)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Project 42",
  "url": "https://project42.studio"
}
```

### Приоритет 3 — Service (для каждой услуги)

Дизайн, Разработка, SEO, GEO, Яндекс.Директ, Поддержка — каждая услуга как `Service` schema.

### Приоритет 4 — FAQPage

FAQ контент уже есть (6 вопросов). Добавить schema. Приоритет — информационный: Google ограничил rich results FAQ для коммерческих сайтов (август 2023), но FAQPage помогает AI-поисковикам (ChatGPT, Perplexity) цитировать контент.

### Приоритет 5 — CreativeWork / Portfolio

3 проекта в портфолио — каждый как `CreativeWork` с клиентом и описанием.

---

## Качество контента

### Главная страница

| Секция          | Оценка | Проблемы                                             |
| --------------- | ------ | ---------------------------------------------------- |
| Hero            | 5/10   | Нет конкретного результата/выгоды в заголовке        |
| WhyUs           | 9/10   | Сильно, конкретно                                    |
| Services        | 7/10   | Описания краткие, мало ключевых слов                 |
| HowItWorks      | 8/10   | Структурировано, понятно                             |
| WhatWeDontDo    | 6/10   | Опечатки критически снижают доверие                  |
| Portfolio       | 6/10   | Только 3 проекта                                     |
| Stats           | 7/10   | Расхождение: WhyUs говорит "4 проекта", Stats — "≤5" |
| Testimonials    | 6/10   | Нет фото, только инициалы, 1 опечатка                |
| DirectorMessage | 8/10   | Нет фото основателя                                  |
| Pricing         | 8/10   | Прозрачно, хорошо структурировано                    |
| FAQ             | 9/10   | Качественные ответы, хорошая структура               |

### Опечатки (критично для веб-студии)

**`src/widgets/WhatWeDontDo/ui/WhatWeDontDo.tsx`:**

- `ньансы` → `нюансы`
- `навешываем` → `навешиваем`
- `твердно убеждены` → `твёрдо убеждены`

**`src/entities/Testimonial/model/data.ts`, строка 6:**

- `мнее чем` → `менее чем`

### Расхождение данных

- **WhyUs:** "Не более 4 проектов в работе"
- **Stats:** "≤5 проектов одновременно"

Одна из цифр должна быть исправлена.

---

## Изображения

### Portfolio — использование `<img>` вместо `<Image>`

**Файл:** `src/widgets/Portfolio/ui/Portfolio.tsx`, строка 19

```tsx
// Текущее (плохо):
;<img src={project.desktopImageUrl} alt={project.title} className={styles.img} />

// Должно быть:
import Image from 'next/image'
;<Image src={project.desktopImageUrl} alt={project.title} fill className={styles.img} />
```

Проблемы текущей реализации:

- Нет автоматической оптимизации размера
- Нет lazy loading от Next.js
- Нет автоматической конвертации в WebP/AVIF
- Отключён через `// eslint-disable-next-line @next/next/no-img-element`

### Alt тексты

- Portfolio: есть (`alt={project.title}`) — ОК, но можно улучшить
- DirectorMessage avatar: `aria-hidden="true"` — ОК (декоративный элемент)

### OG Image

- Не задано в layout.tsx и ни на одной странице
- Нужен файл `public/og-image.jpg` (1200×630px) и запись в metadata

---

## Производительность (Core Web Vitals)

_Измерение на живом сайте невозможно — анализ по коду_

### Положительное

- Шрифты: `display: 'swap'` — ОК
- CountUp.js: динамический импорт `await import('countup.js')` — ОК
- IntersectionObserver: используется для анимаций — ОК
- Изображения: `.webp` формат — ОК

### Проблемы

- **StarField** (`<StarField />`) рендерится в каждой секции (~10 экземпляров) — потенциально высокая нагрузка на GPU
- **Portfolio `<img>`** без `loading="lazy"` и без явных размеров — риск Layout Shift (CLS)
- **`'use client'`** на многих компонентах (WhyUs, Stats, HowItWorks, WhatWeDontDo) — снижает SSR-рендеринг, важный для SEO

---

## AI Search Readiness (GEO)

### Положительное

- Сайт предлагает GEO-оптимизацию как услугу — есть экспертность
- FAQ структурирован логично — легко парсится AI
- Прозрачное ценообразование — AI-поисковики любят конкретные числа

### Проблемы

- **Нет `llms.txt`** — файл для AI-поисковиков, аналог robots.txt
- **Нет структурированных данных** — AI не может уверенно идентифицировать бизнес
- **Контент рендерится на клиенте** (`'use client'`) — часть AI-краулеров не исполняет JS

---

## Внутренняя перелинковка

- Footer навигация ведёт на anchor-ссылки главной страницы — ОК для одностраничной структуры
- Portfolio карточки не ссылаются на отдельные страницы проектов (их нет)
- Нет breadcrumbs
- `/services` упоминается в footer, но страница пустая

---

# ACTION PLAN — План исправления

## Critical (немедленно)

### C-1: Исправить опечатки в текстах

**Файлы:**

- `src/widgets/WhatWeDontDo/ui/WhatWeDontDo.tsx`
- `src/entities/Testimonial/model/data.ts`

**Правки:**

```
ньансы → нюансы
навешываем → навешиваем
твердно убеждены → твёрдо убеждены
мнее чем → менее чем
```

**Почему важно:** Студия, продающая разработку сайтов, не может иметь опечатки — это первый сигнал недоверия.

---

### C-2: Убрать или скрыть пустую страницу `/services` из индекса

**Файл:** `src/app/services/page.tsx`

До наполнения контентом — добавить `noindex`:

```tsx
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}
```

Убрать из `src/app/sitemap.ts`.

---

### C-3: Добавить robots.txt

**Создать:** `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://project42.studio/sitemap.xml
```

---

## High (в течение недели)

### H-1: Добавить Organization + WebSite Schema

**Файл:** `src/app/layout.tsx` — добавить JSON-LD скрипт в `<head>`

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Project 42',
      url: 'https://project42.studio',
      description: 'AI-студия полного цикла разработки и сопровождения сайтов',
      sameAs: ['https://t.me/project42studio', 'https://instagram.com/project42studio'],
    }),
  }}
/>
```

---

### H-2: Добавить `/portfolio` в sitemap

**Файл:** `src/app/sitemap.ts`

```ts
{
  url: `${siteConfig.url}/portfolio`,
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 0.9,
},
```

---

### H-3: Добавить FAQPage Schema

**Файл:** `src/widgets/Faq/ui/Faq.tsx` или отдельный компонент

Сгенерировать JSON-LD из массива `faqItems`. Приоритет — AI-цитируемость.

---

### H-4: Заменить `<img>` на `<Image>` в Portfolio

**Файл:** `src/widgets/Portfolio/ui/Portfolio.tsx`, строка 19

Удалить `// eslint-disable-next-line @next/next/no-img-element`, использовать `next/image`.

---

### H-5: Исправить title главной страницы

**Файл:** `src/shared/config/seo.ts`

```ts
// Текущее (плохо — негативное слово в title):
tagline: 'Не ещё одна веб-студия',

// Варианты:
tagline: 'AI-студия полного цикла',
// или:
tagline: 'Дизайн, разработка, SEO и GEO',
```

---

### H-6: Исправить расхождение цифры "4 vs 5 проектов"

**Файлы:**

- `src/widgets/WhyUs/ui/WhyUs.tsx` — "Не более 4 проектов в работе"
- `src/widgets/Stats/ui/Stats.tsx` — `value: 5`

Привести к одному числу.

---

### H-7: Добавить OG Image

**Файл:** `src/app/layout.tsx` + создать `public/og-image.jpg` (1200×630px)

```ts
openGraph: {
  // ... существующие поля
  images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
},
```

---

## Medium (в течение месяца)

### M-1: Добавить заголовки безопасности в next.config.ts

```ts
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ],
  }]
}
```

---

### M-2: Улучшить meta description главной страницы

**Файл:** `src/shared/config/seo.ts`

```ts
// Текущее:
description: 'Решаем задачи бизнеса, а не просто делаем сайты...'

// Улучшить (конкретнее, без "не"):
description: 'AI-студия полного цикла: дизайн, разработка, SEO и GEO-оптимизация. До 5 проектов одновременно — каждому уделяем полное внимание. От 150 000 ₽.'
```

---

### M-3: Убрать технические ключевые слова из keywords

**Файл:** `src/shared/config/seo.ts`

```ts
// Удалить:
'next.js',
// Добавить:
'создание сайтов',
'веб-студия Москва', // если есть геопривязка
'разработка лендинга',
```

---

### M-4: Исправить description страницы `/portfolio`

**Файл:** `src/app/portfolio/page.tsx`

```ts
// Текущее (упомянуты интернет-магазины которых нет):
description: `...корпоративные сайты, лендинги, интернет-магазины.`

// Исправить:
description: `Проекты веб-студии ${siteConfig.name} — корпоративные сайты, лендинги, AI-оптимизация.`
```

---

### M-5: Добавить favicon

**Файл:** `src/app/layout.tsx`

```ts
export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  // ...
}
```

Создать `public/favicon.ico`.

---

### M-6: Добавить llms.txt для AI-поисковиков

**Создать:** `public/llms.txt`

```
# Project 42

> AI-студия полного цикла: дизайн, веб-разработка, SEO, GEO-оптимизация.

## Услуги
- Дизайн (UX-исследование, прототипирование, UI)
- Разработка (Next.js, React, TypeScript)
- SEO-продвижение
- GEO-оптимизация (Google AI Overviews, ChatGPT, Perplexity)
- Яндекс.Директ
- Поддержка и развитие

## Цены
- Лендинг: от 150 000 ₽
- Корпоративный сайт: от 400 000 ₽
- Индивидуально: по запросу

## Контакты
- Telegram: https://t.me/project42studio
- Сайт: https://project42.studio
```

---

## Low (бэклог)

### L-1: Service Schema для каждой услуги

Добавить JSON-LD `Service` в компонент Services или страницу.

### L-2: CreativeWork Schema для портфолио

JSON-LD для каждого проекта в портфолио.

### L-3: Breadcrumbs на внутренних страницах

`/portfolio` и `/services` — добавить `BreadcrumbList` schema.

### L-4: Перевести анимационные компоненты на SSR

Убрать `'use client'` там, где нет интерактивности (Stats, HowItWorks) — использовать CSS-анимации вместо JS IntersectionObserver.

### L-5: Отдельные страницы для проектов портфолио

`/portfolio/[slug]` — улучшит SEO и даст дополнительные точки входа.

---

## Сводная таблица задач

| ID  | Приоритет | Задача                 | Файл                           | Сложность |
| --- | --------- | ---------------------- | ------------------------------ | --------- |
| C-1 | Critical  | Исправить опечатки     | WhatWeDontDo.tsx, data.ts      | 5 мин     |
| C-2 | Critical  | noindex для /services  | services/page.tsx + sitemap.ts | 5 мин     |
| C-3 | Critical  | Создать robots.txt     | public/robots.txt              | 5 мин     |
| H-1 | High      | Organization Schema    | layout.tsx                     | 30 мин    |
| H-2 | High      | /portfolio в sitemap   | sitemap.ts                     | 2 мин     |
| H-3 | High      | FAQPage Schema         | Faq.tsx                        | 20 мин    |
| H-4 | High      | next/image в Portfolio | Portfolio.tsx                  | 15 мин    |
| H-5 | High      | Исправить title        | seo.ts                         | 5 мин     |
| H-6 | High      | Унифицировать "4 vs 5" | WhyUs.tsx / Stats.tsx          | 2 мин     |
| H-7 | High      | OG Image               | layout.tsx + public/           | 30 мин    |
| M-1 | Medium    | Security headers       | next.config.ts                 | 15 мин    |
| M-2 | Medium    | Meta description       | seo.ts                         | 10 мин    |
| M-3 | Medium    | Keywords               | seo.ts                         | 5 мин     |
| M-4 | Medium    | Portfolio description  | portfolio/page.tsx             | 2 мин     |
| M-5 | Medium    | Favicon                | layout.tsx + public/           | 20 мин    |
| M-6 | Medium    | llms.txt               | public/llms.txt                | 15 мин    |
| L-1 | Low       | Service Schema         | Services.tsx                   | 45 мин    |
| L-2 | Low       | CreativeWork Schema    | Portfolio.tsx                  | 30 мин    |
| L-3 | Low       | Breadcrumbs            | portfolio/page.tsx             | 30 мин    |
| L-4 | Low       | SSR анимации           | Stats.tsx, HowItWorks.tsx      | 2 ч       |
| L-5 | Low       | Страницы проектов      | app/portfolio/[slug]           | 4 ч       |

**Итого Critical + High:** ~2 часа работы → прирост SEO Score ≈ +25 баллов (до ~73/100)
