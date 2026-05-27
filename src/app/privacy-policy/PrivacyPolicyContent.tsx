'use client'

import { Container } from '@/shared/ui'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import styles from './privacy-policy.module.scss'

const collectedData = [
  'Имя',
  'Никнейм в Telegram',
  'Номер телефона',
  'Сфера деятельности',
  'Информация о наличии контента для проекта',
]

const analyticsData = [
  'IP-адрес',
  'Тип устройства и браузера',
  'Страницы посещения',
  'Источники перехода',
  'Поведение пользователя на сайте',
]

const processingPurposes = [
  'Связи с пользователем',
  'Обработки заявки',
  'Консультации по услугам',
  'Обсуждения проекта',
  'Предоставления информации об услугах студии',
  'Улучшения качества сайта и пользовательского опыта',
  'Соблюдения требований законодательства Российской Федерации',
]

const userRights = [
  'Получить информацию о своих персональных данных',
  'Потребовать уточнения, блокировки или удаления данных',
  'Отозвать согласие на обработку персональных данных',
  'Обратиться с вопросами, связанными с обработкой данных',
]

export function PrivacyPolicyContent() {
  return (
    <>
      <Header />
      <main className={styles.root}>
        <Container className={styles.inner}>
          <article className={styles.article} aria-labelledby="privacy-policy-title">
            <header className={styles.header}>
              <p className={styles.eyebrow}>Правовая информация</p>
              <h1 id="privacy-policy-title" className={styles.title}>
                Политика конфиденциальности
              </h1>
              <p className={styles.updated}>
                Дата последнего обновления: <time dateTime="2026-05-27">27.05.2026</time>
              </p>
            </header>

            <div className={styles.content}>
              <p className={styles.lead}>
                Настоящая Политика конфиденциальности описывает, как Нарчук Иван Валериевич
                (самозанятый, ИНН 300103507979, далее — «Исполнитель») собирает, использует и
                защищает персональные данные пользователей сайта Project 42.
              </p>

              <section className={styles.section}>
                <h2>1. Какие данные собираются</h2>
                <p>При заполнении формы заявки на сайте могут собираться следующие данные:</p>
                <ul>
                  {collectedData.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>
                  Также сайт автоматически собирает технические данные через сервис Яндекс Метрика:
                </p>
                <ul>
                  {analyticsData.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>Данные аналитики собираются в обезличенном виде.</p>
              </section>

              <section className={styles.section}>
                <h2>2. Цели обработки персональных данных</h2>
                <p>Персональные данные используются для:</p>
                <ul>
                  {processingPurposes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className={styles.section}>
                <h2>3. Правовое основание обработки данных</h2>
                <p>
                  Обработка персональных данных осуществляется на основании согласия пользователя в
                  соответствии со статьёй 9 Федерального закона №152-ФЗ «О персональных данных».
                </p>
                <p>
                  Отправляя форму на сайте, пользователь выражает согласие на обработку указанных
                  данных.
                </p>
              </section>

              <section className={styles.section}>
                <h2>4. Хранение и передача данных</h2>
                <p>Персональные данные не передаются третьим лицам в коммерческих целях.</p>
                <p>
                  Данные, отправленные через формы сайта, передаются Исполнителю через Telegram Bot
                  API и используются исключительно для связи с пользователем и обработки заявки.
                </p>
                <p>
                  Аналитические данные обрабатываются сервисом Яндекс Метрика в соответствии с
                  политикой конфиденциальности Яндекса.
                </p>
              </section>

              <section className={styles.section}>
                <h2>5. Права пользователя</h2>
                <p>Пользователь вправе:</p>
                <ul>
                  {userRights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>
                  Для этого пользователь может связаться с Исполнителем по email:{' '}
                  <a href="mailto:project42studio@gmail.com">project42studio@gmail.com</a>
                </p>
              </section>

              <section className={styles.section}>
                <h2>6. Cookies</h2>
                <p>Сайт использует cookies исключительно для аналитики и улучшения работы сайта.</p>
                <p>
                  Пользователь может отключить cookies в настройках браузера, однако это может
                  повлиять на корректность работы отдельных функций сайта.
                </p>
              </section>

              <section className={styles.section}>
                <h2>7. Изменения политики</h2>
                <p>Исполнитель вправе вносить изменения в настоящую Политику конфиденциальности.</p>
                <p>Актуальная версия документа всегда доступна на данной странице сайта.</p>
              </section>

              <section className={styles.section}>
                <h2>8. Контактная информация</h2>
                <address className={styles.contacts}>
                  <span>Нарчук Иван Валериевич</span>
                  <span>Самозанятый · ИНН 300103507979</span>
                  <span>
                    Email: <a href="mailto:project42studio@gmail.com">project42studio@gmail.com</a>
                  </span>
                  <span>
                    Телефон: <a href="tel:+79955571589">+7 (995) 557-15-89</a>
                  </span>
                  <span>г. Москва</span>
                </address>
              </section>
            </div>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  )
}
