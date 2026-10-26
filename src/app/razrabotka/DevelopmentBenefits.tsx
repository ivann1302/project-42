'use client'

import { useEffect, useRef } from 'react'
import { DevelopmentRevealText } from './DevelopmentRevealText'
import styles from './DevelopmentBenefits.module.scss'

const benefits = [
  {
    title: 'Современный и уникальный сайт',
    description: 'Дизайн под ваш бизнес, удобный на любом экране.',
    icon: (
      <>
        <path d="M291 174v55c0 15-12 27-27 27H119c-15 0-27-12-27-27V99c0-15 12-27 27-27h101" />
        <path d="M94 120h111M137 209h57" />
        <path d="m267 49 15 40 40 15-40 15-15 40-15-40-40-15 40-15Z" />
      </>
    ),
  },
  {
    title: 'Понятное описание услуг',
    description: 'Поможем с текстами и контентом.',
    icon: (
      <>
        <path d="M116 77h148c17 0 29 12 29 29v87c0 17-12 29-29 29h-92l-47 32v-32h-9c-17 0-29-12-29-29v-87c0-17 12-29 29-29Z" />
        <path d="M133 128h115M133 170h85" />
      </>
    ),
  },
  {
    title: 'Презентация вашей компании',
    description: 'Покажем ваш опыт, команду и проекты.',
    icon: (
      <>
        <rect x="91" y="81" width="216" height="164" rx="24" />
        <circle cx="153" cy="139" r="22" />
        <path d="M119 204c3-23 15-34 34-34s31 11 34 34M228 135h38M228 179h38" />
      </>
    ),
  },
  {
    title: 'Сопровождение и поддержка',
    description: '30 дней исправляем технические ошибки.',
    icon: (
      <>
        <path d="M110 171v-29c0-45 36-81 81-81s81 36 81 81v29" />
        <rect x="100" y="165" width="44" height="65" rx="15" />
        <rect x="238" y="165" width="44" height="65" rx="15" />
        <path d="M260 230c-4 27-25 38-63 38h-20" />
      </>
    ),
  },
  {
    title: 'Защита от перехвата клиентов',
    description: 'Помогаем снизить риск перехвата контактов посетителей.',
    icon: (
      <>
        <path d="m193 53 92 34v70c0 48-38 83-92 109-54-26-92-61-92-109V87Z" />
        <circle cx="193" cy="132" r="23" />
        <path d="M154 203c3-24 16-36 39-36s36 12 39 36" />
      </>
    ),
  },
  {
    title: 'Юридические документы',
    description: 'Подготовим политику обработки данных и согласия.',
    icon: (
      <>
        <path d="M127 61h99l52 52v126c0 14-11 25-25 25H127c-14 0-25-11-25-25V86c0-14 11-25 25-25Z" />
        <path d="M226 62v51h51" />
        <path d="m139 179 36 36 69-70" />
      </>
    ),
  },
  {
    title: 'Вы сами меняете сайт',
    description: 'Настроим редактирование нужных разделов.',
    icon: (
      <>
        <path d="M288 185v50c0 14-11 25-25 25H119c-14 0-25-11-25-25V95c0-14 11-25 25-25h98M94 120h105" />
        <path d="m166 219 11-47 96-96c8-8 18-8 26 0l12 12c8 8 8 18 0 26l-96 96-49 9ZM252 97l38 38" />
      </>
    ),
  },
] as const

export function DevelopmentBenefits() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const mobile = window.matchMedia('(max-width: 767px)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const slots = Array.from(list.querySelectorAll<HTMLElement>(`.${styles.revealSlot}`))
    const cards = slots.map((slot) => slot.querySelector<HTMLElement>('article')!)
    const titles = cards.map((card) => card.querySelector<HTMLElement>('h3')!)
    const icons = cards.map((card) => card.querySelector<HTMLElement>(`.${styles.iconTile}`)!)
    let frame = 0

    const updateStack = () => {
      frame = 0
      if (!mobile.matches || reducedMotion.matches) {
        list.classList.remove(styles.stacked)
        return
      }

      list.classList.add(styles.stacked)
      let offset = 12
      let stackBottom = 0
      const offsets = cards.map((card, index) => {
        const top = offset
        const cardStyle = window.getComputedStyle(card)
        stackBottom = Math.max(stackBottom, top + card.offsetHeight)
        // Leave the whole title and icon exposed, including wrapped headings.
        offset +=
          Number.parseFloat(cardStyle.borderTopWidth) +
          Number.parseFloat(cardStyle.paddingTop) +
          Math.max(titles[index].offsetHeight, icons[index].offsetHeight) +
          Number.parseFloat(cardStyle.rowGap)
        return top
      })
      const buttonClearance = Number.parseFloat(window.getComputedStyle(list, '::after').height)

      // A regular list stays readable in landscape or with enlarged text.
      if (stackBottom + buttonClearance > window.innerHeight) {
        list.classList.remove(styles.stacked)
        return
      }

      list.style.setProperty(
        '--stack-rows',
        `${cards.map((card) => `${card.getBoundingClientRect().height}px`).join(' ')} auto`,
      )
      slots.forEach((slot, index) => {
        slot.style.setProperty('--stack-top', `${offsets[index]}px`)
        slot.style.setProperty('--stack-order', String(index + 1))
        // Give every sticky slot the same bottom boundary so the stack exits together.
        slot.style.setProperty(
          '--stack-tail',
          `${stackBottom - offsets[index] - cards[index].offsetHeight}px`,
        )
      })
    }

    const requestUpdate = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(updateStack)
    }
    const observer = new ResizeObserver(requestUpdate)
    cards.forEach((card) => observer.observe(card))
    titles.forEach((title) => observer.observe(title))
    requestUpdate()
    window.addEventListener('resize', requestUpdate)
    mobile.addEventListener('change', requestUpdate)
    reducedMotion.addEventListener('change', requestUpdate)

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', requestUpdate)
      mobile.removeEventListener('change', requestUpdate)
      reducedMotion.removeEventListener('change', requestUpdate)
    }
  }, [])

  useEffect(() => {
    const list = listRef.current
    if (!list || !('IntersectionObserver' in window)) return

    const desktop = window.matchMedia('(min-width: 768px)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const items = Array.from(list.querySelectorAll<HTMLElement>(`.${styles.revealSlot}`))
    let observer: IntersectionObserver | undefined

    const updateAnimation = () => {
      observer?.disconnect()
      list.classList.remove(styles.animated)
      items.forEach((item) => item.classList.remove(styles.visible))
      if (!desktop.matches || reducedMotion.matches) return

      list.classList.add(styles.animated)
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            entry.target.classList.add(styles.visible)
            observer?.unobserve(entry.target)
          })
        },
        { threshold: 0.2, rootMargin: '0px 0px -6% 0px' },
      )
      items.forEach((item) => observer?.observe(item))
    }

    updateAnimation()
    desktop.addEventListener('change', updateAnimation)
    reducedMotion.addEventListener('change', updateAnimation)

    return () => {
      observer?.disconnect()
      desktop.removeEventListener('change', updateAnimation)
      reducedMotion.removeEventListener('change', updateAnimation)
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const heading = headingRef.current
    if (!section || !heading) return

    const desktop = window.matchMedia('(min-width: 768px)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const updateHeading = () => {
      frame = 0
      if (!desktop.matches || reducedMotion.matches) {
        heading.style.removeProperty('--heading-shift')
        return
      }

      const bounds = section.getBoundingClientRect()
      const travel = Math.min(48, window.innerHeight * 0.06)
      const scrollRange = Math.max(1, bounds.height - window.innerHeight * 0.35)
      const progress = Math.min(1, Math.max(0, -bounds.top / scrollRange))
      const currentShift = Number.parseFloat(heading.style.getPropertyValue('--heading-shift')) || 0
      const headingBottom = heading.getBoundingClientRect().bottom - currentShift
      const availableSpace = Math.max(0, bounds.bottom - headingBottom - 32)
      const shift = Math.min(progress * travel, availableSpace)
      heading.style.setProperty('--heading-shift', `${Math.round(shift)}px`)
    }

    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateHeading)
    }

    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    desktop.addEventListener('change', requestUpdate)
    reducedMotion.addEventListener('change', requestUpdate)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      desktop.removeEventListener('change', requestUpdate)
      reducedMotion.removeEventListener('change', requestUpdate)
    }
  }, [])

  return (
    <section
      className={styles.root}
      id="benefits"
      aria-labelledby="development-benefits-title"
      ref={sectionRef}
    >
      <div className={styles.inner}>
        <div className={styles.heading} ref={headingRef}>
          <h2 id="development-benefits-title">
            <DevelopmentRevealText>Что вы получаете</DevelopmentRevealText>
          </h2>
        </div>

        <div className={styles.grid} ref={listRef}>
          {benefits.map((benefit) => (
            <div className={styles.revealSlot} key={benefit.title}>
              <article className={styles.item}>
                <span className={styles.iconTile} aria-hidden="true">
                  <svg className={styles.icon} viewBox="70 20 280 260" focusable="false">
                    {benefit.icon}
                  </svg>
                </span>
                <div className={styles.itemCopy}>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
