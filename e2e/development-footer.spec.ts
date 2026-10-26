import { expect, test } from '@playwright/test'

test('returns to the hero from the simple mobile footer without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/razrabotka')
  const footer = page.getByRole('contentinfo')
  await footer.scrollIntoViewIfNeeded()
  await expect(footer.locator('canvas')).toHaveCount(0)
  await expect(footer.getByRole('link', { name: 'Наши работы', exact: true })).toHaveAttribute(
    'href',
    '/portfolio',
  )
  await expect(footer.getByRole('link', { name: 'Telegram', exact: true })).toHaveAttribute(
    'href',
    'https://t.me/ivann97n',
  )
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390)
  await footer.getByRole('link', { name: 'Project 42 — к началу страницы' }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  test(`reveals the ${viewport.name} footer with reversible scroll motion`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/razrabotka')
    const footer = page.locator('#footer')

    const halfwayScroll = await footer.evaluate((element) => {
      const wrapper = element.parentElement!
      const bounds = wrapper.getBoundingClientRect()
      return window.scrollY + bounds.top - window.innerHeight + bounds.height / 2
    })
    const shift = () =>
      footer.evaluate((element) => {
        const transform = getComputedStyle(element).transform
        return transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m42
      })

    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), halfwayScroll)
    await expect.poll(shift).toBeGreaterThan(1)

    await page.evaluate(() =>
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
    )
    await expect.poll(async () => Math.abs(await shift())).toBeLessThan(1)
    for (const link of await footer.getByRole('link').all()) {
      await expect(link).toBeInViewport({ ratio: 1 })
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true)
    await page.screenshot({ path: test.info().outputPath('footer.png') })

    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), halfwayScroll)
    await expect.poll(shift).toBeGreaterThan(1)
  })
}

test('keeps the footer static and accessible with reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/razrabotka')
  const footer = page.locator('#footer')
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
  )
  await expect(footer).toHaveCSS('transform', 'none')
  for (const link of await footer.getByRole('link').all()) {
    await expect(link).toBeInViewport({ ratio: 1 })
  }
})
