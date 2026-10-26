import { expect, test } from '@playwright/test'

test('opens the existing consultation form from the development hero', async ({ page }) => {
  await page.goto('/razrabotka')
  const consultation = page
    .getByRole('region', { name: 'Разработка — главный экран', exact: true })
    .getByRole('button', { name: 'Получить консультацию', exact: true })

  await consultation.click()
  const form = page.getByRole('dialog', { name: 'Получить консультацию', exact: true })
  await expect(form).toBeVisible()
  await expect(form.getByPlaceholder('Иван Иванов')).toBeVisible()
  await expect(form.getByLabel('Имя *', { exact: true })).toBeVisible()
  expect(await form.getByLabel('Имя *', { exact: true }).getAttribute('id')).not.toBe(
    await page.locator('#cta').getByLabel('Имя *', { exact: true }).getAttribute('id'),
  )
  await expect(form.getByRole('button', { name: 'Отправить заявку' })).toBeVisible()
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')

  await page.keyboard.press('Escape')
  await expect(form).toBeHidden()
  await expect(consultation).toBeFocused()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
})

test('accepts the first pointer click while the hero button is still appearing', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/razrabotka')
  // Hold a visible frame of the entrance to make an early pointer interaction reproducible.
  await page
    .locator('#top [data-development-enter="rise"]')
    .last()
    .evaluate((element) => {
      const entrance = element.getAnimations()[0]
      const timing = entrance.effect!.getTiming()
      entrance.pause()
      entrance.currentTime = Number(timing.delay) + Number(timing.duration) * 0.1
    })
  await page
    .locator('#top')
    .getByRole('button', { name: 'Получить консультацию', exact: true })
    .click()
  await expect(
    page.getByRole('dialog', { name: 'Получить консультацию', exact: true }),
  ).toBeVisible()
})
