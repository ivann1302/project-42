import { expect, test, type Locator, type Page } from '@playwright/test'

function mobileConsultation(page: Page) {
  return page.locator('button[data-development-mobile-cta], [data-development-mobile-cta] button')
}

async function heroBottom(page: Page) {
  return page.locator('#top').evaluate((element) => {
    return element.getBoundingClientRect().bottom + window.scrollY
  })
}

async function scrollTo(page: Page, top: number) {
  await page.evaluate((position) => window.scrollTo({ top: position, behavior: 'instant' }), top)
}

test('mobile consultation appears after the hero, restores focus, and leaves footer links clear', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/razrabotka')
  const consultation = mobileConsultation(page)
  await expect(consultation).toBeHidden()

  const endOfHero = await heroBottom(page)
  await scrollTo(page, endOfHero - 24)
  await expect(consultation).toBeHidden()
  await scrollTo(page, endOfHero + 24)
  await expect(consultation).toBeVisible()
  await expect(consultation).toBeInViewport({ ratio: 1 })
  await expect(consultation).toHaveAccessibleName('Получить консультацию')

  await consultation.click()
  const dialog = page.getByRole('dialog', { name: 'Получить консультацию', exact: true })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByLabel('Имя *', { exact: true })).toBeVisible()
  await expect(consultation).toBeHidden()
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
  const close = dialog.getByRole('button', { name: 'Закрыть', exact: true })
  await close.focus()
  await page.keyboard.press('Shift+Tab')
  await expect(dialog.getByRole('button', { name: 'Отправить заявку', exact: true })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(close).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(consultation).toBeVisible()
  await expect(consultation).toBeFocused()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')

  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
  )
  const footer = page.locator('#footer')
  await expect(consultation).toBeInViewport({ ratio: 1 })
  for (const link of await footer.getByRole('link').all()) {
    await expect(link).toBeInViewport({ ratio: 1 })
    await expect
      .poll(async () => {
        const linkBounds = await link.boundingBox()
        const buttonBounds = await consultation.boundingBox()
        if (!linkBounds || !buttonBounds) return Infinity
        return linkBounds.y + linkBounds.height - buttonBounds.y
      })
      .toBeLessThanOrEqual(0)
  }

  await scrollTo(page, endOfHero)
  await expect(consultation).toBeHidden()
  await scrollTo(page, endOfHero - 24)
  await expect(consultation).toBeHidden()
  await scrollTo(page, 0)
  await expect(consultation).toBeHidden()
})

test('mobile navigation suppresses the fixed consultation button until the menu closes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/razrabotka')
  const consultation = mobileConsultation(page)
  const endOfHero = await heroBottom(page)
  await page.getByRole('button', { name: 'Открыть меню', exact: true }).click()
  const menu = page.getByRole('dialog', { name: 'Меню', exact: true })
  await expect(menu).toBeVisible()

  // A scroll or restored position must not reveal the CTA above the open dialog.
  await scrollTo(page, endOfHero + 24)
  await expect(consultation).toBeHidden()
  await menu.getByRole('link', { name: 'Стоимость', exact: true }).click()
  await expect(menu).toBeHidden()
  await expect(consultation).toBeVisible()
})

test('the fixed consultation button is limited to the mobile breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/razrabotka')
  const consultation = mobileConsultation(page)
  await scrollTo(page, (await heroBottom(page)) + 24)
  await expect(consultation).toBeHidden()

  await page.setViewportSize({ width: 767, height: 900 })
  await scrollTo(page, (await heroBottom(page)) + 24)
  await expect(consultation).toBeVisible()
  await page.setViewportSize({ width: 768, height: 900 })
  await expect(consultation).toBeHidden()
})

async function expectFaqSideContained(side: Locator) {
  await expect
    .poll(() =>
      side.evaluate((element) => {
        const inner = element.parentElement!
        return element.getBoundingClientRect().bottom - inner.getBoundingClientRect().bottom
      }),
    )
    .toBeLessThanOrEqual(1)
}

async function checkFaqScrollPositions(page: Page, side: Locator) {
  for (const progress of [0, 0.5, 1]) {
    const top = await page.locator('#faq').evaluate((section, fraction) => {
      const bounds = section.getBoundingClientRect()
      return window.scrollY + bounds.top + bounds.height * fraction - window.innerHeight * 0.35
    }, progress)
    await scrollTo(page, top)
    await expectFaqSideContained(side)
  }
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
  )
  await expectFaqSideContained(side)
}

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
]) {
  test(`FAQ title and coin stay within the section while scrolling and resizing answers at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/razrabotka')
    const faq = page.locator('#faq')
    const side = page.locator('#development-faq-title').locator('..')
    await checkFaqScrollPositions(page, side)

    const questions = [
      faq.getByRole('button', { name: 'Что входит в цену?', exact: true }),
      faq.getByRole('button', { name: 'Что оплачивается после запуска?', exact: true }),
    ]
    for (const expanded of [true, false]) {
      for (const question of questions) {
        await question.click()
        await expect(question).toHaveAttribute('aria-expanded', String(expanded))
        const answerId = await question.getAttribute('aria-controls')
        if (!answerId) throw new Error('The FAQ question must reference its answer')
        await page
          .locator(`#${answerId}`)
          .evaluate((answer) =>
            Promise.allSettled(answer.getAnimations().map((animation) => animation.finished)),
          )
        await expectFaqSideContained(side)
      }
      await checkFaqScrollPositions(page, side)
    }
  })
}
