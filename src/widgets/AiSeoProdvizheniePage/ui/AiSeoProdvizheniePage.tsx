import Image from 'next/image'
import Link from 'next/link'
import { StudioButton } from '@/shared/ui'
import { RazrabotkaFooter, RazrabotkaHeader } from '@/widgets/RazrabotkaPage'
import {
  aiSeoProdvizhenieFaqItems,
  aiSeoProdvizhenieFooterLinks,
  aiSeoProdvizhenieNavLinks,
  aiSeoProdvizhenieRelatedLinks,
  aiSeoProdvizhenieScopeItems,
  aiSeoResultItems,
  aiSeoTechnicalItems,
} from '../content'
import styles from '@/widgets/GeoProdvizheniePage/ui/GeoProdvizheniePage.module.scss'

export function AiSeoProdvizheniePage() {
  return (
    <div className={styles.pageCanvas} data-testid="ai-seo-prodvizhenie-page">
      <RazrabotkaHeader
        logoHref="/ai-seo-prodvizhenie"
        logoCaption="AI SEO"
        navLinks={aiSeoProdvizhenieNavLinks}
        ctaLabel="Заказать аудит"
        ctaHref="#cta"
        menuId="ai-seo-prodvizhenie-header-menu"
        testId="ai-seo-prodvizhenie-header"
      />

      <main className={styles.main}>
        <section className={styles.hero} id="top" aria-labelledby="ai-seo-prodvizhenie-title">
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <p className={styles.kicker}>AI SEO / SEO под ИИ-поиск</p>
              <h1 className={styles.title} id="ai-seo-prodvizhenie-title">
                <span className={styles.outlineWord}>AI SEO</span>
                <span>продвижение</span>
                <span>
                  сайтов <span className={styles.accentWord}>в ИИ</span>
                </span>
              </h1>
              <p className={styles.lead}>
                Усиливаем классическое SEO подготовкой сайта к AI-поиску и нейросетям: техническая
                база, структура страниц, FAQ, контент, индексация и аналитика.
              </p>
              <div className={styles.actions} aria-label="Основные действия">
                <StudioButton className={styles.primaryButton} href="#cta" variant="mint">
                  Заказать AI SEO-аудит
                </StudioButton>
                <StudioButton className={styles.secondaryButton} href="#scope" variant="peach">
                  Получить план роста
                </StudioButton>
              </div>
            </div>

            <div className={styles.heroVisual} aria-label="Связка SEO, AEO, GEO и AI-поиска">
              <div className={styles.signalOrbit} aria-hidden="true">
                <span>SEO</span>
                <span>AEO</span>
                <span>GEO</span>
                <span>AI-поиск</span>
              </div>
              <div className={styles.visualCore}>
                <span>AI SEO</span>
                <small>техника + структура + контент</small>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.aboutSection} id="about" aria-labelledby="ai-seo-about-title">
          <div className={styles.sectionInner}>
            <p className={styles.sectionKicker}>Что это</p>
            <h2 className={styles.sectionTitle} id="ai-seo-about-title">
              AI SEO - это SEO-база, подготовленная к AI-поиску
            </h2>
            <p className={styles.sectionText}>
              Продвижение сайта в нейросетях не отменяет SEO: поисковая база, краулинг, индексация и
              качество страниц остаются фундаментом. AI-направление добавляет структуру ответов,
              факты, FAQ и контент под вопросы клиентов.
            </p>
          </div>
        </section>

        <section
          className={styles.resultSection}
          id="technical"
          aria-labelledby="ai-seo-technical-title"
        >
          <div className={styles.resultInner}>
            <div>
              <p className={styles.sectionKicker}>Техника</p>
              <h2 className={styles.sectionTitle} id="ai-seo-technical-title">
                Сначала проверяем, может ли сайт нормально считываться
              </h2>
            </div>
            <ul className={styles.resultList}>
              {aiSeoTechnicalItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.scopeSection} id="scope" aria-labelledby="ai-seo-scope-title">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionKicker}>Что меняем</p>
              <h2 className={styles.sectionTitle} id="ai-seo-scope-title">
                Делаем страницы понятными для поиска, ответов и нейросетей
              </h2>
            </div>
            <div className={styles.scopeGrid}>
              {aiSeoProdvizhenieScopeItems.map((item, index) => (
                <article className={styles.scopeCard} key={item.title}>
                  <span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.resultSection} id="result" aria-labelledby="ai-seo-result-title">
          <div className={styles.resultInner}>
            <div>
              <p className={styles.sectionKicker}>Результат</p>
              <h2 className={styles.sectionTitle} id="ai-seo-result-title">
                На выходе - план SEO-продвижения с учетом ИИ
              </h2>
            </div>
            <ul className={styles.resultList}>
              {aiSeoResultItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.faqSection} id="faq" aria-labelledby="ai-seo-faq-title">
          <div className={styles.sectionInner}>
            <p className={styles.sectionKicker}>FAQ</p>
            <h2 className={styles.sectionTitle} id="ai-seo-faq-title">
              Частые вопросы про AI SEO-продвижение
            </h2>
            <div className={styles.faqList}>
              {aiSeoProdvizhenieFaqItems.map((item) => (
                <article className={styles.faqItem} key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className={styles.relatedSection}
          id="cluster"
          aria-labelledby="ai-seo-cluster-title"
        >
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionKicker}>SEO / AEO / GEO</p>
              <h2 className={styles.sectionTitle} id="ai-seo-cluster-title">
                AI SEO соединяет техническую базу, ответы и GEO-сигналы
              </h2>
              <p className={styles.sectionText}>
                Чтобы сайт лучше считывался поиском и нейросетями, важно связать техническую
                подготовку, AEO-блоки, GEO-страницы и объясняющие статьи.
              </p>
            </div>
            <div className={styles.relatedGrid}>
              {aiSeoProdvizhenieRelatedLinks.map((link) => (
                <Link className={styles.relatedCard} href={link.href} key={link.href}>
                  <span>{link.tag}</span>
                  <h3>{link.title}</h3>
                  <p>{link.text}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaSection} id="cta" aria-labelledby="ai-seo-cta-title">
          <span className={styles.contactsAnchor} id="contacts" aria-hidden="true" />
          <div className={styles.ctaInner}>
            <div className={styles.ctaContent}>
              <p className={styles.sectionKicker}>Старт</p>
              <h2 className={styles.ctaTitle} id="ai-seo-cta-title">
                Проверим, готов ли ваш сайт к SEO и AI-поиску
              </h2>
              <p className={styles.ctaText}>
                Напишите нам, и мы покажем, где сайт теряет видимость: в технике, структуре,
                контенте, AEO-блоках или GEO-сигналах.
              </p>
              <StudioButton className={styles.ctaButton} href="mailto:project42studio@gmail.com">
                Заказать AI SEO-аудит
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
        sectionLinks={aiSeoProdvizhenieFooterLinks}
        ariaLabel="Футер страницы AI SEO-продвижения"
      />
    </div>
  )
}
