# SEO Plan — Project 42

**SEO Health Score: 46 / 100**  
**Дата аудита: 2026-04-11**

---

## Скоринг по категориям

| Категория           | Вес | Оценка |
| ------------------- | --- | ------ |
| Техническое SEO     | 25% | 55%    |
| Качество контента   | 25% | 40%    |
| On-Page SEO         | 20% | 65%    |
| Schema / JSON-LD    | 10% | 0%     |
| Производительность  | 10% | 50%    |
| Изображения         | 5%  | 50%    |
| AI Search Readiness | 5%  | 20%    |

---

## Неделя 1 — Критическое

### [x] 1. JSON-LD: FAQPage schema

**Проблема:** В `Faq.tsx` 6 вопросов с ответами — идеальный материал для rich results (аккордеон прямо в SERP), но Schema отсутствует полностью.

**Что сделать:** Добавить `<script type="application/ld+json">` в `src/app/page.tsx` (или внутрь `Faq.tsx`):

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Сколько стоит разработка сайта?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Лендинг — от 9 900 ₽, корпоративный сайт — от 79 900 ₽. Для нестандартных проектов считаем индивидуально."
      }
    }
    // ... остальные вопросы
  ]
}
```

**Файлы:** `src/widgets/Faq/ui/Faq.tsx`, `src/app/page.tsx`

---

### [x] 2. JSON-LD: Organization schema

**Проблема:** Google не знает, кто стоит за сайтом — нет структурированных данных об организации.

**Что сделать:** Добавить в `src/app/layout.tsx` внутри `<head>`:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Project 42",
  "url": "https://project42.studio",
  "description": "Веб-студия полного цикла: дизайн, разработка, SEO, GEO-оптимизация.",
  "founder": { "@type": "Person", "name": "Иван Нарчук" },
  "serviceType": ["Веб-разработка", "UI/UX дизайн", "SEO", "GEO-оптимизация"]
}
```

**Файлы:** `src/app/layout.tsx`

---

### [ ] 3. OG-изображение

**Проблема:** `openGraph` в `layout.tsx` объявлен без `images`. Twitter card `summary_large_image` без картинки — пустой пост при шаринге.

**Что сделать:**

1. Создать `/public/og-image.png` (1200×630 px)
2. Добавить в `layout.tsx`:

```ts
openGraph: {
  images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  // ...остальные поля
}
```

**Файлы:** `src/app/layout.tsx`, `public/og-image.png`

---

### [x] 4. Исправить sitemap

**Проблема:** `src/app/sitemap.ts` содержит только `/` и `/services`. Страница `/portfolio` существует, но краулеры не знают о ней через sitemap. `/services` — пустая страница.

**Что сделать:**

- Добавить `/portfolio`
- Убрать `/services` (пока страница пустая) или закрыть её через `noindex`

```ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/portfolio`,
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
```

**Файлы:** `src/app/sitemap.ts`

---

### [x] 5. Страница /services — закрыть или реализовать

**Проблема:** `src/app/services/page.tsx` возвращает `<main>{/* Services page sections */}</main>` — thin content. Индексируется поисковиками как пустая страница.

**Что сделать (быстрый вариант):** Добавить `noindex` до готовности страницы:

```ts
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}
```

**Долгосрочно:** Реализовать полноценную страницу с описанием каждой услуги, ценами и CTA.

**Файлы:** `src/app/services/page.tsx`

---

## Неделя 2 — Высокое

### [x] 6. Согласовать цены в FAQ и Pricing

**Проблема:** В FAQ написано "лендинг — от 150 000 ₽", в Pricing секции — "от 9 900 ₽". Разница в 15 раз. Пользователь теряет доверие.

**Что сделать:** Привести FAQ ответ в соответствие с реальными ценами в `PricingPlan/model/data.ts`.

**Файлы:** `src/entities/FaqItem/model/faqItems.ts`

---

### [x] 7. Заменить `<img>` на Next.js `<Image>`

**Проблема:** Нативный `<img>` в `Portfolio.tsx` и `PortfolioPage.tsx` лишает сайта:

- автоматической оптимизации WebP/AVIF
- lazy loading
- оптимизации LCP (ключевая метрика Core Web Vitals)
- адаптивного `srcset`

**Что сделать:** Заменить на `import Image from 'next/image'` с указанием `width`/`height`.

**Файлы:** `src/widgets/Portfolio/ui/Portfolio.tsx`, `src/widgets/PortfolioPage/ui/PortfolioPage.tsx`

---

### [x] 8. Исправить `lastModified` в sitemap

**Проблема:** `lastModified: new Date()` сообщает краулерам, что сайт изменился при каждом деплое. Краулеры перестают доверять этому сигналу.

**Что сделать:** Указать статичную дату последнего реального обновления страницы.

**Файлы:** `src/app/sitemap.ts`

---

## Месяц 1 — Среднее

### [x] 9. Исправить опечатки в WhatWeDontDo

**Проблема:** Орфографические ошибки снижают E-E-A-T оценку контента.

**Ошибки:**

- `"навешываем"` → навешиваем
- `"ньансы"` → нюансы
- `"твердно убеждены"` → твёрдо убеждены
- `"срокам.Заранее"` → пропущен пробел
- `"факторы в SEO.Да"` → пропущен пробел

**Файлы:** `src/widgets/WhatWeDontDo/ui/WhatWeDontDo.tsx`

---

### [ ] 10. Контактная информация в footer

**Проблема:** Footer содержит только логотип, навигацию и copyright. Нет города, телефона, email — важно для Яндекса и Google Business Profile.

**Что сделать:** Добавить в footer тег `<address>` с городом, телефоном или ссылкой на Telegram.

**Файлы:** `src/widgets/Footer/ui/Footer.tsx`

---

### [ ] 11. Фото основателя в DirectorMessage

**Проблема:** Аватар — буква "И". E-E-A-T требует реального авторства с фото. Реальное фото основателя повышает доверие и конверсию.

**Что сделать:** Добавить фото в `/public/images/` и использовать `<Image>` вместо div с буквой.

**Файлы:** `src/widgets/DirectorMessage/ui/DirectorMessage.tsx`

---

### [x] 12. Meta description /services не соответствует услугам

**Проблема:** Описание включает "мобильные приложения", но такой услуги нет. Misleading content.

**Что сделать:** Переписать description на основе реальных услуг из `Service/model/data.ts`.

**Файлы:** `src/app/services/page.tsx`

---

### [x] 13. Добавить `id="stats"` в секцию Stats

**Проблема:** `<section className={styles.root}>` без `id` — на секцию нельзя сослаться якорем, не добавить в навигацию.

**Файлы:** `src/widgets/Stats/ui/Stats.tsx`

---

### [x] 14. JSON-LD: Review / AggregateRating для testimonials

**Проблема:** Три реальных отзыва есть, но нет structured data — Google не показывает звёздочки в SERP.

**Что сделать:** Добавить `AggregateRating` в Organization schema и `Review` для каждого отзыва.

**Файлы:** `src/widgets/Testimonials/ui/Testimonials.tsx` или `src/app/page.tsx`

---

## Бэклог — Долгосрочное

### [ ] 15. Создать блог (`/blog`)

**Проблема:** Студия продаёт SEO, но не практикует контент-маркетинг. Блог — основной канал долгосрочного органического трафика.

**Первые темы:**

- Кейс: как Rosa получила заявки через SEO
- Что такое GEO-оптимизация и зачем она нужна в 2025
- Чек-лист: как проверить SEO своего сайта за 15 минут

---

### [x] 16. Создать `/llms.txt`

**Проблема:** Студия предлагает GEO-оптимизацию, но на собственном сайте нет `llms.txt`. Хорошая возможность показать компетентность на практике.

**Что сделать:** Создать `public/llms.txt` по стандарту llmstxt.org с описанием студии, услуг и ссылками на ключевые страницы.

---

### [x] 17. Уточнить ключевые слова в siteConfig

**Проблема:** `"next.js"` в keywords — технический термин, не пользовательский запрос.

**Заменить на:** `"создание сайта под ключ"`, `"веб-студия [город]"`, `"разработка корпоративного сайта"`, `"сайт для бизнеса"`.

**Файлы:** `src/shared/config/seo.ts`

---

### [ ] 18. JSON-LD: WebSite + SearchAction

Позволяет Google отображать поиск по сайту прямо в SERP. Актуально после появления блога.

---

## Прогресс

| Этап                   | Задач  | Сделано |
| ---------------------- | ------ | ------- |
| Неделя 1 (Критическое) | 5      | 4       |
| Неделя 2 (Высокое)     | 3      | 3       |
| Месяц 1 (Среднее)      | 6      | 4       |
| Бэклог                 | 4      | 2       |
| **Итого**              | **18** | **14**  |
