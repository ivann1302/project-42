import { expect, test } from '@playwright/test'

test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE },
})

test.skip(({ browserName }) => browserName !== 'chromium', 'Continuous touch uses Chromium CDP')

test('mobile gallery scrolls horizontally while swiping, then snaps to the next project', async ({
  page,
  context,
}) => {
  await page.goto('/razrabotka')
  const scroller = page.getByLabel('Листайте проекты горизонтально')
  await scroller.scrollIntoViewIfNeeded()
  const activeCard = scroller.locator('article[aria-current="true"]')
  await expect(activeCard).toContainText('ROSA')
  await expect(scroller).toHaveCSS('scroll-snap-type', 'x mandatory')

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
    await page.waitForTimeout(35)
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: x - step * 25, y }],
    })
    if (step === 5) {
      expect(await scroller.evaluate((element) => element.scrollLeft)).toBeGreaterThan(20)
    }
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })

  await expect(activeCard).toContainText('TrueTell')
  await expect(
    page.getByRole('button', { name: 'Показать проект «TrueTell», 2 из 7' }),
  ).toHaveAttribute('aria-current', 'true')

  await page.getByRole('button', { name: 'Показать проект «Ziptron», 4 из 7' }).tap()
  await expect(activeCard).toContainText('Ziptron')
})

test('mobile gallery stays on the selected project until the visitor scrolls it', async ({
  page,
}) => {
  await page.goto('/razrabotka')
  const scroller = page.getByLabel('Листайте проекты горизонтально')
  await scroller.scrollIntoViewIfNeeded()
  await expect(scroller.locator('article[aria-current="true"]')).toContainText('ROSA')
  await page.waitForTimeout(3900)
  await expect(scroller.locator('article[aria-current="true"]')).toContainText('ROSA')
})

test('vertical touch on the gallery still scrolls the page', async ({ page, context }) => {
  await page.goto('/razrabotka')
  const scroller = page.getByLabel('Листайте проекты горизонтально')
  await scroller.scrollIntoViewIfNeeded()
  const box = await scroller.boundingBox()
  if (!box) throw new Error('Gallery is not visible')

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

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollBefore + 20)
  await expect(scroller.locator('article[aria-current="true"]')).toContainText('ROSA')
})
