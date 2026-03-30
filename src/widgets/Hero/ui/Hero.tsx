import { Button, Container } from '@/shared/ui'
import styles from './Hero.module.scss'

export function Hero() {
  return (
    <section className={styles.root} id="hero">
      <div className={styles.glow} aria-hidden="true" />
      <Container className={styles.inner}>
        <span className={styles.eyebrow}>— Project 42</span>
        <h1 className={styles.heading}>
          Не ещё одна
          <br />
          веб-студия
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
