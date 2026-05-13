import { Hero } from '@/widgets/Hero'
import { HowItWorks } from '@/widgets/HowItWorks'
import { Stats } from '@/widgets/Stats'
import { Pricing } from '@/widgets/Pricing'
import { DirectorMessage } from '@/widgets/DirectorMessage'
import { Cta } from '@/widgets/Cta'
import type { RazrabotkaPageConfig } from '@/entities/ServicePage'
import styles from './RazrabotkaPage.module.scss'
import { AboutSection } from './AboutSection'
import { BenefitsSection } from './BenefitsSection'
import { ComparisonSection } from './ComparisonSection'
import { MobileSitesCarousel } from './MobileSitesCarousel'
import { PainSolutionsCarousel } from './PainSolutionsCarousel'
import { SupportSection } from './SupportSection'

type Props = {
  config: RazrabotkaPageConfig
}

const founderLandingMessage = [
  'Привет, это Иван - основатель Project 42.',
  'Чаще всего к нам приходят организации, у которых сайт уже есть, но он не помогает продавать: первый экран не объясняет ценность, страницы не вызывают доверия, мобильная версия тормозит, а заявки с рекламы стоят всё дороже.',
  'Мы не начинаем с украшений. Сначала разбираем продукт, аудиторию, возражения и путь клиента, а потом собираем сайт как рабочий бизнес-инструмент: понятный оффер, сильные доказательства, быстрые страницы, формы заявок, аналитика, SEO и подготовка к выдаче в AI-системах.',
  'Моя задача - вывести сайт организации на уровень, где он не просто выглядит современно, а поддерживает продажи, усиливает репутацию и не ограничивает развитие компании после запуска.',
  'За результат отвечаю лично: помогаю принять верные решения по структуре, смыслу и запуску, чтобы сайт стал активом, а не очередной страницей в интернете.',
]

export function RazrabotkaPage({ config }: Props) {
  return (
    <div className={styles.pageCanvas}>
      <Hero
        eyebrow={config.hero.eyebrow}
        headingText={config.hero.headingText}
        gradientSubheading={config.hero.gradientSubheading}
        gradientSubheadingSecondary={config.hero.gradientSubheadingSecondary}
        sub={config.hero.sub}
        ctaPrimary={{ ...config.hero.ctaPrimary, opensForm: true }}
        ctaSecondary={config.hero.ctaSecondary}
        visual={<MobileSitesCarousel />}
      />
      <AboutSection aboutText={config.about[1]} />
      <BenefitsSection benefits={config.benefits} />
      <ComparisonSection comparison={config.comparison} />
      <PainSolutionsCarousel />
      <Stats items={config.stats} />
      <DirectorMessage
        id="founder-message"
        paragraphs={founderLandingMessage}
        authorRole="Основатель Project 42"
        imagePriority={false}
      />
      <HowItWorks
        eyebrow="Как мы работаем"
        title="От задачи до первых заявок"
        steps={config.steps}
        floatingBlobs
      />
      <Pricing plans={config.pricing} paymentNote={config.paymentNote} />
      <SupportSection support={config.support} />
      <Cta
        eyebrow={config.cta.eyebrow}
        heading={config.cta.heading}
        sub={config.cta.sub}
        buttonText={config.cta.buttonText}
        modalTitle={config.cta.modalTitle}
      />
    </div>
  )
}
