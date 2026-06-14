'use client'

import type { CSSProperties } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { Container, SectionTitle, StarField, Button, Modal, Icon } from '@/shared/ui'
import { ContactForm } from '@/features/ContactForm'
import { useScrollReveal } from '@/shared/lib'
import { getProjectCaseHref, projects } from '@/entities/Project'
import styles from './Portfolio.module.scss'

type Props = {
  desktopCarousel?: boolean
}

const VISIBLE_DESKTOP_CARDS = 3
const AUTOPLAY_DELAY = 3000

export function Portfolio({ desktopCarousel = true }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isCarouselViewport, setIsCarouselViewport] = useState(false)
  const [isDesktopViewport, setIsDesktopViewport] = useState(false)
  const [sectionInView, setSectionInView] = useState(false)
  const [carouselPaused, setCarouselPaused] = useState(false)
  const canUseCarousel = desktopCarousel && projects.length > VISIBLE_DESKTOP_CARDS
  const maxIndex = Math.max(
    projects.length - (desktopCarousel && isDesktopViewport ? VISIBLE_DESKTOP_CARDS : 1),
    0,
  )

  useScrollReveal(gridRef, { threshold: 0.1 })

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const list = gridRef.current
    const target = list?.children[index] as HTMLElement | undefined

    if (!list || !target) return

    const listRect = list.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const nextLeft = targetRect.left - listRect.left + list.scrollLeft

    list.scrollTo({ left: nextLeft, behavior })
  }, [])

  const moveCarousel = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((currentIndex) => {
        let nextIndex = currentIndex + direction

        if (nextIndex > maxIndex) nextIndex = 0
        if (nextIndex < 0) nextIndex = maxIndex

        scrollToIndex(nextIndex)
        return nextIndex
      })
    },
    [maxIndex, scrollToIndex],
  )

  useEffect(() => {
    if (!window.matchMedia) {
      setIsCarouselViewport(true)
      return
    }

    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    const handleChange = () => {
      setIsDesktopViewport(desktopQuery.matches)
      setIsCarouselViewport(mobileQuery.matches || (desktopCarousel && desktopQuery.matches))
    }

    handleChange()
    mobileQuery.addEventListener('change', handleChange)
    desktopQuery.addEventListener('change', handleChange)

    return () => {
      mobileQuery.removeEventListener('change', handleChange)
      desktopQuery.removeEventListener('change', handleChange)
    }
  }, [desktopCarousel])

  useEffect(() => {
    const section = sectionRef.current

    if (!section) return

    const observer = new IntersectionObserver(([entry]) => setSectionInView(entry.isIntersecting), {
      threshold: 0.35,
    })

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isCarouselViewport) return

    const handleResize = () => scrollToIndex(activeIndex, 'auto')

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [activeIndex, isCarouselViewport, scrollToIndex])

  useEffect(() => {
    if (!isCarouselViewport || !sectionInView || carouselPaused) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const intervalId = window.setInterval(() => moveCarousel(1), AUTOPLAY_DELAY)

    return () => window.clearInterval(intervalId)
  }, [carouselPaused, isCarouselViewport, moveCarousel, sectionInView])

  return (
    <section ref={sectionRef} className={styles.root} id="portfolio">
      <StarField />
      <Container>
        <SectionTitle eyebrow="Наши работы" align="center">
          Проекты
        </SectionTitle>
        <div
          className={clsx(styles.carouselShell, canUseCarousel && styles.desktopCarousel)}
          onMouseEnter={() => setCarouselPaused(true)}
          onMouseLeave={() => setCarouselPaused(false)}
          onFocus={() => setCarouselPaused(true)}
          onBlur={() => setCarouselPaused(false)}
        >
          <ul ref={gridRef} className={styles.grid} role="list">
            {projects.map((project, idx) => (
              <li key={project.id} className={styles.card} style={{ '--i': idx } as CSSProperties}>
                <Link href={getProjectCaseHref(project.id)} className={styles.cardLink}>
                  <div className={styles.image}>
                    {project.desktopImageUrl ? (
                      <Image
                        src={project.desktopImageUrl}
                        alt={project.title}
                        fill
                        className={styles.img}
                        sizes={
                          desktopCarousel
                            ? '(max-width: 768px) 100vw, 33vw'
                            : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                        }
                        loading={idx === 0 ? undefined : desktopCarousel ? 'eager' : 'lazy'}
                        priority={idx === 0}
                      />
                    ) : (
                      <div className={styles.placeholder} />
                    )}
                  </div>
                  <div className={styles.meta}>
                    <h3 className={styles.title}>{project.title}</h3>
                    <ul className={styles.tags} role="list">
                      {project.tags.map((tag) => (
                        <li key={tag} className={styles.tag}>
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className={styles.hoverLabel} aria-hidden="true">
                    Смотреть проект →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {canUseCarousel && (
            <div className={styles.carouselControls}>
              <button
                type="button"
                className={styles.carouselButton}
                aria-label="Предыдущий проект"
                onClick={() => moveCarousel(-1)}
              >
                <Icon name="arrowLeft" size={22} />
              </button>
              <button
                type="button"
                className={styles.carouselButton}
                aria-label="Следующий проект"
                onClick={() => moveCarousel(1)}
              >
                <Icon name="arrowRight" size={22} />
              </button>
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <Button variant="secondary" href="/portfolio">
            Перейти в портфолио
          </Button>
        </div>

        <div className={styles.cta}>
          <p className={styles.ctaHeading}>Понравились работы?</p>
          <p className={styles.ctaSub}>Хотите похожий проект? Расскажите о задаче — обсудим.</p>
          <Button onClick={() => setOpen(true)}>Оставить заявку</Button>
        </div>
      </Container>

      <Modal open={open} onClose={() => setOpen(false)} title="Оставить заявку">
        <ContactForm onSuccess={() => setOpen(false)} />
      </Modal>
    </section>
  )
}
