import Image from 'next/image'
import Link from 'next/link'
import { StudioButton } from '@/shared/ui'
import { RazrabotkaFooter, RazrabotkaHeader } from '@/widgets/RazrabotkaPage'
import {
  aeoProdvizhenieFaqItems,
  aeoProdvizhenieFooterLinks,
  aeoProdvizhenieNavLinks,
  aeoProdvizhenieRelatedLinks,
  aeoProdvizhenieResultItems,
  aeoProdvizhenieScopeItems,
} from '../content'
import styles from '@/widgets/GeoProdvizheniePage/ui/GeoProdvizheniePage.module.scss'

export function AeoProdvizheniePage() {
  return (
    <div className={styles.pageCanvas} data-testid="aeo-prodvizhenie-page">
      <RazrabotkaHeader
        logoHref="/aeo-prodvizhenie"
        logoCaption="AEO-продвижение"
        navLinks={aeoProdvizhenieNavLinks}
        ctaLabel="Проверить страницы"
        ctaHref="#cta"
        menuId="aeo-prodvizhenie-header-menu"
        testId="aeo-prodvizhenie-header"
      />

      <main className={styles.main}>
        <section className={styles.hero} id="top" aria-labelledby="aeo-prodvizhenie-title">
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <p className={styles.kicker}>AEO / Answer Engine Optimization</p>
              <h1 className={styles.title} id="aeo-prodvizhenie-title">
                <span className={styles.outlineWord}>AEO</span>
                <span>продвижение</span>
                <span>
                  сайта <span className={styles.accentWord}>под ответы</span>
                </span>
              </h1>
              <p className={styles.lead}>
                AEO-оптимизация превращает страницы сайта в понятные ответы: собираем вопросы
                клиентов, добавляем короткие формулировки, FAQ, микроразметку и связку с GEO.
              </p>
              <div className={styles.actions} aria-label="Основные действия">
                <StudioButton className={styles.primaryButton} href="#cta" variant="mint">
                  Проверить страницы
                </StudioButton>
                <StudioButton className={styles.secondaryButton} href="#scope" variant="peach">
                  Что входит
                </StudioButton>
              </div>
            </div>

            <div className={styles.heroVisual} aria-label="AEO-сигналы для страниц сайта">
              <div className={styles.signalOrbit} aria-hidden="true">
                <span>SEO</span>
                <span>FAQ</span>
                <span>GEO</span>
                <span>AI-поиск</span>
              </div>
              <div className={styles.visualCore}>
                <span>AEO</span>
                <small>вопросы + ответы + структура</small>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.aboutSection} id="about" aria-labelledby="aeo-about-title">
          <div className={styles.sectionInner}>
            <p className={styles.sectionKicker}>Что это</p>
            <h2 className={styles.sectionTitle} id="aeo-about-title">
              AEO помогает странице стать готовым ответом
            </h2>
            <p className={styles.sectionText}>
              Пользователь все чаще формулирует задачу как вопрос: что выбрать, чем отличается, где
              заказать, сколько стоит. AEO-продвижение сайта помогает поиску и AI-системам быстро
              считать ответ, а человеку - понять услугу без длинного пути по странице.
            </p>
          </div>
        </section>

        <section
          className={styles.resultSection}
          id="difference"
          aria-labelledby="aeo-difference-title"
        >
          <div className={styles.resultInner}>
            <div>
              <p className={styles.sectionKicker}>Отличия</p>
              <h2 className={styles.sectionTitle} id="aeo-difference-title">
                SEO, AEO, GEO работают на разных уровнях
              </h2>
            </div>
            <ul className={styles.resultList}>
              <li>SEO - индексация, релевантность и поисковая база</li>
              <li>AEO - ответы, FAQ, определения и структура блоков</li>
              <li>GEO/AEO - подготовка сайта к AI-поиску и генеративным ответам</li>
              <li>Продвижение сайта в ИИ начинается с понятных страниц, а не с обещаний топов</li>
            </ul>
          </div>
        </section>

        <section className={styles.scopeSection} id="scope" aria-labelledby="aeo-scope-title">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionKicker}>Что входит</p>
              <h2 className={styles.sectionTitle} id="aeo-scope-title">
                Делаем страницы услуг понятными для ответных систем
              </h2>
            </div>
            <div className={styles.scopeGrid}>
              {aeoProdvizhenieScopeItems.map((item, index) => (
                <article className={styles.scopeCard} key={item.title}>
                  <span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.resultSection} id="result" aria-labelledby="aeo-result-title">
          <div className={styles.resultInner}>
            <div>
              <p className={styles.sectionKicker}>Результат</p>
              <h2 className={styles.sectionTitle} id="aeo-result-title">
                На выходе - не набор ключей, а структура ответов
              </h2>
            </div>
            <ul className={styles.resultList}>
              {aeoProdvizhenieResultItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.faqSection} id="faq" aria-labelledby="aeo-faq-title">
          <div className={styles.sectionInner}>
            <p className={styles.sectionKicker}>FAQ</p>
            <h2 className={styles.sectionTitle} id="aeo-faq-title">
              Частые вопросы про AEO-продвижение
            </h2>
            <div className={styles.faqList}>
              {aeoProdvizhenieFaqItems.map((item) => (
                <article className={styles.faqItem} key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.relatedSection} id="cluster" aria-labelledby="aeo-cluster-title">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionKicker}>SEO / AEO / GEO</p>
              <h2 className={styles.sectionTitle} id="aeo-cluster-title">
                AEO раскрывается внутри общей системы видимости
              </h2>
              <p className={styles.sectionText}>
                Ответные блоки усиливают SEO-страницы, помогают GEO-продвижению и делают сайт
                понятнее для людей, поиска и AI-систем.
              </p>
            </div>
            <div className={styles.relatedGrid}>
              {aeoProdvizhenieRelatedLinks.map((link) => (
                <Link className={styles.relatedCard} href={link.href} key={link.href}>
                  <span>{link.tag}</span>
                  <h3>{link.title}</h3>
                  <p>{link.text}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaSection} id="cta" aria-labelledby="aeo-cta-title">
          <span className={styles.contactsAnchor} id="contacts" aria-hidden="true" />
          <div className={styles.ctaInner}>
            <div className={styles.ctaContent}>
              <p className={styles.sectionKicker}>Старт</p>
              <h2 className={styles.ctaTitle} id="aeo-cta-title">
                Проверим, отвечают ли ваши страницы на вопросы клиентов
              </h2>
              <p className={styles.ctaText}>
                Напишите нам, и мы покажем, где сайту не хватает AEO-блоков, FAQ и структуры для
                продвижения в ИИ.
              </p>
              <StudioButton className={styles.ctaButton} href="mailto:project42studio@gmail.com">
                Получить AEO-аудит
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
        sectionLinks={aeoProdvizhenieFooterLinks}
        ariaLabel="Футер страницы AEO-продвижения"
      />
    </div>
  )
}
