import { ContactForm } from '@/features/ContactForm/ui/ContactForm'
import { DevelopmentRevealText } from './DevelopmentRevealText'
import styles from './DevelopmentCta.module.scss'

export function DevelopmentCta() {
  return (
    <section className={styles.root} id="cta" aria-labelledby="development-cta-title">
      <div className={styles.content}>
        <div className={styles.copy}>
          <h2 className={styles.title} id="development-cta-title">
            <DevelopmentRevealText>
              Обсудим <span className={styles.accent}>проект?</span>
            </DevelopmentRevealText>
          </h2>
          <p
            className={styles.description}
            data-development-reveal="rise"
            data-development-order="1"
          >
            Расскажите о задаче — поможем определить структуру, сроки и стоимость.
          </p>
        </div>
        <div className={styles.formPanel} data-development-reveal="rise" data-development-order="1">
          <p className={styles.hint}>
            Достаточно имени и телефона или email. Остальное — по желанию.
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
