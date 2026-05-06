import { Hero } from '@/widgets/Hero'
import { HowItWorks } from '@/widgets/HowItWorks'
import { Stats } from '@/widgets/Stats'
import { Pricing } from '@/widgets/Pricing'
import { Testimonials } from '@/widgets/Testimonials'
import { Faq } from '@/widgets/Faq'
import { Cta } from '@/widgets/Cta'
import { WhyNow } from '@/widgets/WhyNow'
import { WhatIncludes } from '@/widgets/WhatIncludes'
import { Cases } from '@/widgets/Cases'
import type { SeoPageConfig } from '@/entities/ServicePage'
import styles from './SeoPage.module.scss'

type Props = {
  config: SeoPageConfig
}

export function SeoPage({ config }: Props) {
  return (
    <div className={styles.wrapper}>
      <Hero
        eyebrow={config.hero.eyebrow}
        headingText={config.hero.headingText}
        sub={config.hero.sub}
        ctaPrimary={config.hero.ctaPrimary}
        ctaSecondary={config.hero.ctaSecondary}
      />
      <WhyNow
        eyebrow={config.whyNow.eyebrow}
        title={config.whyNow.title}
        sub={config.whyNow.sub}
        items={config.whyNow.items}
      />
      <WhatIncludes
        eyebrow={config.whatIncludes.eyebrow}
        title={config.whatIncludes.title}
        columns={config.whatIncludes.columns}
      />
      <HowItWorks eyebrow="Как мы работаем" title="Процесс продвижения" steps={config.steps} />
      <Cases items={config.cases} />
      <Stats items={config.stats} />
      <Pricing
        plans={config.pricing}
        paymentNote={config.paymentNote}
        eyebrow="Тарифы"
        title="Выберите пакет"
      />
      <Testimonials eyebrow="Клиенты о продвижении" title="Отзывы" />
      <Faq items={config.faqItems} title="Вопросы о SEO и GEO" />
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
