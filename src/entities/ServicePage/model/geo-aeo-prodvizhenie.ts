import type { SeoConfig } from './types'

type GeoAeoCta = {
  label: string
  href: string
}

export type GeoAeoHeroConfig = {
  eyebrow: string
  title: {
    line: string
    accent?: boolean
  }[]
  subtitle: string
  lead: string[]
  ctaPrimary: GeoAeoCta
  ctaSecondary: GeoAeoCta
  platforms: string[]
  visual: {
    primaryLabel: string
    secondaryLabel: string
  }
}

export type GeoAeoShiftConfig = {
  eyebrow: string
  title: {
    line: string
    accent?: boolean
  }[]
  lead: string
  statement: {
    kicker: string
    text: string
    signals: string[]
  }
  cards: {
    marker: string
    title: string
    description: string
  }[]
}

export type GeoAeoProblemConfig = {
  eyebrow: string
  title: {
    line: string
    accent?: boolean
  }[]
  lead: string
  items: {
    marker: string
    title: string
    description: string
    signal: string
  }[]
  summary: {
    label: string
    text: string
  }
}

export type GeoAeoDefinitionConfig = {
  eyebrow: string
  title: {
    line: string
    accent?: boolean
  }[]
  lead: string
  terms: {
    label: string
    name: string
    description: string
    points: string[]
  }[]
  summary: string
}

export type GeoAeoComparisonConfig = {
  eyebrow: string
  title: {
    line: string
    accent?: boolean
  }[]
  lead: string
  layers: {
    code: string
    label: string
    description: string
    points: string[]
  }[]
  summary: {
    label: string
    text: string
    steps: string[]
  }
}

export type GeoAeoScopeConfig = {
  eyebrow: string
  title: {
    line: string
    accent?: boolean
  }[]
  lead: string
  items: {
    marker: string
    title: string
    description: string
  }[]
  summary: {
    label: string
    text: string
    checks: string[]
  }
}

export type GeoAeoWhyConfig = {
  eyebrow: string
  title: {
    line: string
    accent?: boolean
  }[]
  lead: string
  items: {
    marker: string
    title: string
    description: string
  }[]
  summary: {
    label: string
    text: string
  }
}

export type GeoAeoResultConfig = {
  eyebrow: string
  title: {
    line: string
    accent?: boolean
  }[]
  lead: string
  items: string[]
  note: {
    label: string
    text: string
  }
}

export type GeoAeoFinalCtaConfig = {
  eyebrow: string
  title: {
    line: string
    accent?: boolean
  }[]
  text: string
  primary: GeoAeoCta
  secondary: GeoAeoCta
}

export type GeoAeoFaqConfig = {
  eyebrow: string
  title: {
    line: string
    accent?: boolean
  }[]
  lead: string
  items: {
    id: string
    question: string
    answer: string
  }[]
}

export type GeoAeoPageConfig = {
  hero: GeoAeoHeroConfig
  shift: GeoAeoShiftConfig
  problem: GeoAeoProblemConfig
  definition: GeoAeoDefinitionConfig
  comparison: GeoAeoComparisonConfig
  scope: GeoAeoScopeConfig
  why: GeoAeoWhyConfig
  result: GeoAeoResultConfig
  faq: GeoAeoFaqConfig
  cta: GeoAeoFinalCtaConfig
  seo: SeoConfig
}

export const geoAeoConfig: GeoAeoPageConfig = {
  hero: {
    eyebrow: 'GEO / AEO / продвижение в ИИ',
    title: [{ line: 'Продвижение' }, { line: 'сайта в' }, { line: 'нейросетях', accent: true }],
    subtitle:
      'Проверим, как ChatGPT, Алиса, Perplexity и AI-поиск считывают ваш сайт. Усилим страницы, разметку, ответы и внешние источники — без обещаний попасть в каждый ответ.',
    lead: [
      'Клиент уже может начать выбор не с поисковой выдачи, а с вопроса ассистенту: кого взять, кому можно доверить, какие компании сравнить.',
      'Если на сайте нет четких услуг, фактов, кейсов, отзывов и разметки, ИИ берет данные как придется или проходит мимо.',
    ],
    ctaPrimary: { label: 'Проверить сайт', href: '#cta' },
    ctaSecondary: { label: 'Что входит', href: '#scope' },
    platforms: ['ChatGPT', 'Алиса', 'Perplexity', 'Google AI Overviews', 'DeepSeek', 'GigaChat'],
    visual: {
      primaryLabel: 'GEO',
      secondaryLabel: 'AEO',
    },
  },
  shift: {
    eyebrow: 'Почему сейчас',
    title: [{ line: 'Клиент уже' }, { line: 'спрашивает' }, { line: 'ИИ', accent: true }],
    lead: 'Путь стал короче: вопрос ассистенту, сравнение, переход на сайт, заявка. В этом сценарии выигрывает не самый громкий сайт, а тот, о котором есть что сказать.',
    statement: {
      kicker: 'Ориентир',
      text: 'Нужно стать источником, который легко проверить: услуги, регионы, опыт, кейсы, отзывы, карточки и упоминания не спорят друг с другом.',
      signals: ['услуги', 'факты', 'кейсы', 'упоминания'],
    },
    cards: [
      {
        marker: 'Сценарий',
        title: 'Попасть в первый набор вариантов',
        description:
          'Когда ассистент собирает список подрядчиков, он опирается на ясные страницы, отзывы, карточки и внешние источники.',
      },
      {
        marker: 'Содержание',
        title: 'Дать ИИ факты, а не общие слова',
        description:
          'Нейросети не продают ваш дизайн. Они вытаскивают формулировки, условия, кейсы, регионы и доказательства.',
      },
      {
        marker: 'Выбор',
        title: 'Снять сомнения до клика',
        description:
          'Если в ответе уже есть нормальное объяснение, клиент приходит на сайт теплее и быстрее проверяет детали.',
      },
    ],
  },
  problem: {
    eyebrow: 'Проблема',
    title: [
      { line: 'Вас могут' },
      { line: 'не видеть', accent: true },
      { line: 'даже если сайт есть' },
    ],
    lead: 'ИИ‑ассистенту нужны не красивые блоки, а факты, которые можно вытащить в ответ. Если услуги, кейсы, отзывы и карточки живут отдельно, сильный бизнес может не попасть в рекомендацию.',
    items: [
      {
        marker: 'отличие',
        title: 'Сайт есть, но отличие не считывается',
        description:
          'Услуги описаны общими словами. Нет коротких фактов: чем занимаетесь, для кого, где работаете, за что вас выбирают.',
        signal: 'ИИ видит категорию, но не видит причину выбрать вас.',
      },
      {
        marker: 'ответы',
        title: 'Есть страницы, но нет готовых ответов',
        description:
          'Не хватает FAQ, сравнений, условий работы и прямых ответов на вопросы, которые клиент задает перед заявкой.',
        signal: 'Ассистенту приходится собирать ответ из обрывков.',
      },
      {
        marker: 'связи',
        title: 'Отзывы и кейсы не связаны с услугами',
        description:
          'Отзывы, кейсы, карточки компании и страницы сайта рассказывают о бизнесе разными словами.',
        signal: 'Цифровой след выглядит слабее, чем реальная работа.',
      },
      {
        marker: 'конкуренты',
        title: 'Конкуренты могут быть понятнее для ИИ',
        description:
          'Даже если вы сильнее, в ответ может попасть компания, у которой факты, отзывы и упоминания собраны чище.',
        signal: 'ИИ выбирает не лучшего в жизни, а понятного в источниках.',
      },
    ],
    summary: {
      label: 'Главный риск',
      text: 'Отзывы, кейсы и страницы услуг должны подтверждать одну версию компании. Тогда ассистенту есть что взять в ответ и чем это проверить.',
    },
  },
  definition: {
    eyebrow: 'Что такое GEO и AEO',
    title: [{ line: 'GEO / AEO' }, { line: 'это не про магию', accent: true }],
    lead: 'GEO отвечает за то, видят ли вас как источник. AEO — может ли ваш текст стать готовым ответом. Вместе это делает сайт удобным для людей, поиска и ИИ.',
    terms: [
      {
        label: 'GEO',
        name: 'Generative Engine Optimization',
        description:
          'Собирает вокруг компании факты: услуги, регионы, кейсы, отзывы, карточки и внешние упоминания. Так генеративному поиску проще понять, кто вы.',
        points: ['услуги и регионы', 'кейсы и отзывы', 'внешние источники'],
      },
      {
        label: 'AEO',
        name: 'Answer Engine Optimization',
        description:
          'Превращает страницы в ответы: короткие формулировки, FAQ, сравнения, условия и факты, которые можно использовать в рекомендации.',
        points: ['FAQ', 'сравнения', 'условия работы'],
      },
    ],
    summary:
      'Сайт должен быть не витриной, а досье на компанию: что делаете, где работаете, чем подтверждаете опыт.',
  },
  comparison: {
    eyebrow: 'SEO / GEO / AEO',
    title: [{ line: 'Три слоя' }, { line: 'одной системы', accent: true }],
    lead: 'SEO чинит базу. GEO добавляет источники и связи. AEO делает контент удобным для ответа.',
    layers: [
      {
        code: 'SEO',
        label: 'База в поиске',
        description: 'Техника, страницы, ключевые запросы, скорость, индексация и ссылки.',
        points: ['техника', 'страницы', 'ключи', 'индексация'],
      },
      {
        code: 'GEO',
        label: 'Видимость бренда',
        description:
          'Услуги, бренд, регионы, отзывы и упоминания складываются в источник для AI-поиска.',
        points: ['бренд', 'упоминания', 'карточки', 'отзывы'],
      },
      {
        code: 'AEO',
        label: 'Формат ответа',
        description:
          'FAQ, короткие ответы, таблицы, инструкции и сравнения дают ассистенту готовый материал.',
        points: ['FAQ', 'ответы', 'сравнения', 'инструкции'],
      },
    ],
    summary: {
      label: 'Как это работает вместе',
      text: 'Без SEO сайт может плохо индексироваться. Без GEO о компании мало внешних подтверждений. Без AEO ассистенту приходится собирать ответ из разрозненных кусков.',
      steps: ['индексация', 'источники', 'ответы'],
    },
  },
  scope: {
    eyebrow: 'Что входит в работу',
    title: [{ line: 'Что мы' }, { line: 'делаем', accent: true }],
    lead: 'Приводим в порядок то, из чего ИИ собирает ответ: страницы, факты, разметку и внешние подтверждения.',
    items: [
      {
        marker: 'диагностика',
        title: 'AI-аудит сайта',
        description: 'Проверяем, что ChatGPT, Алиса, Perplexity и AI-поиск видят по сайту.',
      },
      {
        marker: 'запросы',
        title: 'Запросы и промпты',
        description: 'Собираем вопросы, с которых клиент начинает выбор подрядчика.',
      },
      {
        marker: 'страницы',
        title: 'Структура страниц',
        description:
          'Раскладываем услуги, регионы, кейсы и условия так, чтобы их можно было цитировать.',
      },
      {
        marker: 'ответы',
        title: 'Ответы и FAQ',
        description: 'Пишем короткие ответы, сравнения, таблицы и блоки без воды.',
      },
      {
        marker: 'техника',
        title: 'Schema.org и индексация',
        description: 'Настраиваем разметку, индексацию, sitemap, robots.txt и llms.txt.',
      },
      {
        marker: 'бренд',
        title: 'Описание компании',
        description: 'Фиксируем одну версию: кто вы, что делаете, где работаете и чем сильны.',
      },
      {
        marker: 'след',
        title: 'Карточки и упоминания',
        description:
          'Сверяем каталоги, отзывы, статьи, соцсети и медиа с тем, что написано на сайте.',
      },
      {
        marker: 'контроль',
        title: 'Мониторинг ответов',
        description:
          'Смотрим, меняются ли ответы ИИ по выбранным запросам и что нужно усилить дальше.',
      },
    ],
    summary: {
      label: 'Проверяемая работа',
      text: 'На выходе — страницы, разметка, FAQ, запросы и список внешних источников для контроля.',
      checks: ['аудит', 'структура', 'контент', 'техника', 'мониторинг'],
    },
  },
  why: {
    eyebrow: 'Почему Project 42',
    title: [
      { line: 'Разработка' },
      { line: 'SEO и GEO', accent: true },
      { line: 'в одной логике' },
    ],
    lead: 'GEO/AEO нельзя делать отдельно от кода, SEO и реального пути клиента. Мы видим страницу не как красивый макет, а как источник данных.',
    items: [
      {
        marker: 'код',
        title: 'Работаем с кодом',
        description: 'Можем менять структуру, шаблоны, скорость, разметку и индексацию сайта.',
      },
      {
        marker: 'SEO',
        title: 'Не отрываем GEO от SEO',
        description:
          'Сначала приводим в порядок базу поиска, потом усиливаем видимость в нейросетях.',
      },
      {
        marker: 'честность',
        title: 'Не продаем гарантию ChatGPT',
        description:
          'Показываем, что можно проверить, где слабые места и какие источники нужно подтянуть.',
      },
      {
        marker: 'бизнес',
        title: 'Смотрим глазами клиента',
        description: 'Важно не просто попасть в ответ, а снять сомнения перед заявкой.',
      },
      {
        marker: 'под ключ',
        title: 'Собираем связку',
        description:
          'Сайт, контент, разметка, карточки, отзывы и мониторинг не живут отдельными задачами.',
      },
    ],
    summary: {
      label: 'Подход',
      text: 'Нужно, чтобы о компании было что сказать и чем это подтвердить.',
    },
  },
  result: {
    eyebrow: 'Что будет в результате',
    title: [{ line: 'Сайт станет' }, { line: 'понятным источником', accent: true }],
    lead: 'На выходе — страницы, разметка и источники, которые не спорят друг с другом.',
    items: [
      'Структура услуг, фактов и доказательств.',
      'FAQ, сравнения и короткие ответы.',
      'Schema.org, индексация, sitemap, robots.txt, llms.txt.',
      'Запросы и промпты для мониторинга AI-ответов.',
    ],
    note: {
      label: 'Без магических обещаний',
      text: 'Не взламываем ChatGPT. Усиливаем сайт и источники, которые ИИ может проверить.',
    },
  },
  faq: {
    eyebrow: 'FAQ',
    title: [{ line: 'FAQ' }, { line: 'без воды', accent: true }],
    lead: 'Без обещаний про кнопку “попасть в ChatGPT”. Только то, что можно проверить на сайте, в источниках и в ответах ИИ.',
    items: [
      {
        id: 'geo-plain',
        question: 'Что такое GEO-продвижение простыми словами?',
        answer:
          'GEO-продвижение помогает генеративному поиску понять компанию: услуги, регионы, опыт, кейсы, отзывы и внешние упоминания. Задача — чтобы ассистент видел не пустую витрину, а подтвержденные факты.',
      },
      {
        id: 'aeo-plain',
        question: 'Что такое AEO?',
        answer:
          'AEO-оптимизация готовит страницы к формату ответа: FAQ, короткие формулировки, сравнения, условия работы и инструкции. Это нужно, когда пользователь ждет не список ссылок, а готовое объяснение.',
      },
      {
        id: 'geo-aeo-vs-seo',
        question: 'Чем GEO/AEO отличается от SEO?',
        answer:
          'SEO отвечает за поисковую базу: индексацию, страницы, ключевые запросы и ссылки. GEO работает с видимостью компании в AI-поиске. AEO делает контент удобным для ответа. Эти вещи не заменяют друг друга.',
      },
      {
        id: 'chatgpt-guarantee',
        question: 'Можно ли гарантировать попадание в ChatGPT?',
        answer:
          'Нет. Никто честно не гарантирует попадание в каждый ответ ChatGPT, Алисы или Perplexity. Можно усилить факты, разметку, отзывы, карточки и внешние источники — то есть то, на что ИИ может опереться.',
      },
      {
        id: 'socials-for-geo',
        question: 'Нужны ли соцсети для GEO?',
        answer:
          'Соцсети не главная цель GEO, но они могут быть частью цифрового следа. Если Telegram, VK, YouTube, карточки компании и отзывы подтверждают сайт, ассистенту проще собрать цельную картину.',
      },
      {
        id: 'geo-aeo-timing',
        question: 'Сколько времени нужно на GEO/AEO?',
        answer:
          'Первый аудит можно сделать быстро: посмотреть сайт, AI-ответы и конкурентов. На правки по структуре, контенту, Schema.org и внешним источникам обычно нужен отдельный этап. Срок зависит от объема сайта.',
      },
      {
        id: 'audit-start',
        question: 'Можно начать только с аудита?',
        answer:
          'Да. Можно начать с AI-аудита сайта: проверим, как нейросети считывают бизнес, где теряются факты и какие правки дадут самый быстрый эффект.',
      },
    ],
  },
  cta: {
    eyebrow: 'Проверим сайт?',
    title: [{ line: 'Покажем' }, { line: 'где ИИ' }, { line: 'теряет смысл', accent: true }],
    text: 'Пришлите ссылку. Посмотрим, что ИИ видит на сайте, каких фактов не хватает и где бизнес выглядит слабее, чем есть на самом деле.',
    primary: {
      label: 'Проверить сайт',
      href: 'https://wa.me/79998589878',
    },
    secondary: {
      label: 'Написать в Telegram',
      href: 'https://t.me/ivann97n',
    },
  },
  seo: {
    title: 'GEO/AEO-продвижение сайта в нейросетях — Project 42',
    description:
      'Проверим, как ИИ-системы считывают сайт, и усилим страницы, ответы, Schema.org, внешние источники и мониторинг без обещаний попасть в каждый ответ.',
  },
}
