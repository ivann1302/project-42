import { RazrabotkaFooter } from '@/widgets/RazrabotkaPage'
import { Header } from '@/widgets/Header'
import { HomeHero } from './HomeHero'
import { HomeTrust } from './HomeTrust'
import styles from './page.module.scss'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <HomeHero />
        <HomeTrust />
      </main>
      <RazrabotkaFooter />
    </>
  )
}
