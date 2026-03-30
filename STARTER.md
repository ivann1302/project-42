# Next.js Landing Starter — Шаблон проекта

Этот файл описывает архитектуру и инфраструктуру проекта. Используй его как промпт для создания аналогичного сайта-визитки/лендинга с другим контентом.

---

## Стек технологий

| Категория     | Технология                                   |
| ------------- | -------------------------------------------- |
| Framework     | Next.js 16 (App Router), React 19            |
| Язык          | TypeScript 5, строгий режим                  |
| Стили         | SCSS Modules + глобальные переменные/миксины |
| Архитектура   | Feature-Sliced Design (FSD)                  |
| Формы         | React Hook Form + Zod (валидация)            |
| Состояние     | Zustand                                      |
| Data fetching | TanStack Query v5                            |
| Тесты unit    | Jest + Testing Library                       |
| Тесты e2e     | Playwright                                   |
| Линтинг       | ESLint 9 + Prettier + Stylelint              |
| Git-хуки      | Husky + lint-staged + Commitlint             |
| Уведомления   | Telegram Bot API (`/api/contact` route)      |
| Деплой        | Vercel                                       |

---

## Структура FSD

```
src/
  app/           ← Next.js App Router: layouts, pages, API routes, providers
  widgets/       ← Крупные блоки UI (Header, Footer, Hero, секции)
  features/      ← Бизнес-функции (форма заявки, обратный звонок)
  entities/      ← Бизнес-сущности (тип данных + карточка + data.ts)
  shared/        ← Переиспользуемое: ui, lib, api, config, styles, types
```

**Правило импортов — только сверху вниз:**
`app` → `widgets` → `features` → `entities` → `shared`

---

## Shared UI компоненты (готовы к переиспользованию)

- **Button** — варианты: `primary` / `secondary` / `ghost`, размеры: `sm` / `md` / `lg`, поддержка `href` → `<Link>`
- **SectionTitle** — `eyebrow` (надпись над заголовком) + `h2`, выравнивание, светлый вариант
- **Container** — `max-width: 1440px`, адаптивные отступы
- **Icon** — реестр inline SVG с `currentColor`, типизированные имена
- **Modal** — модальное окно (для формы заявки)

---

## Дизайн-система (SCSS токены)

### Цвета

Палитра строится по ролям, а не по конкретным значениям. При старте нового проекта — определи свои значения для каждой роли:

```scss
// Нейтральные (базовая шкала от тёмного к светлому)
$color-black: ...; // самый тёмный
$color-dark: ...; // тёмный фон / текст
$color-gray-dark: ...; // вторичный текст
$color-gray-mid: ...; // muted-текст, плейсхолдеры
$color-gray-light: ...; // фон секций
$color-off-white: ...; // основной фон страницы
$color-white: #fff;

// Смысловые поверхности (выводятся из нейтральных)
$color-bg: ...; // фон страницы
$color-bg-dark: ...; // тёмные секции
$color-bg-section: ...; // альтернативный фон секции

// Текст
$color-text: ...; // основной
$color-text-muted: ...; // второстепенный
$color-text-inv: ...; // на тёмном фоне

// Акцент (1–2 брендовых цвета)
$color-accent: ...; // основной акцент
$color-accent-dark: ...; // hover / active состояние

// Границы
$color-border: ...; // на светлом фоне
$color-border-dark: ...; // на тёмном фоне
```

### Типографика

```scss
// CSS-переменные выставляются через next/font в layout.tsx
$font-display: var(--font-display), sans-serif; // заголовки, uppercase
$font-body: var(--font-body), serif; // основной текст

// Размеры
$font-size-base: 14px;
$font-size-md: 16px;
$font-size-lg: 20px;
$font-size-xl: 32px;
$font-size-2xl: 48px;
$font-size-3xl: 72px;
$font-size-hero: 96px;
```

### Breakpoints

```scss
$bp-mobile: 480px;
$bp-tablet: 768px; // @include mobile — ниже этого
$bp-desktop: 1024px;
$bp-wide: 1440px;
```

### SCSS миксины

```scss
@include mobile {
} // < 768px
@include tablet {
} // 768–1023px
@include desktop {
} // > 1024px

@include flex-center;
@include flex-between;
@include display-text($size); // Заголовок display-шрифтом, uppercase
@include body-text($size); // Текст body-шрифтом
@include eyebrow-text; // Маленькая подпись с разрядкой
@include container; // max-width обёртка с отступами
@include text-truncate;
```

> Переменные и миксины доступны глобально во всех SCSS модулях (через `sassOptions.additionalData` в `next.config.ts`).

---

## API: форма заявки → Telegram

**Route:** `POST /api/contact`

Схема данных (Zod):

```ts
{ name, phone, equipment, problem?, _honeypot }
```

- Валидация на сервере через Zod
- Honeypot-поле против спам-ботов
- Отправка в Telegram (поддержка нескольких чатов через `TELEGRAM_CHAT_IDS`)
- Время отправки в часовом поясе Europe/Moscow

**Env-переменные:**

```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_IDS=id1,id2     # или TELEGRAM_CHAT_ID=id
```

---

## Шаблон компонента

```tsx
import type { PropsWithClassName } from '@/shared/types'
import styles from './ComponentName.module.scss'

type Props = PropsWithClassName & {
  // props here
}

export function ComponentName({ className }: Props) {
  return <div className={`${styles.root} ${className ?? ''}`}></div>
}
```

```scss
// ComponentName.module.scss
.root {
  // styles

  @include mobile {
    // mobile overrides
  }
}
```

---

## Шаблон entity

```
src/entities/[Name]/
  model/
    types.ts    ← TypeScript тип
    data.ts     ← статические данные (массив объектов)
  ui/
    NameCard.tsx
    NameCard.module.scss
  index.ts      ← реэкспорт
```

---

## Структура страниц

```
src/app/
  layout.tsx         ← корневой layout: шрифты (next/font), провайдеры, метаданные
  page.tsx           ← главная страница (сборка виджетов)
  robots.ts          ← динамический robots.txt
  sitemap.ts         ← динамический sitemap.xml
  api/
    contact/
      route.ts       ← POST-обработчик формы → Telegram
  [section]/
    page.tsx         ← дочерняя страница
```

---

## Конвенции кода

- Одинарные кавычки, без точек с запятой (Prettier)
- `type` вместо `interface` для простых типов
- `import type { Foo }` для импортов типов
- **Именованный экспорт** для компонентов (дефолтный — только страницы Next.js)
- SCSS классы в `camelCase` (`.buttonWrapper`, не `.button-wrapper`)
- Без `any` — использовать правильные типы или `unknown`
- Без инлайн-стилей (`style={{}}`) — только SCSS модули

---

## Git-конвенции (Conventional Commits)

```
feat:     новая функциональность
fix:      исправление бага
refactor: рефакторинг без изменения поведения
style:    правки стилей/форматирования
test:     тесты
docs:     документация
chore:    обновление зависимостей, конфиги
```

---

## Команды

```bash
npm run dev          # запуск dev-сервера
npm run build        # production сборка
npm run lint         # ESLint
npm run lint:css     # Stylelint
npm run format       # Prettier
npm run fix          # ESLint + Stylelint + Prettier (всё сразу)
npm run test         # Jest unit-тесты
npm run test:e2e     # Playwright e2e-тесты
```

---

## Как адаптировать под новый проект

1. **Контент** — замени данные в `entities/*/model/data.ts`
2. **Цвет акцента** — измени `$color-accent` в `shared/styles/variables.scss`
3. **Шрифты** — замени импорты `next/font` в `app/layout.tsx` и переменные в `variables.scss`
4. **Секции** — добавь/удали виджеты в `src/widgets/`, подключи в `app/page.tsx`
5. **Форма** — настрой поля в `features/RepairRequest/model/schema.ts` под свою тематику
6. **Telegram** — заполни `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_IDS` в `.env.local`
7. **SEO** — обнови метаданные в `app/layout.tsx` и `shared/config/seo.ts`
