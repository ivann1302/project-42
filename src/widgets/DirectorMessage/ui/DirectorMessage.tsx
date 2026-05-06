import Image from 'next/image'
import { Container, GlowBlob, ScrollReveal, StarField } from '@/shared/ui'
import styles from './DirectorMessage.module.scss'

export function DirectorMessage() {
  return (
    <ScrollReveal as="section" className={styles.root} id="director" threshold={0.2}>
      <StarField />
      <GlowBlob color="blue" size={700} x={60} y={50} />
      <Container>
        <div className={styles.card}>
          <span className={styles.quoteMark} aria-hidden="true">
            &ldquo;
          </span>

          <div className={styles.body}>
            <p className={styles.paragraph}>Привет, это Иван - основатель Project 42.</p>
            <p className={styles.paragraph}>
              Миссия нашей команды - делать сайты без раздутых команд, лишних посредников и размытых
              сроков. Мы небольшая студия, где живые люди работают с AI-инструментами. Это даёт
              скорость и цену, которую сложно повторить.
            </p>
            <p className={styles.paragraph}>
              За каждым проектом стою я лично. Мы не пропадаем после сдачи — остаёмся на связи,
              помогаем расти.
            </p>
            <p className={styles.paragraph}>
              Если у вас есть задача — напишите мне напрямую. Обсудим, чем мы можем помочь.
            </p>
          </div>

          <div className={styles.author}>
            <div className={styles.avatar} aria-hidden="true">
              <Image
                src="/images/chief-photo.webp"
                alt=""
                fill
                sizes="96px"
                className={styles.avatarImage}
                priority
              />
            </div>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>Иван</span>
              <span className={styles.authorRole}>Руководитель Project 42</span>
            </div>
          </div>
        </div>
      </Container>
    </ScrollReveal>
  )
}
