# Project 42 Design System

Референсы лежат в папке `new-design`. Главный референс:

```text
new-design/ChatGPT Image 15 июн. 2026 г., 10_41_35.png
```

Новая дизайн-система начинается со страницы `/razrabotka-sayta`. Разработку ведем mobile-first, делим интерфейс на логически цельные компоненты и не тащим старую визуальную систему в новый слой.

## Принципы Разработки

- Mobile-first: сначала мобильная композиция, затем tablet/desktop через существующие mixins.
- Static deploy friendly: без runtime-зависимостей от сервера, без тяжелых WebGL/particles/parallax, без клиентской логики там, где достаточно server components.
- SEO и GEO friendly: сохраняем семантические теги, понятную иерархию заголовков, текстовый контент в HTML, schema/metadata на route-уровне.
- KISS/YAGNI: не создаем абстракцию, пока компонент не повторился или явно не нужен повторно.
- Компоненты режем по смыслу: `Hero`, `Stats`, `Process`, `Projects`, `Services`, `Cta`, но кнопки, контейнеры, heading primitives и карточки выносим отдельно.
- SCSS-переменные используем максимально; новые стили не пишем на raw hex, если уже есть semantic token.

## Общая Концепция

Сайт должен выглядеть как современная цифровая студия, а не как типовой корпоративный сайт или SaaS-платформа.

Визуальный язык:

- Editorial Design
- Brutalist Typography
- Poster Layout
- Isometric Illustrations
- High Contrast UI

Главная идея: очень крупная типографика, асимметричная журнальная верстка и технические изометрические иллюстрации. Сайт должен ощущаться как дорогой цифровой продукт с сильной дизайнерской экспертизой.

Запрещено:

- стекломорфизм;
- сильные градиенты;
- неоморфизм;
- сложные свечения;
- футуристические AI-абстракции;
- типовые 3D-шары;
- фотографии программистов за ноутбуком;
- тяжелые анимации и WebGL ради декора.

## Где Лежат Переменные

Основной файл:

```scss
src/shared/styles/variables.scss
```

Подключение:

```scss
@use '@/shared/styles/variables' as *;
```

Если нужны mixins:

```scss
@use '@/shared/styles/mixins' as *;
```

## Архитектура Токенов

Слои:

1. Palette tokens - сырые цвета палитры.
2. Semantic tokens - значения по смыслу: фон, текст, action, border, cards.
3. Component styles - конкретные стили кнопок, карточек, форм и секций.

В компонентах используем semantic tokens. Palette tokens допускаются только при создании новых semantic tokens или редких декоративных деталей.

## Цветовая Система

Базовые значения из референса:

```scss
$surface-page: #050505;
$text-primary: #f5f5f5;
$text-secondary: rgba(245 245 245 / 70%);
$action-primary: #d4a635;
$accent-mint: #b8f0d4;
$accent-orange: #f19a63;
$accent-blue-gray: #b9c7d6;
$surface-card-light: #f3f3f1;
$surface-card-dark: #0e0e0e;
$border-default: rgba(255 255 255 / 12%);
```

Нейтральная шкала:

```scss
$neutral-0
$neutral-50
$neutral-100
$neutral-150
$neutral-200
$neutral-300
$neutral-400
$neutral-500
$neutral-600
$neutral-700
$neutral-800
$neutral-900
```

Назначение:

- `$neutral-0` - чистый черный холст.
- `$neutral-50` - основной фон сайта `#050505`.
- `$neutral-100` - темная карточка `#0E0E0E`.
- `$neutral-600` - дополнительный текст `rgba(245 245 245 / 70%)`.
- `$neutral-800` - светлая карточка `#F3F3F1`.
- `$neutral-900` - основной текст `#F5F5F5`.

Акценты:

```scss
$accent-yellow
$accent-yellow-hover
$accent-yellow-pressed
$accent-mint
$accent-orange
$accent-blue-gray
$accent-red
```

Назначение:

- `$accent-yellow` - главный CTA и ключевые смысловые акценты.
- `$accent-mint` - пастельные карточки, позитивные маркеры, иллюстрации.
- `$accent-orange` - пастельные карточки, вторичный теплый акцент.
- `$accent-blue-gray` - холодные технические карточки и UI-иллюстрации.
- `$accent-red` - ошибки.

## Semantic Tokens

Поверхности:

```scss
$surface-canvas
$surface-page
$surface-section
$surface-card-dark
$surface-card-light
$surface-card-mint
$surface-card-orange
$surface-card-yellow
$surface-card-blue
$surface-panel
$surface-panel-raised
$surface-inverse
$surface-scrim
```

Текст:

```scss
$text-primary
$text-secondary
$text-muted
$text-subtle
$text-inverse
$text-accent
$text-outline-stroke
```

Actions:

```scss
$action-primary
$action-primary-hover
$action-primary-pressed
$action-secondary
$action-secondary-hover
$action-danger
$action-warning
$action-success
```

Borders and focus:

```scss
$border-subtle
$border-default
$border-strong
$border-accent
$focus-ring
```

Правила:

- Главная кнопка всегда желтая: `$action-primary`.
- Secondary button прозрачная, с `$border-default` или `$border-strong`.
- Акцентные карточки берут фон из `$surface-card-*`.
- Границы тонкие, без декоративных glow.

## Типографика

Типографика - главный визуальный элемент.

Display-шрифт:

- Bebas Neue;
- Anton;
- Archivo Black.

Body-шрифт:

- Inter;
- Manrope.

В проекте токены уже готовы:

```scss
$font-display
$font-body
```

Если в проекте еще нет нужного display font asset, временно используем текущий `var(--font-display)`, но новые компоненты пишем так, чтобы заменить font-face без переписывания CSS.

Размеры:

```scss
$font-size-hero: clamp(76px, 16vw, 220px);
$font-size-section-heading: clamp(56px, 8vw, 96px);
$font-size-card-number: clamp(48px, 6vw, 72px);
$font-size-base: 16px;
$font-size-lg: 18px;
$font-size-sm: 14px;
```

Line-height:

```scss
$line-height-tight
$line-height-heading
$line-height-body
$line-height-ui
```

Заголовочные типы:

```scss
// Filled Heading
color: $text-primary;

// Outline Heading
color: transparent;
-webkit-text-stroke: $outline-heading-stroke;

// Accent Heading
color: $text-accent;
```

Правила:

- Outline heading используем только для одного ключевого слова в блоке.
- Контурный текст не должен составлять больше 30% заголовков на странице.
- Hero-scale типографика только для настоящего hero или poster-блоков.
- Letter spacing по умолчанию не уводим в отрицательные значения.

## Сетка И Layout

```scss
$container-max: 1440px;
$container-inner: 1280px;
$container-readable: 760px;
$container-narrow: 1040px;
$container-pad-desktop: 80px;
$container-pad-tablet: 48px;
$container-pad-mobile: 24px;
```

Breakpoints:

```scss
$bp-mobile
$bp-tablet
$bp-desktop
$bp-wide
```

Композиция:

- Не делаем полностью симметричные блоки.
- Каждая секция должна напоминать журнальный разворот.
- Каждая секция визуально отличается от предыдущей.
- На mobile композиция должна оставаться цельной, без потери смысла и без горизонтального скролла.

Примеры композиции:

- крупный заголовок сверху, иллюстрация ниже, карточки асимметричной сеткой;
- крупный заголовок слева, иллюстрация справа, карточки ниже;
- номер секции крупным outline, контентная колонка рядом;
- poster CTA с одним огромным словом и короткой формой/кнопкой.

## Spacing

```scss
$space-0
$space-1
$space-2
$space-3
$space-4
$space-5
$space-6
$space-8
$space-10
$space-12
$space-16
$space-20
$space-24
$space-32
```

Шкала кратна 4px. В новых компонентах используем `$space-*`, а не случайные значения.

## Карточки

Карточки - второй главный элемент после типографики.

Токены:

```scss
$radius-lg: 20px;
$surface-card-light
$surface-card-dark
$surface-card-mint
$surface-card-orange
$surface-card-yellow
$surface-card-blue
$border-default
$shadow-none
```

Правила:

- `border-radius: $radius-lg`.
- Без теней.
- Только тонкие границы или контрастный фон.
- Допустимые фоны: мятный, оранжевый, желтый, светлый, темный, серо-голубой.
- Карточки могут иметь разную ширину и высоту.
- Не строим все карточки одной равномерной сеткой.

## Кнопки

Primary:

```scss
height: 56px;
color: $text-inverse;
background: $action-primary;
border-radius: $radius-md;
```

Secondary:

```scss
height: 56px;
color: $text-primary;
background: transparent;
border: 1px solid $border-default;
border-radius: $radius-md;
```

Hover:

```scss
transform: translateY(-2px);
```

Правила:

- Без сложных эффектов.
- В кнопках используем понятные labels и, где уместно, arrow icon.
- Кнопки и интерактивные элементы должны иметь видимый focus.

## Иллюстрации

Стиль:

- Isometric Technical Objects;
- толстый контур;
- минимум деталей;
- пастельные цвета;
- ощущение конструктора;
- сочетание 2D и изометрии.

Объекты:

- интерфейсы сайтов;
- мобильные приложения;
- CRM;
- панели аналитики;
- папки;
- коробки;
- карточки UI;
- графики;
- виджеты.

Hero illustration:

- большая коробка или контейнер;
- из него появляются интерфейсы, мобильное приложение, графики, элементы дизайна;
- прозрачный фон;
- без фоновой плашки внутри изображения.

## Анимации

Разрешено:

- плавное появление;
- небольшое смещение;
- hover карточек;
- hover кнопок.

Запрещено:

- parallax на весь экран;
- сильные вращения;
- blur-анимации;
- частицы;
- тяжелые WebGL эффекты.

Motion tokens:

```scss
$ease-standard
$ease-emphasized
$duration-fast
$duration-base
$duration-slow
$transition-base
$transition-slow
```

## Legacy Aliases

В `variables.scss` сохранены старые имена:

```scss
$color-bg
$color-card
$color-text
$color-accent
$color-border
$spacing-md
```

Они нужны, чтобы текущие страницы не сломались во время миграции. Новый код пишем на новых токенах:

```scss
$surface-page
$surface-card-dark
$text-primary
$action-primary
$border-default
$space-4
```

## Пример Нового Компонента

```scss
.card {
  padding: $space-6;
  color: $text-inverse;
  background: $surface-card-yellow;
  border: 1px solid transparent;
  border-radius: $radius-lg;
  box-shadow: $shadow-none;
}

.cardNumber {
  font-family: $font-display;
  font-size: $font-size-card-number;
  font-weight: $font-weight-display;
  line-height: $line-height-tight;
}

.cardText {
  max-width: 32ch;
  font-size: $font-size-base;
  line-height: $line-height-body;
}
```

## Миграционный План

1. `/razrabotka-sayta` собираем только на новых токенах.
2. Сначала делаем primitives: `Container`, `Button`, `Heading`, `Card`, form fields.
3. Затем собираем логические секции.
4. Компонент переносим в `shared/ui`, когда он нужен второй раз или явно является primitive.
5. Старые страницы не переписываем массово, пока новая система не проверена на странице разработки.
6. После стабилизации постепенно заменяем legacy aliases в старых SCSS-модулях.
