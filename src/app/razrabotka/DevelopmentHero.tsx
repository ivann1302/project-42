'use client'

import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { ShinyButton } from '@/components/ui/ShinyButton'
import { Modal } from '@/shared/ui/Modal/Modal'
import { DevelopmentRevealText } from './DevelopmentRevealText'
import contactModalStyles from './DevelopmentContactModal.module.scss'
import styles from './page.module.scss'

const ContactForm = dynamic(() =>
  import('@/features/ContactForm/ui/ContactForm').then((module) => module.ContactForm),
)

export function DevelopmentHero() {
  const consultationRef = useRef<HTMLButtonElement>(null)
  const [contactOpen, setContactOpen] = useState(false)

  const closeContact = () => {
    setContactOpen(false)
    consultationRef.current?.focus()
  }

  return (
    <>
      <div className={styles.content}>
        <div className={styles.copy}>
          <h1 className={styles.title}>
            <DevelopmentRevealText entrance>
              Разработка сайтов под ключ
              <br />
              без предоплаты
            </DevelopmentRevealText>
          </h1>
          <p
            className={styles.description}
            data-development-enter="rise"
            data-development-order="1"
          >
            От структуры и дизайна до разработки и запуска. Создаём сайт, который представляет ваш
            бизнес и помогает получать заявки.
          </p>
          <div data-development-enter="rise" data-development-order="2">
            <ShinyButton
              ref={consultationRef}
              className={styles.consultation}
              label="Получить консультацию"
              onClick={() => setContactOpen(true)}
            />
          </div>
        </div>
      </div>

      <Modal
        open={contactOpen}
        onClose={closeContact}
        title="Получить консультацию"
        className={contactModalStyles.modal}
      >
        <ContactForm stayOnPage />
      </Modal>
    </>
  )
}
