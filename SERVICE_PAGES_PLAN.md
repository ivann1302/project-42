# Service Landing Pages — Plan

Detailed plans: `docs/superpowers/plans/`

---

## Phase 0 — Foundation

> Adapt existing widgets to accept props. Must be done first.

- [x] `ServicePage` entity types (`src/entities/ServicePage/`)
- [x] `Hero` — optional text props
- [x] `HowItWorks` — optional `steps` prop
- [x] `Stats` — optional `items` prop
- [x] `Testimonials` — optional `items` prop
- [x] `Faq` — optional `items` prop
- [x] `Pricing` — optional `plans` / `paymentNote` props
- [x] `Cta` — optional text props

---

## Phase 1 — /razrabotka-sayta

- [ ] Config: `src/entities/ServicePage/model/razrabotka-sayta.ts`
- [ ] Widget: `WhatYouGet`
- [ ] Widget: `TypesOfSites`
- [ ] Widget: `RazrabotkaPage` (composition)
- [ ] Route: `src/app/razrabotka-sayta/page.tsx`

---

## Phase 2 — /seo-prodvizhenie

- [ ] Config: `src/entities/ServicePage/model/seo-prodvizhenie.ts`
- [ ] Widget: `WhyNow`
- [ ] Widget: `WhatIncludes` ← reused in Phase 3
- [ ] Widget: `Cases`
- [ ] Widget: `SeoPage` (composition)
- [ ] Route: `src/app/seo-prodvizhenie/page.tsx`

---

## Phase 3 — /tehpodderzhka

- [ ] Config: `src/entities/ServicePage/model/tehpodderzhka.ts`
- [ ] Widget: `Problems`
- [ ] Widget: `SLA`
- [ ] Widget: `TehpodderzhkaPage` (composition)
- [ ] Route: `src/app/tehpodderzhka/page.tsx`

---

## Future — Niche & City Pages

Pattern: `src/app/razrabotka-sayta-stroitelstvo/page.tsx`

```ts
const config = { ...razrabotkaConfig, hero: { ...razrabotkaConfig.hero, headingText: '...' } }
```

- [ ] `/razrabotka-sayta-[niche]`
- [ ] `/seo-prodvizhenie-[niche]`
- [ ] `/tehpodderzhka-[niche]`
- [ ] City pages (`-moskva`, `-novosibirsk`, etc.)
