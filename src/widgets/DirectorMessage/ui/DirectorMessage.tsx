'use client'

import { Container, GlowBlob, StarField } from '@/shared/ui'
import styles from './DirectorMessage.module.scss'

export function DirectorMessage() {
  return (
    <section className={styles.root} id="director">
      <StarField />
      <GlowBlob color="blue" size={700} x={60} y={50} />
      <Container>
        <div className={styles.card}>
          <span className={styles.quoteMark} aria-hidden="true">
            &ldquo;
          </span>

          <div className={styles.body}>
            <p className={styles.paragraph}>Привет, я Иван.</p>
            <p className={styles.paragraph}>
              Я основал Project&nbsp;42, потому что хотел делать сайты иначе — без раздутых команд,
              лишних посредников и размытых сроков. Мы небольшая студия, где живые люди работают с
              AI-инструментами. Это даёт скорость и цену, которую сложно повторить.
            </p>
            <p className={styles.paragraph}>
              За каждым проектом стою я лично. Мы не пропадаем после сдачи — остаёмся на связи,
              помогаем расти.
            </p>
            <p className={styles.paragraph}>
              Если у вас есть задача — напишите мне напрямую. Просто поговорим.
            </p>
          </div>

          <div className={styles.author}>
            <div className={styles.avatar} aria-hidden="true">
              И
            </div>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>Иван</span>
              <span className={styles.authorRole}>Руководитель Project 42</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
