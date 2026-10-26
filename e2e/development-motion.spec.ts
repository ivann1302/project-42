import { expect, test } from '@playwright/test'

test('reveals offscreen content once and keeps the consultation form usable', async ({ page }) => {
  await page.goto('/razrabotka')
  const card = page.locator('#pricing article').first()
  await expect(card).toHaveAttribute('data-development-state', 'pending')
  await expect(card).toHaveCSS('opacity', '0')

  const heading = page.locator('#development-pricing-title [data-development-reveal]')
  await expect(heading.locator('> span')).not.toHaveCSS('transform', 'none')
  await heading.scrollIntoViewIfNeeded()
  await expect(heading.locator('> span')).toHaveCSS('transform', 'none')

  await card.scrollIntoViewIfNeeded()
  await expect(card).toHaveAttribute('data-development-state', 'revealed')
  await expect(card).toHaveCSS('opacity', '1')
  await expect(card).toHaveCSS('transform', 'none')

  await page.locator('#top').scrollIntoViewIfNeeded()
  await expect(card).toHaveAttribute('data-development-state', 'revealed')
  await expect(card).toHaveCSS('opacity', '1')
  await card.scrollIntoViewIfNeeded()
  await expect(card).toHaveCSS('transform', 'none')

  const name = page.locator('#cta').getByPlaceholder('Иван Иванов')
  await name.focus()
  await expect(name).toBeFocused()
  await expect(name.locator('xpath=ancestor::*[@data-development-reveal][1]')).toHaveCSS(
    'opacity',
    '1',
  )
  await name.fill('Иван')
  await expect(name).toHaveValue('Иван')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('reduced motion keeps headings and offscreen cards immediately visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/razrabotka')
  const heading = page.locator('h1 [data-development-enter="heading"] > span')
  await expect(heading).toHaveCSS('animation-name', 'none')
  await expect(heading).toHaveCSS('transform', 'none')
  await expect(page.locator('#pricing article').first()).toHaveCSS('opacity', '1')
  await expect(page.locator('[data-development-state="pending"]')).toHaveCount(0)
})

test('changing motion preference reveals content that is still waiting', async ({ page }) => {
  await page.goto('/razrabotka')
  const card = page.locator('#pricing article').first()
  await expect(card).toHaveAttribute('data-development-state', 'pending')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('[data-development-state="pending"]')).toHaveCount(0)
  await expect(card).toHaveCSS('opacity', '1')
  await expect(card).toHaveCSS('transform', 'none')
})

test('page content remains visible without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  const page = await context.newPage()
  await page.goto('/razrabotka')
  await expect(page.locator('#pricing article').first()).toHaveCSS('opacity', '1')
  await expect(page.locator('#development-faq-title')).toBeVisible()
  await context.close()
})
