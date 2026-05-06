import type { CSSProperties } from 'react'
import { Hero } from '@/widgets/Hero'
import { WhatYouGet } from '@/widgets/WhatYouGet'
import { HowItWorks } from '@/widgets/HowItWorks'
import { Portfolio } from '@/widgets/Portfolio'
import { Stats } from '@/widgets/Stats'
import { Pricing } from '@/widgets/Pricing'
import { Cta } from '@/widgets/Cta'
import { Container, Icon, ScrollReveal, SectionTitle, SocialLinks, StarField } from '@/shared/ui'
import type { IconName } from '@/shared/ui'
import type { RazrabotkaPageConfig } from '@/entities/ServicePage'
import styles from './RazrabotkaPage.module.scss'
import { MobileSitesCarousel } from './MobileSitesCarousel'
import { MobileFeedbackWidget } from './MobileFeedbackWidget'

type Props = {
  config: RazrabotkaPageConfig
}

const aboutItems = [
  {
    title: 'Не делаем шаблон ради шаблона',
    text: 'Сначала разбираем предложение, рекламу и аудиторию, а потом собираем структуру страницы.',
  },
  {
    title: 'Ведём к заявке',
    text: 'Каждый блок должен отвечать на вопрос клиента и подталкивать к понятному следующему действию.',
  },
  {
    title: 'Убираем визуальный шум',
    text: 'Оставляем сильный первый экран, ясные аргументы, доказательства и форму без лишних шагов.',
  },
  {
    title: 'Готовим к запуску рекламы',
    text: 'Проверяем мобильную версию, скорость, события аналитики и отправку заявок до публикации.',
  },
]

const comparisonIcons: IconName[] = ['target', 'zap', 'layers', 'shield', 'code', 'rocket']

const supportItems: Array<{ icon: IconName; title: string; text: string }> = [
  {
    icon: 'layers',
    title: 'Контент',
    text: 'Правим тексты, добавляем блоки и обновляем офферы под новые гипотезы.',
  },
  {
    icon: 'target',
    title: 'Реклама',
    text: 'Адаптируем страницу под новые кампании, аудитории и посадочные сценарии.',
  },
  {
    icon: 'searchUp',
    title: 'Аналитика',
    text: 'Проверяем события, цели, заявки и точки, где пользователи теряют интерес.',
  },
  {
    icon: 'send',
    title: 'Формы',
    text: 'Дорабатываем отправку заявок в Telegram, CRM или почту.',
  },
]

export function RazrabotkaPage({ config }: Props) {
  const mutedComparison = config.comparison.find((column) => column.muted) ?? config.comparison[0]
  const accentComparison =
    config.comparison.find((column) => !column.muted) ??
    config.comparison[1] ??
    config.comparison[0]

  return (
    <div className={styles.pageCanvas}>
      <Hero
        eyebrow={config.hero.eyebrow}
        headingText={config.hero.headingText}
        gradientSubheading={config.hero.gradientSubheading}
        sub={config.hero.sub}
        ctaPrimary={{ ...config.hero.ctaPrimary, opensForm: true }}
        ctaSecondary={config.hero.ctaSecondary}
        visual={<MobileSitesCarousel />}
      />
      <section className={styles.about} aria-label="О подходе к лендингам">
        <StarField />
        <Container className={styles.aboutInner}>
          <div className={styles.aboutIntro}>
            <SectionTitle eyebrow="Подход">
              Лендинг должен{' '}
              <span className={styles.aboutGradientText}>объяснять оффер и приводить заявку</span>
            </SectionTitle>
            <p>{config.about[1]}</p>
          </div>
          <ol className={styles.aboutList}>
            {aboutItems.map((item, index) => (
              <li key={item.title} className={styles.aboutItem}>
                <span className={styles.aboutNumber}>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <WhatYouGet
        items={config.whatYouGet}
        eyebrow="Преимущества"
        title="Почему наш лендинг  будет лучше чем у ваших конкурентов?"
      />
      <section
        className={styles.benefits}
        aria-labelledby="landing-benefits-title"
        data-feedback-trigger
      >
        <StarField />
        <Container className={styles.sectionContent}>
          <SectionTitle eyebrow="Что вы получите" align="center">
            <span id="landing-benefits-title">Результат после запуска</span>
          </SectionTitle>
          <ul className={styles.benefitsList} role="list">
            {config.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </Container>
      </section>
      <section className={styles.comparison} aria-labelledby="landing-comparison-title">
        <StarField />
        <Container className={styles.sectionContent}>
          <SectionTitle eyebrow="Сравнение" align="center">
            <span id="landing-comparison-title">Конструктор или индивидуальная разработка</span>
          </SectionTitle>
          <ScrollReveal className={styles.comparisonGrid} threshold={0.15}>
            <div className={styles.comparisonColMuted}>
              <div className={styles.comparisonHeader}>{mutedComparison.title}</div>
              {mutedComparison.items.map((item, index) => (
                <div
                  key={item}
                  className={styles.comparisonRow}
                  style={{ '--i': index } as CSSProperties}
                >
                  <span className={styles.comparisonDot} aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className={styles.comparisonDivider} aria-hidden="true">
              <div className={styles.comparisonDividerLine} />
              <div className={styles.comparisonBadge}>VS</div>
              <div className={styles.comparisonDividerLine} />
            </div>

            <div className={styles.comparisonColAccent}>
              <div className={styles.comparisonHeader}>{accentComparison.title}</div>
              {accentComparison.items.map((item, index) => (
                <div
                  key={item}
                  className={styles.comparisonRow}
                  style={{ '--i': index } as CSSProperties}
                >
                  <span>{item}</span>
                  <Icon
                    name={comparisonIcons[index % comparisonIcons.length]}
                    size={22}
                    className={styles.comparisonIcon}
                  />
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>
      <HowItWorks
        eyebrow="Как мы работаем"
        title="От задачи до первых заявок"
        steps={config.steps}
      />
      <Portfolio desktopCarousel />
      <Stats items={config.stats} />
      <Pricing plans={config.pricing} paymentNote={config.paymentNote} />
      <section className={styles.support} aria-labelledby="landing-support-title">
        <StarField />
        <Container className={styles.supportInner}>
          <div className={styles.supportIntro}>
            <SectionTitle eyebrow="Поддержка">
              <span id="landing-support-title">{config.support.title}</span>
            </SectionTitle>
            <div className={styles.supportStatement}>
              <p className={styles.supportMuted}>Никуда ен пропадем после создания сайта</p>
              <p className={styles.supportAccent}>Мы остаёмся рядом после запуска.</p>
            </div>
            <p>{config.support.text}</p>
            <SocialLinks className={styles.supportSocials} />
          </div>
          <div className={styles.supportPanel}>
            {supportItems.map((item) => (
              <article key={item.title} className={styles.supportPanelItem}>
                <span className={styles.supportIcon} aria-hidden="true">
                  <Icon name={item.icon} size={22} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <Cta
        eyebrow={config.cta.eyebrow}
        heading={config.cta.heading}
        sub={config.cta.sub}
        buttonText={config.cta.buttonText}
        modalTitle={config.cta.modalTitle}
      />
      <MobileFeedbackWidget />
    </div>
  )
}
