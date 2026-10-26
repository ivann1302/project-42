'use client'

import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { ShinyButton } from '@/components/ui/ShinyButton'
import { Modal } from '@/shared/ui/Modal/Modal'
import { DevelopmentCoin } from './DevelopmentCoin'
import { DevelopmentRevealText } from './DevelopmentRevealText'
import contactModalStyles from './DevelopmentContactModal.module.scss'
import styles from './DevelopmentPricing.module.scss'

const ContactForm = dynamic(() =>
  import('@/features/ContactForm/ui/ContactForm').then((module) => module.ContactForm),
)

const services = [
  {
    title: 'Лендинг',
    description: 'Для одной услуги или продукта, когда важно быстро получать заявки.',
    features: ['Одна цельная страница', 'Акцент на вашем предложении', 'Форма заявки'],
    price: '25 000',
  },
  {
    title: 'Корпоративный сайт',
    description: 'Для компании с несколькими направлениями и услугами.',
    features: ['Многостраничная структура', 'Услуги, компания и кейсы', 'Формы обращения'],
    price: '60 000',
  },
  {
    title: 'Интернет-магазин',
    description: 'Для продажи товаров с удобным выбором и оформлением заказа.',
    features: ['Каталог и карточки товаров', 'Корзина и оформление заказа', 'Мобильная версия'],
    price: '90 000',
  },
] as const

export function DevelopmentPricing() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const lastButtonRef = useRef<HTMLButtonElement>(null)

  const closeContact = () => {
    setSelectedService(null)
    lastButtonRef.current?.focus()
  }

  return (
    <>
      <section className={styles.root} id="pricing" aria-labelledby="development-pricing-title">
        <div className={styles.inner}>
          <div className={styles.heading}>
            <h2 id="development-pricing-title">
              <DevelopmentRevealText>Какой сайт вам нужен?</DevelopmentRevealText>
            </h2>
            <DevelopmentCoin className={styles.coinGraphic} />
          </div>

          <div className={styles.cards}>
            {services.map((service, index) => (
              <article
                className={styles.card}
                key={service.title}
                data-development-reveal="rise"
                data-development-order={index}
              >
                <div>
                  <h3>{service.title}</h3>
                  <p className={styles.description}>{service.description}</p>
                </div>
                <ul className={styles.features}>
                  {service.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <div className={styles.cardBottom}>
                  <p className={styles.price}>
                    <span>от</span> {service.price} ₽
                  </p>
                  <ShinyButton
                    className={styles.button}
                    label="Оставить заявку"
                    onClick={(event) => {
                      lastButtonRef.current = event.currentTarget
                      setSelectedService(service.title)
                    }}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Modal
        open={selectedService !== null}
        onClose={closeContact}
        title="Оставить заявку"
        className={contactModalStyles.modal}
      >
        <ContactForm initialService={selectedService ?? undefined} onSuccess={closeContact} />
      </Modal>
    </>
  )
}
