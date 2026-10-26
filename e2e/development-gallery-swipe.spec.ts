import { expect, test } from '@playwright/test'

test.use({
  viewport: { width: 700, height: 900 },
  isMobile: true,
  hasTouch: true,
  launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE },
})

test.skip(({ browserName }) => browserName !== 'chromium', 'Continuous touch uses Chromium CDP')

test('a short swipe on the active gallery card advances a project on a mobile viewport', async ({
  page,
  context,
}) => {
  await page.goto('/razrabotka')
  const activeCard = page.locator('#projects div[aria-current="true"]')
  await activeCard.scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Показать проект «TrueTell», 2 из 7' }).tap()
  await expect(activeCard).toContainText('TrueTell')
  await page.getByRole('button', { name: 'Показать проект «ROSA», 1 из 7' }).tap()
  await expect(activeCard).toContainText('ROSA')

  const box = await activeCard.boundingBox()
  if (!box) throw new Error('Active gallery card is not visible')

  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  const cdp = await context.newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x, y }],
  })
  for (let step = 1; step <= 8; step++) {
    await page.waitForTimeout(55)
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: x - step * 10, y }],
    })
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })

  await expect(activeCard).toContainText('TrueTell')
})

test('holding a gallery card pauses automatic advancement on mobile', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/razrabotka')
  const activeCard = page.locator('#projects div[aria-current="true"]')
  await activeCard.scrollIntoViewIfNeeded()
  await expect(page.locator('#projects [aria-label^="Используйте стрелки"]')).toHaveCSS(
    'height',
    '356px',
  )
  await expect(activeCard).toContainText('ROSA')

  const box = await activeCard.boundingBox()
  if (!box) throw new Error('Active gallery card is not visible')

  const cdp = await context.newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }],
  })
  await page.waitForTimeout(3900)
  await expect(activeCard).toContainText('ROSA')
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
})

test('vertical touch on a gallery card scrolls the page without switching projects', async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/razrabotka')
  const activeCard = page.locator('#projects div[aria-current="true"]')
  await activeCard.scrollIntoViewIfNeeded()
  await expect(page.locator('#projects [aria-label^="Используйте стрелки"]')).toHaveCSS(
    'height',
    '356px',
  )

  const box = await activeCard.boundingBox()
  if (!box) throw new Error('Active gallery card is not visible')
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  const scrollBefore = await page.evaluate(() => window.scrollY)
  const cdp = await context.newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x, y }],
  })
  for (let step = 1; step <= 8; step++) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x, y: y - step * 12 }],
    })
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })

  await expect(activeCard).toContainText('ROSA')
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollBefore + 20)
})
