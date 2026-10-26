import { DevelopmentRevealText } from './DevelopmentRevealText'
import styles from './DevelopmentIntro.module.scss'

export function DevelopmentIntro() {
  return (
    <section className={styles.root} aria-labelledby="development-intro-title">
      <div className={styles.inner}>
        <h2 className={styles.title} id="development-intro-title">
          <DevelopmentRevealText>
            Понятно покажем <span className={styles.accent}>преимущества</span> вашего бизнеса
          </DevelopmentRevealText>
        </h2>
        <p className={styles.description} data-development-reveal="rise" data-development-order="1">
          Разберёмся в ваших услугах и сильных сторонах. Выстроим страницы и тексты так, чтобы
          посетитель быстро понял, чем вы полезны и почему стоит обратиться к вам.
        </p>
      </div>
    </section>
  )
}
