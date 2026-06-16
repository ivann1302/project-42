import type { Metadata } from 'next'
import styles from './thank-you.module.scss'

export const metadata: Metadata = {
  title: 'Спасибо за заявку',
  description: 'Спасибо. Мы скоро свяжемся с Вами.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ThankYouPage() {
  return (
    <main className={styles.root}>
      <h1 className={styles.title}>Спасибо. Мы скоро свяжемся с Вами</h1>
    </main>
  )
}
