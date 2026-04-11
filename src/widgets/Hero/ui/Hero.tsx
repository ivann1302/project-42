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
          Результат быстрее, ценник ниже, качество выше —
          <span className={styles.aiLabel}>AI-студия</span>
          &nbsp;полного цикла
        </h1>
        <p className={styles.sub}>
          Налаженные AI-процессы и профи,
          <br />
          которые знают, как создавать и продвигать качественные сайты.
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
