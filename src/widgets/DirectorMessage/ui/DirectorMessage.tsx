import Image from 'next/image'
import { Container, GlowBlob, ScrollReveal, StarField } from '@/shared/ui'
import styles from './DirectorMessage.module.scss'

type Props = {
  id?: string
  paragraphs?: string[]
  authorName?: string
  authorRole?: string
  imagePriority?: boolean
}

const defaultParagraphs = [
  'Привет, это Иван - основатель Project 42.',
  'Миссия нашей команды - делать сайты без раздутых команд, лишних посредников и размытых сроков. Мы небольшая студия, где живые люди работают с AI-инструментами. Это даёт скорость и цену, которую сложно повторить.',
  'За каждым проектом стою я лично. Мы не пропадаем после сдачи — остаёмся на связи, помогаем расти.',
  'Если у вас есть задача — напишите мне напрямую. Обсудим, чем мы можем помочь.',
]

export function DirectorMessage({
  id = 'director',
  paragraphs = defaultParagraphs,
  authorName = 'Иван',
  authorRole = 'Руководитель Project 42',
  imagePriority = true,
}: Props) {
  return (
    <ScrollReveal as="section" className={styles.root} id={id} threshold={0.2}>
      <StarField />
      <GlowBlob color="blue" size={700} x={60} y={50} />
      <Container>
        <div className={styles.card}>
          <span className={styles.quoteMark} aria-hidden="true">
            &ldquo;
          </span>

          <div className={styles.body}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className={styles.author}>
            <div className={styles.avatar} aria-hidden="true">
              <Image
                src="/images/chief-photo.webp"
                alt=""
                fill
                sizes="96px"
                className={styles.avatarImage}
                priority={imagePriority}
              />
            </div>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{authorName}</span>
              <span className={styles.authorRole}>{authorRole}</span>
            </div>
          </div>
        </div>
      </Container>
    </ScrollReveal>
  )
}
