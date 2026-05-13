import type { Metadata } from 'next'
import { Button, Container, Icon } from '@/shared/ui'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import styles from './thank-you.module.scss'

export const metadata: Metadata = {
  title: 'Спасибо за заявку',
  description: 'Спасибо за заявку на консультацию. Мы свяжемся с вами в ближайшее время.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main className={styles.root}>
        <Container className={styles.inner}>
          <section className={styles.hero} aria-labelledby="thank-you-title">
            <p className={styles.eyebrow}>Заявка отправлена</p>
            <h1 id="thank-you-title" className={styles.title}>
              Спасибо, что оставили заявку на консультацию! В ближайшее время свяжемся с Вами
            </h1>
            <Button href="/razrabotka-sayta" size="lg" className={styles.action}>
              На главную
              <Icon name="arrowRight" size={18} />
            </Button>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  )
}
