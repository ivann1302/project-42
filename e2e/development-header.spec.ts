import { expect, test } from '@playwright/test'

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 822, height: 860 },
  { width: 390, height: 844 },
]) {
  test(`development header at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/razrabotka')

    const header = page.locator('#top header')
    const trigger = page.getByRole('button', { name: 'Открыть меню' })
    const menu = page.getByRole('dialog', { name: 'Меню', exact: true })

    await expect(menu).toBeHidden()

    if (viewport.width >= 768) {
      await expect(header).toHaveCSS('mix-blend-mode', 'difference')
      await expect(trigger).toBeHidden()
      const navigation = page.getByRole('navigation', { name: 'Разделы страницы' })
      await expect(navigation.getByText('Наши работы', { exact: true })).toBeVisible()
      await expect(navigation.getByText('Преимущества', { exact: true })).toBeVisible()
      await expect(navigation.getByText('Стоимость', { exact: true })).toBeVisible()
      const logoBounds = await header.getByRole('link', { name: /project\s*42/i }).boundingBox()
      const navigationBounds = await navigation.boundingBox()
      expect(logoBounds).not.toBeNull()
      expect(navigationBounds).not.toBeNull()
      expect(logoBounds!.x + logoBounds!.width).toBeLessThan(navigationBounds!.x)
      return
    }

    await expect(header).toHaveCSS('mix-blend-mode', 'normal')
    await trigger.click()
    await expect(menu).toBeVisible()
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
    await expect(menu.getByRole('button', { name: 'Закрыть меню' })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(menu.getByRole('link', { name: 'Наши работы', exact: true })).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(menu.getByRole('button', { name: 'Закрыть меню' })).toBeFocused()
    await expect(menu.getByText('Наши работы', { exact: true })).toBeVisible()
    await expect(menu.getByText('Преимущества', { exact: true })).toBeVisible()
    await expect(menu.getByText('Стоимость', { exact: true })).toBeVisible()

    await expect
      .poll(async () => {
        const bounds = await menu.boundingBox()
        return bounds
          ? {
              x: Math.round(bounds.x),
              y: Math.round(bounds.y),
              width: bounds.width,
              height: bounds.height,
            }
          : null
      })
      .toEqual({ x: 0, y: 0, ...viewport })

    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')

    await trigger.click()
    await expect(menu).toBeVisible()
    await menu.getByRole('button', { name: 'Закрыть меню' }).click()
    await expect(menu).toBeHidden()
    await expect(trigger).toBeFocused()

    const dimensions = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.querySelector('main section')?.getBoundingClientRect().height,
    }))
    expect(dimensions).toEqual(viewport)
  })
}

test('closes the mobile menu when switching to desktop', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/razrabotka')
  await page.getByRole('button', { name: 'Открыть меню' }).click()
  const menu = page.getByRole('dialog', { name: 'Меню', exact: true })
  await expect(menu).toBeVisible()

  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(menu).toBeHidden()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  await expect(page.getByRole('button', { name: 'Открыть меню' })).toBeHidden()
})

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`header scroll motion reverses without changing layout at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/razrabotka')
    const bar = page.locator('#top header > div').first()
    const transform = () =>
      bar.evaluate((element) => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform)
        return { y: matrix.m42, scale: matrix.m11 }
      })
    const originalHeight = await page.locator('#top').evaluate((element) => element.clientHeight)

    await page.evaluate(() => window.scrollTo({ top: 320, behavior: 'instant' }))
    await expect.poll(async () => (await transform()).y).toBeLessThan(-1)
    expect((await transform()).scale).toBeLessThan(1)
    expect(await page.locator('#top').evaluate((element) => element.clientHeight)).toBe(
      originalHeight,
    )

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await expect.poll(async () => Math.abs((await transform()).y)).toBeLessThan(0.1)
    expect((await transform()).scale).toBeCloseTo(1, 3)
    await expect(
      page.locator('#top header').getByRole('link', { name: /project\s*42/i }),
    ).toBeInViewport({ ratio: 1 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true)
  })
}

test('reduced motion removes the header scroll transform even when changed during a visit', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/razrabotka')
  const header = page.locator('#top header')
  const bar = header.locator('> div').first()

  await page.evaluate(() => window.scrollTo({ top: 320, behavior: 'instant' }))
  await expect
    .poll(() =>
      bar.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42),
    )
    .toBeLessThan(-1)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(bar).toHaveCSS('transform', 'none')
  await page.evaluate(() => window.scrollTo({ top: 640, behavior: 'instant' }))
  await expect(bar).toHaveCSS('transform', 'none')
  await expect(header).toHaveCSS('mix-blend-mode', 'difference')
})
