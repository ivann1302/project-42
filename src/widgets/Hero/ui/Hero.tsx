import { Button, Container, StarField } from '@/shared/ui'
import styles from './Hero.module.scss'

export function Hero() {
  return (
    <section className={styles.root} id="hero">
      <StarField />
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />
      <div className={styles.blob3} aria-hidden="true" />
      <Container className={styles.inner}>
        <span className={styles.eyebrow}>— Project 42</span>
        <h1 className={styles.heading}>
          <span className={styles.aiLabel}>AI-студия</span>
          <br />
          полного цикла разработки и сопровождения сайтов
        </h1>
        <p className={styles.sub}>
          Решаем задачи бизнеса.
          <br />
          Остаёмся рядом, когда задачи меняются.
        </p>
        <div className={styles.actions}>
          <Button size="lg" href="#cta">
            Обсудить проект
          </Button>
          <Button size="lg" variant="ghost" href="#portfolio">
            Посмотреть работы
          </Button>
        </div>
      </Container>
    </section>
  )
}
