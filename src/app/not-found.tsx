import { Button, Container, Icon } from '@/shared/ui'
import { Header } from '@/widgets/Header'
import { RazrabotkaFooter } from '@/widgets/RazrabotkaPage'
import styles from './not-found.module.scss'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={styles.root}>
        <Container className={styles.inner}>
          <section className={styles.hero} aria-labelledby="not-found-title">
            <p className={styles.code}>404</p>
            <h1 id="not-found-title" className={styles.title}>
              Страница не найдена
            </h1>
            <p className={styles.text}>Возможно, адрес изменился или ссылка устарела.</p>
            <div className={styles.actions}>
              <Button href="/" size="lg">
                На главную
                <Icon name="arrowRight" size={18} />
              </Button>
              <Button href="/portfolio" variant="ghost" size="lg">
                Портфолио
              </Button>
            </div>
          </section>
        </Container>
      </main>
      <RazrabotkaFooter />
    </>
  )
}
