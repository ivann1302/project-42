'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import type {
  GeoAeoComparisonConfig,
  GeoAeoDefinitionConfig,
  GeoAeoFaqConfig,
  GeoAeoFinalCtaConfig,
  GeoAeoHeroConfig,
  GeoAeoPageConfig,
  GeoAeoProblemConfig,
  GeoAeoResultConfig,
  GeoAeoScopeConfig,
  GeoAeoShiftConfig,
  GeoAeoWhyConfig,
} from '@/entities/ServicePage'
import { useScrollReveal } from '@/shared/lib'
import {
  RazrabotkaBlogCarouselSection,
  RazrabotkaFooter,
  RazrabotkaHeader,
} from '@/widgets/RazrabotkaPage'
import { StudioButton } from '@/shared/ui'
import styles from './GeoAeoPage.module.scss'

const MOBILE_HERO_INTRO_QUERY = '(max-width: 767px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const sphereLetters = [
  { letter: 'g', position: 0 },
  { letter: 'e', position: 0.052 },
  { letter: 'o', position: 0.104 },
  { letter: 's', position: 0.333 },
  { letter: 'e', position: 0.385 },
  { letter: 'o', position: 0.437 },
  { letter: 'a', position: 0.666 },
  { letter: 'e', position: 0.718 },
  { letter: 'o', position: 0.77 },
] as const
const sphereMaxShiftX = 16
const sphereMaxShiftY = 12
const sphereMaxTilt = 8

const pageNavLinks = [
  { label: 'GEO/AEO', href: '#top' },
  { label: 'Почему сейчас', href: '#shift' },
  { label: 'Проблема', href: '#problem' },
  { label: 'Что входит', href: '#scope' },
  { label: 'Почему P42', href: '#why' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Контакты', href: '#cta' },
] as const

const footerNavLinks = [
  { label: 'Что такое GEO/AEO', href: '#definition' },
  { label: 'Что входит', href: '#scope' },
  { label: 'Результат', href: '#result' },
  { label: 'FAQ', href: '#faq' },
  { label: 'К заявке', href: '#cta' },
] as const

function handleVisualPointerMove(event: PointerEvent<HTMLDivElement>) {
  const bounds = event.currentTarget.getBoundingClientRect()

  if (!bounds.width || !bounds.height) return

  const clientX = Number.isFinite(event.clientX) ? event.clientX : bounds.left + bounds.width / 2
  const clientY = Number.isFinite(event.clientY) ? event.clientY : bounds.top + bounds.height / 2
  const x = ((clientX - bounds.left) / bounds.width - 0.5) * 2
  const y = ((clientY - bounds.top) / bounds.height - 0.5) * 2

  event.currentTarget.style.setProperty('--sphere-shift-x', `${(x * sphereMaxShiftX).toFixed(2)}px`)
  event.currentTarget.style.setProperty('--sphere-shift-y', `${(y * sphereMaxShiftY).toFixed(2)}px`)
  event.currentTarget.style.setProperty('--sphere-tilt-x', `${(-y * sphereMaxTilt).toFixed(2)}deg`)
  event.currentTarget.style.setProperty('--sphere-tilt-y', `${(x * sphereMaxTilt).toFixed(2)}deg`)
}

function handleVisualPointerLeave(event: PointerEvent<HTMLDivElement>) {
  event.currentTarget.style.setProperty('--sphere-shift-x', '0px')
  event.currentTarget.style.setProperty('--sphere-shift-y', '0px')
  event.currentTarget.style.setProperty('--sphere-tilt-x', '0deg')
  event.currentTarget.style.setProperty('--sphere-tilt-y', '0deg')
}

type HeroProps = {
  hero: GeoAeoHeroConfig
}

function GeoAeoHero({ hero }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current

    if (!section || !window.matchMedia) return

    const mobileQuery = window.matchMedia(MOBILE_HERO_INTRO_QUERY)
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    let frameId = 0

    const setProgress = (progress: number) => {
      const normalizedProgress = Math.min(Math.max(progress, 0), 1)
      const globeOpacity = Math.max(1 - normalizedProgress * 1.18, 0)
      const contentOpacity = Math.min(Math.max((normalizedProgress - 0.38) * 2.2, 0), 1)
      const contentOffset = (1 - contentOpacity) * 28
      const globeScale = 1 + normalizedProgress * 0.72

      section.style.setProperty('--mobile-hero-progress', normalizedProgress.toFixed(3))
      section.style.setProperty('--mobile-globe-opacity', globeOpacity.toFixed(3))
      section.style.setProperty('--mobile-content-opacity', contentOpacity.toFixed(3))
      section.style.setProperty('--mobile-content-offset', `${contentOffset.toFixed(2)}px`)
      section.style.setProperty('--mobile-globe-scale', globeScale.toFixed(3))
      section.style.setProperty(
        '--mobile-content-pointer-events',
        normalizedProgress > 0.82 ? 'auto' : 'none',
      )
    }

    const updateIntroProgress = () => {
      frameId = 0

      if (!mobileQuery.matches || reducedMotionQuery.matches) {
        setProgress(1)
        return
      }

      const scrollRange = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(-section.getBoundingClientRect().top / scrollRange, 0), 1)

      setProgress(progress)
    }

    const scheduleUpdate = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateIntroProgress)
    }

    updateIntroProgress()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    mobileQuery.addEventListener('change', scheduleUpdate)
    reducedMotionQuery.addEventListener('change', scheduleUpdate)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      mobileQuery.removeEventListener('change', scheduleUpdate)
      reducedMotionQuery.removeEventListener('change', scheduleUpdate)
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.hero} id="top" aria-labelledby="geo-aeo-hero-title">
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{hero.eyebrow}</p>
          <h1 className={styles.heroTitle} id="geo-aeo-hero-title">
            {hero.title.map((line) => (
              <span className={line.accent ? styles.heroTitleAccent : undefined} key={line.line}>
                {line.line}
              </span>
            ))}
          </h1>
          <p className={styles.heroSubtitle}>{hero.subtitle}</p>
          <div className={styles.heroLead}>
            {hero.lead.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className={styles.heroActions} aria-label="Основные действия">
            <StudioButton
              className={styles.primaryButton}
              href={hero.ctaPrimary.href}
              variant="mint"
            >
              {hero.ctaPrimary.label}
            </StudioButton>
            <StudioButton
              className={styles.secondaryButton}
              href={hero.ctaSecondary.href}
              variant="peach"
            >
              {hero.ctaSecondary.label}
            </StudioButton>
          </div>
          <ul className={styles.platformList} aria-label="AI-системы и поисковые интерфейсы">
            {hero.platforms.map((platform) => (
              <li key={platform}>{platform}</li>
            ))}
          </ul>
        </div>

        <div
          className={styles.heroVisual}
          role="img"
          aria-label="Интерактивная схема GEO, SEO и AEO-сигналов для нейросетей"
          onPointerMove={handleVisualPointerMove}
          onPointerLeave={handleVisualPointerLeave}
          data-cursor-interactive
          data-testid="geo-aeo-hero-visual"
        >
          <div className={styles.sphereStage}>
            <div className={styles.sphereOrbit} aria-hidden="true">
              {sphereLetters.map(({ letter, position }, index) => (
                <span
                  className={styles.sphereLetter}
                  key={`${letter}-${index}`}
                  style={
                    {
                      '--sphere-index': position,
                    } as CSSProperties
                  }
                >
                  {letter}
                </span>
              ))}
            </div>
            <div className={styles.sphereCore} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}

type ShiftProps = {
  shift: GeoAeoShiftConfig
}

function GeoAeoShiftSection({ shift }: ShiftProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' })

  return (
    <section
      ref={sectionRef}
      className={styles.shift}
      id="shift"
      aria-labelledby="geo-aeo-shift-title"
    >
      <div className={styles.shiftInner}>
        <div className={styles.shiftHeader}>
          <p className={styles.shiftEyebrow}>{shift.eyebrow}</p>
          <h2 className={styles.shiftTitle} id="geo-aeo-shift-title">
            {shift.title.map((line) => (
              <span className={line.accent ? styles.shiftTitleAccent : undefined} key={line.line}>
                {line.line}
              </span>
            ))}
          </h2>
          <p className={styles.shiftLead}>{shift.lead}</p>
        </div>

        <aside className={styles.shiftStatement} aria-label={shift.statement.kicker}>
          <p className={styles.shiftStatementKicker}>{shift.statement.kicker}</p>
          <p className={styles.shiftStatementText}>{shift.statement.text}</p>
          <ul className={styles.shiftSignalList} aria-label="Сигналы видимости для ИИ">
            {shift.statement.signals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </aside>

        <ul className={styles.shiftCards} aria-label="Почему GEO и AEO важны сейчас">
          {shift.cards.map((card, index) => (
            <li
              className={styles.shiftCard}
              key={card.title}
              style={{ '--shift-card-delay': `${220 + index * 110}ms` } as CSSProperties}
            >
              <span className={styles.shiftCardMeta} aria-hidden="true">
                <span className={styles.shiftCardNumber}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.shiftCardDivider}>/</span>
                <span className={styles.shiftCardMarker}>{card.marker}</span>
              </span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

type ProblemProps = {
  problem: GeoAeoProblemConfig
}

function GeoAeoProblemSection({ problem }: ProblemProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

  return (
    <section
      ref={sectionRef}
      className={styles.problem}
      id="problem"
      aria-labelledby="geo-aeo-problem-title"
    >
      <div className={styles.problemInner}>
        <div className={styles.problemHeader}>
          <p className={styles.problemEyebrow}>{problem.eyebrow}</p>
          <h2 className={styles.problemTitle} id="geo-aeo-problem-title">
            {problem.title.map((line) => (
              <span className={line.accent ? styles.problemTitleAccent : undefined} key={line.line}>
                {line.line}
              </span>
            ))}
          </h2>
          <p className={styles.problemLead}>{problem.lead}</p>
        </div>

        <div className={styles.problemBoard}>
          <ol className={styles.problemList} aria-label="Проблемы видимости в ИИ">
            {problem.items.map((item, index) => (
              <li
                className={styles.problemItem}
                key={item.title}
                style={{ '--problem-item-delay': `${180 + index * 90}ms` } as CSSProperties}
              >
                <div className={styles.problemItemMeta} aria-hidden="true">
                  <span className={styles.problemItemNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.problemItemMarker}>{item.marker}</span>
                </div>
                <div className={styles.problemItemBody}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <p className={styles.problemItemSignal}>{item.signal}</p>
              </li>
            ))}
          </ol>

          <aside className={styles.problemSummary} aria-label={problem.summary.label}>
            <p className={styles.problemSummaryLabel}>{problem.summary.label}</p>
            <p className={styles.problemSummaryText}>{problem.summary.text}</p>
          </aside>
        </div>
      </div>
    </section>
  )
}

type DefinitionProps = {
  definition: GeoAeoDefinitionConfig
}

function GeoAeoDefinitionSection({ definition }: DefinitionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' })

  return (
    <section
      ref={sectionRef}
      className={styles.definition}
      id="definition"
      aria-labelledby="geo-aeo-definition-title"
    >
      <div className={styles.definitionInner}>
        <div className={styles.definitionHeader}>
          <p className={styles.definitionEyebrow}>{definition.eyebrow}</p>
          <h2 className={styles.definitionTitle} id="geo-aeo-definition-title">
            {definition.title.map((line) => (
              <span
                className={line.accent ? styles.definitionTitleAccent : undefined}
                key={line.line}
              >
                {line.line}
              </span>
            ))}
          </h2>
          <p className={styles.definitionLead}>{definition.lead}</p>
        </div>

        <div className={styles.definitionTerms}>
          {definition.terms.map((term, index) => (
            <article
              className={styles.definitionTerm}
              key={term.label}
              style={{ '--definition-term-delay': `${180 + index * 120}ms` } as CSSProperties}
            >
              <div className={styles.definitionTermTop}>
                <p className={styles.definitionTermCode}>{term.label}</p>
                <p className={styles.definitionTermName}>{term.name}</p>
              </div>
              <div className={styles.definitionTermBody}>
                <p className={styles.definitionTermDescription}>{term.description}</p>
                <ul
                  className={styles.definitionPointList}
                  aria-label={`Что входит в ${term.label}`}
                >
                  {term.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <p className={styles.definitionSummary}>{definition.summary}</p>
      </div>
    </section>
  )
}

type ComparisonProps = {
  comparison: GeoAeoComparisonConfig
}

function GeoAeoComparisonSection({ comparison }: ComparisonProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' })

  return (
    <section
      ref={sectionRef}
      className={styles.comparison}
      id="comparison"
      aria-labelledby="geo-aeo-comparison-title"
    >
      <div className={styles.comparisonInner}>
        <div className={styles.comparisonHeader}>
          <p className={styles.comparisonEyebrow}>{comparison.eyebrow}</p>
          <h2 className={styles.comparisonTitle} id="geo-aeo-comparison-title">
            {comparison.title.map((line) => (
              <span
                className={line.accent ? styles.comparisonTitleAccent : undefined}
                key={line.line}
              >
                {line.line}
              </span>
            ))}
          </h2>
          <p className={styles.comparisonLead}>{comparison.lead}</p>
        </div>

        <div className={styles.comparisonGrid}>
          {comparison.layers.map((layer, index) => (
            <article
              className={styles.comparisonCard}
              key={layer.code}
              style={{ '--comparison-card-delay': `${180 + index * 110}ms` } as CSSProperties}
            >
              <div className={styles.comparisonCardTop}>
                <p className={styles.comparisonCardIndex}>{String(index + 1).padStart(2, '0')}</p>
                <p className={styles.comparisonCardCode}>{layer.code}</p>
              </div>
              <div className={styles.comparisonCardBody}>
                <p className={styles.comparisonCardLabel}>{layer.label}</p>
                <p className={styles.comparisonCardDescription}>{layer.description}</p>
                <ul
                  className={styles.comparisonPointList}
                  aria-label={`Что включает ${layer.code}`}
                >
                  {layer.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <aside className={styles.comparisonSummary} aria-label={comparison.summary.label}>
          <p className={styles.comparisonSummaryLabel}>{comparison.summary.label}</p>
          <p className={styles.comparisonSummaryText}>{comparison.summary.text}</p>
          <ol className={styles.comparisonSteps} aria-label="Последовательность подготовки">
            {comparison.summary.steps.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {step}
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  )
}

type ScopeProps = {
  scope: GeoAeoScopeConfig
}

function GeoAeoScopeSection({ scope }: ScopeProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' })

  return (
    <section
      ref={sectionRef}
      className={styles.scope}
      id="scope"
      aria-labelledby="geo-aeo-scope-title"
    >
      <div className={styles.scopeInner}>
        <div className={styles.scopeHeader}>
          <p className={styles.scopeEyebrow}>{scope.eyebrow}</p>
          <h2 className={styles.scopeTitle} id="geo-aeo-scope-title">
            {scope.title.map((line) => (
              <span className={line.accent ? styles.scopeTitleAccent : undefined} key={line.line}>
                {line.line}
              </span>
            ))}
          </h2>
          <p className={styles.scopeLead}>{scope.lead}</p>
        </div>

        <div className={styles.scopeBoard}>
          <ol className={styles.scopeList} aria-label="Что входит в GEO/AEO-работу">
            {scope.items.map((item, index) => (
              <li
                className={styles.scopeItem}
                key={item.title}
                style={{ '--scope-item-delay': `${180 + index * 70}ms` } as CSSProperties}
              >
                <div className={styles.scopeItemMeta} aria-hidden="true">
                  <span className={styles.scopeItemNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.scopeItemMarker}>{item.marker}</span>
                </div>
                <div className={styles.scopeItemBody}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <aside className={styles.scopeSummary} aria-label={scope.summary.label}>
            <p className={styles.scopeSummaryLabel}>{scope.summary.label}</p>
            <p className={styles.scopeSummaryText}>{scope.summary.text}</p>
            <ul className={styles.scopeCheckList} aria-label="Что можно проверить после работы">
              {scope.summary.checks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}

type WhyProps = {
  why: GeoAeoWhyConfig
}

function GeoAeoWhySection({ why }: WhyProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

  return (
    <section ref={sectionRef} className={styles.why} id="why" aria-labelledby="geo-aeo-why-title">
      <div className={styles.whyInner}>
        <div className={styles.whyHeader}>
          <p className={styles.whyEyebrow}>{why.eyebrow}</p>
          <h2 className={styles.whyTitle} id="geo-aeo-why-title">
            {why.title.map((line) => (
              <span className={line.accent ? styles.whyTitleAccent : undefined} key={line.line}>
                {line.line}
              </span>
            ))}
          </h2>
          <p className={styles.whyLead}>{why.lead}</p>
        </div>

        <div className={styles.whyBoard}>
          <ol className={styles.whyList} aria-label="Почему Project 42 подходит для GEO/AEO">
            {why.items.map((item, index) => (
              <li
                className={styles.whyItem}
                key={item.title}
                style={{ '--why-item-delay': `${180 + index * 90}ms` } as CSSProperties}
              >
                <div className={styles.whyItemMeta} aria-hidden="true">
                  <span className={styles.whyItemNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.whyItemMarker}>{item.marker}</span>
                </div>
                <div className={styles.whyItemBody}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <aside className={styles.whySummary} aria-label={why.summary.label}>
            <p className={styles.whySummaryLabel}>{why.summary.label}</p>
            <p className={styles.whySummaryText}>{why.summary.text}</p>
          </aside>
        </div>
      </div>
    </section>
  )
}

type CtaProps = {
  cta: GeoAeoFinalCtaConfig
}

type FaqProps = {
  faq: GeoAeoFaqConfig
}

type ResultProps = {
  result: GeoAeoResultConfig
}

function GeoAeoResultSection({ result }: ResultProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.22, rootMargin: '0px 0px -12% 0px' })

  return (
    <section
      ref={sectionRef}
      className={styles.result}
      id="result"
      aria-labelledby="geo-aeo-result-title"
    >
      <div className={styles.resultShell}>
        <div className={styles.resultLayout}>
          <div className={styles.resultHeader}>
            <p className={styles.resultEyebrow}>{result.eyebrow}</p>
            <h2 className={styles.resultTitle} id="geo-aeo-result-title">
              {result.title.map((line) => (
                <span
                  className={line.accent ? styles.resultTitleAccent : undefined}
                  key={line.line}
                >
                  {line.line}
                </span>
              ))}
            </h2>
            <p className={styles.resultLead}>{result.lead}</p>
          </div>

          <div className={styles.resultBody}>
            <ul className={styles.resultList} aria-label="Что будет готово после GEO/AEO-работы">
              {result.items.map((item) => (
                <li className={styles.resultItem} key={item}>
                  {item}
                </li>
              ))}
            </ul>

            <aside className={styles.resultNote} aria-label={result.note.label}>
              <p className={styles.resultNoteLabel}>{result.note.label}</p>
              <p className={styles.resultNoteText}>{result.note.text}</p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}

function GeoAeoFaqSection({ faq }: FaqProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' })

  return (
    <section ref={sectionRef} className={styles.faq} id="faq" aria-labelledby="geo-aeo-faq-title">
      <div className={styles.faqInner}>
        <div className={styles.faqHeader}>
          <p className={styles.faqEyebrow}>{faq.eyebrow}</p>
          <h2
            className={styles.faqTitle}
            id="geo-aeo-faq-title"
            aria-label={faq.title.map((line) => line.line).join(' ')}
          >
            {faq.title.map((line) => (
              <span className={line.accent ? styles.faqTitleAccent : undefined} key={line.line}>
                {line.line}
              </span>
            ))}
          </h2>
          <p className={styles.faqLead}>{faq.lead}</p>
        </div>

        <ol className={styles.faqList} aria-label="Вопросы о GEO/AEO-продвижении">
          {faq.items.map((item, index) => (
            <li
              className={styles.faqItem}
              key={item.id}
              style={{ '--faq-item-delay': `${180 + index * 70}ms` } as CSSProperties}
            >
              <details className={styles.faqDetails}>
                <summary className={styles.faqQuestion}>
                  <span className={styles.faqNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <span>{item.question}</span>
                </summary>
                <div className={styles.faqAnswerWrap}>
                  <p className={styles.faqAnswer}>{item.answer}</p>
                </div>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function GeoAeoCtaSection({ cta }: CtaProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { threshold: 0.22, rootMargin: '0px 0px -12% 0px' })

  return (
    <section ref={sectionRef} className={styles.cta} id="cta" aria-labelledby="geo-aeo-cta-title">
      <span className={styles.ctaContactsAnchor} id="contacts" aria-hidden="true" />
      <div className={styles.ctaShell}>
        <div className={styles.ctaVisual}>
          <Image
            className={styles.ctaImage}
            src="/images/razrabotka/cta-image.webp"
            alt=""
            width={680}
            height={700}
            sizes="(max-width: 767px) 86vw, (max-width: 1023px) 620px, 46vw"
            aria-hidden="true"
          />
        </div>

        <div className={styles.ctaContent}>
          <p className={styles.ctaKicker}>{cta.eyebrow}</p>
          <h2 className={styles.ctaTitle} id="geo-aeo-cta-title">
            {cta.title.map((line) => (
              <span className={line.accent ? styles.ctaAccentWord : undefined} key={line.line}>
                {line.line}
              </span>
            ))}
          </h2>
          <p className={styles.ctaText}>{cta.text}</p>
          <div className={styles.ctaActions} aria-label="Действия CTA">
            <StudioButton
              className={styles.ctaPrimaryButton}
              href={cta.primary.href}
              variant="yellow"
              icon={null}
            >
              {cta.primary.label}
            </StudioButton>
            <StudioButton
              className={styles.ctaSecondaryButton}
              href={cta.secondary.href}
              variant="outline"
              icon="telegram"
            >
              {cta.secondary.label}
            </StudioButton>
          </div>
        </div>
      </div>
    </section>
  )
}

type Props = {
  config: GeoAeoPageConfig
}

export function GeoAeoPage({ config }: Props) {
  useEffect(() => {
    document.body.dataset.scrollbarTheme = 'geo-aeo'

    return () => {
      if (document.body.dataset.scrollbarTheme === 'geo-aeo') {
        delete document.body.dataset.scrollbarTheme
      }
    }
  }, [])

  return (
    <div className={styles.pageCanvas} data-geo-aeo-page data-testid="geo-aeo-page-canvas">
      <RazrabotkaHeader
        logoHref="/"
        logoCaption="Делаем сайты"
        navLinks={pageNavLinks}
        ctaLabel="Проверить сайт"
        ctaHref="#cta"
        menuId="geo-aeo-header-menu"
        testId="geo-aeo-header"
      />
      <main>
        <GeoAeoHero hero={config.hero} />
        <GeoAeoShiftSection shift={config.shift} />
        <GeoAeoProblemSection problem={config.problem} />
        <GeoAeoDefinitionSection definition={config.definition} />
        <GeoAeoComparisonSection comparison={config.comparison} />
        <GeoAeoScopeSection scope={config.scope} />
        <GeoAeoWhySection why={config.why} />
        <GeoAeoResultSection result={config.result} />
        <GeoAeoFaqSection faq={config.faq} />
        <GeoAeoCtaSection cta={config.cta} />
        <RazrabotkaBlogCarouselSection />
      </main>
      <RazrabotkaFooter
        usePageAnchors
        sectionLinks={footerNavLinks}
        ariaLabel="Футер страницы GEO/AEO-продвижения"
      />
    </div>
  )
}
