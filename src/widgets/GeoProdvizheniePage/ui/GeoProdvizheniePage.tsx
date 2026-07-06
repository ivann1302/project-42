import Image from 'next/image'
import Link from 'next/link'
import { StudioButton } from '@/shared/ui'
import { RazrabotkaFooter, RazrabotkaHeader } from '@/widgets/RazrabotkaPage'
import {
  geoProdvizhenieFaqItems,
  geoProdvizhenieFooterLinks,
  geoProdvizhenieNavLinks,
  geoProdvizhenieRelatedLinks,
  geoProdvizhenieResultItems,
  geoProdvizhenieScopeItems,
} from '../content'
import styles from './GeoProdvizheniePage.module.scss'

export function GeoProdvizheniePage() {
  return (
    <div className={styles.pageCanvas} data-testid="geo-prodvizhenie-page">
      <RazrabotkaHeader
        logoHref="/geo-prodvizhenie"
        logoCaption="GEO-продвижение"
        navLinks={geoProdvizhenieNavLinks}
        ctaLabel="Получить аудит"
        ctaHref="#cta"
        menuId="geo-prodvizhenie-header-menu"
        testId="geo-prodvizhenie-header"
      />

      <main className={styles.main}>
        <section className={styles.hero} id="top" aria-labelledby="geo-prodvizhenie-title">
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <p className={styles.kicker}>GEO / AI search</p>
              <h1 className={styles.title} id="geo-prodvizhenie-title">
                <span className={styles.outlineWord}>GEO</span>
                <span>продвижение</span>
                <span>
                  в <span className={styles.accentWord}>нейросетях</span>
                </span>
              </h1>
              <p className={styles.lead}>
                Сделаем сайт понятным источником для ChatGPT, Алисы, Perplexity и AI-поиска: усилим
                структуру, факты, контент, индексацию и аналитику заявок.
              </p>
              <div className={styles.actions} aria-label="Основные действия">
                <StudioButton className={styles.primaryButton} href="#cta" variant="mint">
                  Получить GEO-аудит
                </StudioButton>
                <StudioButton className={styles.secondaryButton} href="#scope" variant="peach">
                  Что входит
                </StudioButton>
              </div>
            </div>

            <div className={styles.heroVisual} aria-label="Сигналы видимости сайта в AI-поиске">
              <div className={styles.signalOrbit} aria-hidden="true">
                <span>ChatGPT</span>
                <span>Алиса</span>
                <span>Perplexity</span>
                <span>AI-поиск</span>
              </div>
              <div className={styles.visualCore}>
                <span>GEO</span>
                <small>структура + факты + доверие</small>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.aboutSection} id="about" aria-labelledby="geo-about-title">
          <div className={styles.sectionInner}>
            <p className={styles.sectionKicker}>Что это</p>
            <h2 className={styles.sectionTitle} id="geo-about-title">
              GEO помогает бренду попадать в поле зрения AI-систем
            </h2>
            <p className={styles.sectionText}>
              Клиент может начать выбор не с выдачи, а с вопроса ассистенту: кого взять, кому
              доверить задачу, какие компании сравнить. Чтобы сайт не пропадал в этом сценарии, на
              нем должны быть понятные услуги, кейсы, отзывы, факты и ответы на частые вопросы.
            </p>
          </div>
        </section>

        <section className={styles.scopeSection} id="scope" aria-labelledby="geo-scope-title">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionKicker}>Что входит</p>
              <h2 className={styles.sectionTitle} id="geo-scope-title">
                Начинаем с базы, которую нейросети могут проверить
              </h2>
            </div>
            <div className={styles.scopeGrid}>
              {geoProdvizhenieScopeItems.map((item, index) => (
                <article className={styles.scopeCard} key={item.title}>
                  <span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.resultSection} id="result" aria-labelledby="geo-result-title">
          <div className={styles.resultInner}>
            <div>
              <p className={styles.sectionKicker}>Результат</p>
              <h2 className={styles.sectionTitle} id="geo-result-title">
                На выходе не магия, а понятный план продвижения в ИИ
              </h2>
            </div>
            <ul className={styles.resultList}>
              {geoProdvizhenieResultItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.faqSection} id="faq" aria-labelledby="geo-faq-title">
          <div className={styles.sectionInner}>
            <p className={styles.sectionKicker}>FAQ</p>
            <h2 className={styles.sectionTitle} id="geo-faq-title">
              Частые вопросы о GEO-продвижении
            </h2>
            <div className={styles.faqList}>
              {geoProdvizhenieFaqItems.map((item) => (
                <article className={styles.faqItem} key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.relatedSection} id="cluster" aria-labelledby="geo-cluster-title">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionKicker}>SEO / AEO / GEO</p>
              <h2 className={styles.sectionTitle} id="geo-cluster-title">
                Связываем GEO с SEO, AEO и AI SEO
              </h2>
              <p className={styles.sectionText}>
                GEO-продвижение сильнее работает не отдельно, а вместе с технической SEO-базой,
                AEO-ответами и статьями, которые объясняют тему простым языком.
              </p>
            </div>
            <div className={styles.relatedGrid}>
              {geoProdvizhenieRelatedLinks.map((link) => (
                <Link className={styles.relatedCard} href={link.href} key={link.href}>
                  <span>{link.tag}</span>
                  <h3>{link.title}</h3>
                  <p>{link.text}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaSection} id="cta" aria-labelledby="geo-cta-title">
          <span className={styles.contactsAnchor} id="contacts" aria-hidden="true" />
          <div className={styles.ctaInner}>
            <div className={styles.ctaContent}>
              <p className={styles.sectionKicker}>Старт</p>
              <h2 className={styles.ctaTitle} id="geo-cta-title">
                Проверим, готов ли ваш сайт к ответам нейросетей
              </h2>
              <p className={styles.ctaText}>
                Напишите нам, и мы посмотрим, какие страницы стоит усилить первыми.
              </p>
              <StudioButton className={styles.ctaButton} href="mailto:project42studio@gmail.com">
                Получить GEO-аудит
              </StudioButton>
            </div>
            <div className={styles.ctaImageWrap} aria-hidden="true">
              <Image
                className={styles.ctaImage}
                src="/images/blog/article-geo-seo-aeo.png"
                alt=""
                width={1536}
                height={1024}
                sizes="(max-width: 767px) 82vw, 420px"
              />
            </div>
          </div>
        </section>
      </main>

      <RazrabotkaFooter
        usePageAnchors
        sectionLinks={geoProdvizhenieFooterLinks}
        ariaLabel="Футер страницы GEO-продвижения"
      />
    </div>
  )
}
