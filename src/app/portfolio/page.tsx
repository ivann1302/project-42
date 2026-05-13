import type { Metadata } from 'next'
import { Header } from '@/widgets/Header'
import { PortfolioPage } from '@/widgets/PortfolioPage'
import { Footer } from '@/widgets/Footer'
import { siteConfig } from '@/shared/config/seo'
import { MobileConsultationButton } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'Портфолио',
  description: `Проекты веб-студии ${siteConfig.name} — корпоративные сайты, лендинги, интернет-магазины.`,
}

export default function PortfolioRoute() {
  return (
    <>
      <Header />
      <main>
        <PortfolioPage />
      </main>
      <Footer />
      <MobileConsultationButton />
    </>
  )
}
