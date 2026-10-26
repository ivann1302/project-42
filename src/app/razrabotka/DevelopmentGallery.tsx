'use client'

import { CardStack } from '@/components/ui/CardStack'
import { DevelopmentRevealText } from './DevelopmentRevealText'
import styles from './DevelopmentGallery.module.scss'

const projects = [
  {
    id: 'rosa',
    imageSrc: '/images/razrabotka/cases/rosa-cover.webp',
    title: 'ROSA',
    description: 'Корпоративный сайт строительной компании',
    caption:
      'Сайт строительной компании: услуги, примеры работ и удобная заявка. Обращения поступают в Telegram.',
  },
  {
    id: 'truetell',
    imageSrc: '/images/razrabotka/cases/truetell-current-cover.webp',
    title: 'TrueTell',
    description: 'Сайт приложений для CRM и автоматизации бизнеса',
    caption:
      'Понятно объясняем возможности приложений для CRM и автоматизации бизнеса. Помогаем посетителю выбрать решение под свою задачу.',
  },
  {
    id: 'vseryadom',
    imageSrc: '/images/razrabotka/cases/vseryadom-cover.webp',
    title: 'Всё рядом',
    description: 'Сервис аренды вещей и инструментов',
    caption:
      'Знакомим с сервисом аренды вещей и инструментов. Показываем, как взять нужное рядом или заработать на своих вещах.',
  },
  {
    id: 'ziptron',
    imageSrc: '/images/razrabotka/cases/ziptron-cover.webp',
    title: 'Ziptron',
    description: 'Промо-сайт аренды электровелосипедов',
    caption:
      'Объясняем, как арендовать электровелосипед. Проводим посетителя от знакомства с сервисом до скачивания приложения.',
  },
  {
    id: 'alageum',
    imageSrc: '/images/razrabotka/cases/alageum-cover.webp',
    title: 'Торговый Дом Алагеум',
    description: 'Сайт поставщика трансформаторов и подстанционного оборудования',
    caption:
      'Представляем трансформаторное и подстанционное оборудование. Помогаем перейти от знакомства с продукцией к запросу предложения.',
  },
  {
    id: 'russkiy-zodchiy',
    imageSrc: '/images/razrabotka/cases/rrr-cover.webp',
    title: 'Русский зодчий',
    description: 'Лендинг с квизом и калькулятором ремонта',
    caption:
      'Лендинг ремонта квартир с квизом и калькулятором. Посетитель может оценить стоимость и оставить заявку.',
  },
  {
    id: 'aks-fit',
    imageSrc: '/images/razrabotka/cases/aks-fit-cover.webp',
    title: 'AKS-FIT',
    description: 'Сайт-визитка фитнес-проекта',
    caption:
      'Знакомим с фитнес-проектом, программой и форматом занятий. Даём понятный следующий шаг — записаться.',
  },
]

export function DevelopmentGallery() {
  return (
    <section className={styles.root} id="projects" aria-labelledby="development-gallery-title">
      <div className={styles.heading}>
        <h2 id="development-gallery-title">
          <DevelopmentRevealText>Наши работы</DevelopmentRevealText>
        </h2>
        <p data-development-reveal="rise" data-development-order="1">
          Листайте проекты и выбирайте тот, который хочется рассмотреть ближе.
        </p>
      </div>
      <div className={styles.carousel} data-development-reveal="rise" data-development-order="1">
        <CardStack
          items={projects}
          mobileAspectRatio={3 / 2}
          autoAdvance
          intervalMs={3500}
          pauseOnHover
          showDots
        />
      </div>
    </section>
  )
}
