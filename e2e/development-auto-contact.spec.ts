import { expect, test, type Page } from '@playwright/test'

const prompt = (page: Page) => page.getByRole('dialog', { name: 'Обсудим проект?', exact: true })

async function openDevelopment(page: Page) {
  await page.clock.install()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/razrabotka')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(200)
}

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`contact prompt opens after 30 seconds and stays dismissed at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await openDevelopment(page)
    const trigger = page.locator('#top').getByRole('button', {
      name: 'Получить консультацию',
      exact: true,
    })
    await trigger.focus()
    await page.clock.fastForward(29_000)
    await expect(prompt(page)).toBeHidden()
    await page.clock.fastForward(1_100)
    await expect(prompt(page)).toBeVisible()
    await expect(prompt(page).getByLabel('Имя *', { exact: true })).toBeVisible()
    await expect(prompt(page).getByLabel('Телефон', { exact: true })).toBeVisible()
    await expect(prompt(page).getByRole('button', { name: 'Закрыть', exact: true })).toBeFocused()
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')

    await page.keyboard.press('Shift+Tab')
    await expect(
      prompt(page).getByRole('button', { name: 'Отправить заявку', exact: true }),
    ).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(prompt(page).getByRole('button', { name: 'Закрыть', exact: true })).toBeFocused()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
    await expect(prompt(page)).toHaveCSS('opacity', '1')
    await expect(prompt(page).locator(':scope > div')).toHaveCSS('opacity', '1')
    await page.screenshot({ path: test.info().outputPath(`auto-contact-${viewport.width}.png`) })
    await page.keyboard.press('Escape')
    await expect(prompt(page)).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
    await page.clock.fastForward(60_000)
    await expect(prompt(page)).toBeHidden()
    await page.reload()
    await page.waitForTimeout(200)
    await page.clock.fastForward(35_000)
    await expect(prompt(page)).toBeHidden()
  })
}

test('manual contact form suppresses the timed prompt for the visit', async ({ page }) => {
  await openDevelopment(page)
  await page.locator('#top').getByRole('button', { name: 'Получить консультацию' }).click()
  const manual = page.getByRole('dialog', { name: 'Получить консультацию', exact: true })
  await expect(manual.getByLabel('Имя *', { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(manual).toBeHidden()
  await page.clock.fastForward(35_000)
  await expect(prompt(page)).toBeHidden()
  await page.reload()
  await page.waitForTimeout(200)
  await page.clock.fastForward(35_000)
  await expect(prompt(page)).toBeHidden()
})

test('typing in the inline form is not interrupted', async ({ page }) => {
  await openDevelopment(page)
  const name = page.locator('#cta').getByLabel('Имя *', { exact: true })
  await name.fill('Проверка формы')
  await page.clock.fastForward(35_000)
  await expect(prompt(page)).toBeHidden()
  await expect(name).toHaveValue('Проверка формы')
  await expect(name).toBeFocused()
})

test('the timed prompt waits until the mobile menu closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openDevelopment(page)
  await page.getByRole('button', { name: 'Открыть меню', exact: true }).click()
  const menu = page.getByRole('dialog', { name: 'Меню', exact: true })
  await expect(menu).toBeVisible()
  await page.clock.fastForward(35_000)
  await expect(prompt(page)).toBeHidden()
  await expect(menu).toBeVisible()
  await menu.getByRole('button', { name: 'Закрыть меню', exact: true }).click()
  await expect(prompt(page)).toBeVisible()
  await expect(menu).toBeHidden()
  await page.keyboard.press('Escape')
  await expect(prompt(page)).toBeHidden()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
})

test('time in a hidden tab does not count toward the 30 seconds', async ({ page }) => {
  await openDevelopment(page)
  await page.clock.fastForward(10_000)
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await page.clock.fastForward(60_000)
  await expect(prompt(page)).toBeHidden()
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await page.clock.fastForward(18_000)
  await expect(prompt(page)).toBeHidden()
  await page.clock.fastForward(2_100)
  await expect(prompt(page)).toBeVisible()
})

test('the timed contact prompt is limited to the development page', async ({ page }) => {
  await openDevelopment(page)
  await page.goto('/')
  await page.waitForTimeout(200)
  await page.clock.fastForward(35_000)
  await expect(prompt(page)).toBeHidden()
})
