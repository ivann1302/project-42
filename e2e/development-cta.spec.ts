import { expect, test as base } from '@playwright/test'

const test = base.extend<{ browserDiagnostics: void }>({
  browserDiagnostics: [
    async ({ page }, use, testInfo) => {
      const startedAt = Date.now()
      const events: Record<string, unknown>[] = []
      const record = (event: Record<string, unknown>) => {
        events.push({ elapsedMs: Date.now() - startedAt, ...event })
      }
      page.on('console', (message) => {
        record({
          type: 'console',
          level: message.type(),
          message: message.text(),
          location: message.location(),
        })
      })
      page.on('pageerror', (error) => {
        record({ type: 'pageerror', message: error.message, stack: error.stack })
      })
      page.on('framenavigated', (frame) => {
        if (frame === page.mainFrame()) record({ type: 'navigation', url: frame.url() })
      })
      page.on('requestfailed', (request) => {
        record({
          type: 'requestfailed',
          method: request.method(),
          url: request.url(),
          failure: request.failure()?.errorText,
        })
      })
      page.on('response', (response) => {
        if (response.status() >= 400) {
          record({ type: 'http-error', status: response.status(), url: response.url() })
        }
      })

      await use()
      if (testInfo.status !== testInfo.expectedStatus) {
        await testInfo.attach('browser-diagnostics', {
          body: JSON.stringify({ finalUrl: page.url(), events }, null, 2),
          contentType: 'application/json',
        })
      }
    },
    { auto: true },
  ],
})

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  test(`shows the complete inline form and usable project selector on ${viewport.name}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/razrabotka')

    const cta = page.locator('#cta')
    const form = cta.locator('form')
    await form.scrollIntoViewIfNeeded()
    await expect(form.getByPlaceholder('Иван Иванов')).toBeVisible()
    await expect(form.getByPlaceholder('+7 (___) ___-__-__')).toBeVisible()
    await expect(form.getByPlaceholder('example@company.ru')).toBeVisible()
    await expect(form.getByPlaceholder('Расскажите о вашем проекте...')).toBeVisible()
    await expect(form.getByRole('button', { name: 'Отправить заявку' })).toBeVisible()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')

    const project = form.locator('button[aria-haspopup="listbox"]')
    await expect(project).toHaveText('Выберите тип проекта')
    await project.evaluate((element) => element.scrollIntoView({ block: 'center' }))
    await project.click()
    const option = form.getByRole('option', { name: 'Корпоративный сайт', exact: true })
    await expect(option).toBeInViewport()
    await option.click()
    await expect(project).toHaveText('Корпоративный сайт')
    await expect(form.getByRole('listbox')).toHaveCount(0)

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true)
    expect(
      await cta.evaluate((section) =>
        [section, ...section.querySelectorAll('*')].some((element) => {
          if (element.tagName === 'TEXTAREA') return false
          const style = getComputedStyle(element)
          return (
            /^(auto|scroll)$/.test(style.overflowY) &&
            element.scrollHeight > element.clientHeight + 1
          )
        }),
      ),
    ).toBe(false)
    await cta.screenshot({ path: test.info().outputPath(`cta-${viewport.name}.png`) })
  })
}

test('validates inline, preserves a failed request, and submits the selected project on retry', async ({
  page,
}) => {
  const submitted: Record<string, unknown>[] = []
  let responseStatus = 500

  // Block every POST, including analytics, so this test cannot send a real lead.
  await page.route('**/*', async (route) => {
    const request = route.request()
    if (request.method() !== 'POST') {
      if (new URL(request.url()).hostname === 'mc.yandex.ru') {
        await route.abort()
        return
      }
      await route.continue()
      return
    }

    let payload: Record<string, unknown> | undefined
    try {
      payload = request.postDataJSON() as Record<string, unknown>
    } catch {
      // Non-JSON POSTs are also intercepted and never forwarded.
    }
    if (payload?._page === '/razrabotka' && typeof payload.name === 'string') {
      submitted.push(payload)
      await route.fulfill({
        status: responseStatus,
        contentType: 'application/json',
        body: JSON.stringify({ ok: responseStatus === 200 }),
      })
      return
    }
    await route.fulfill({ status: 204 })
  })

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.goto(
    '/razrabotka?utm_source=ya&utm_medium=cpc&utm_campaign=direct_test&yclid=test_click',
  )
  await page.evaluate(() => {
    window.sessionStorage.setItem('direct-test-goals', '[]')
    window.ym = (counter, method, target, options, callback) => {
      if (method === 'reachGoal') {
        const goals = JSON.parse(window.sessionStorage.getItem('direct-test-goals') ?? '[]')
        window.sessionStorage.setItem(
          'direct-test-goals',
          JSON.stringify([...goals, { counter, target }]),
        )
      }
      if (typeof callback === 'function') callback()
      if (method === 'hit' && options && typeof options.callback === 'function') options.callback()
    }
  })
  const form = page.locator('#cta form')
  const submit = form.getByRole('button', { name: 'Отправить заявку' })
  await submit.click()
  await expect(form.getByText('Введите имя', { exact: true })).toBeVisible()
  await expect(form.getByText('Укажите телефон или email', { exact: true })).toBeVisible()
  expect(submitted).toHaveLength(0)

  await form.getByPlaceholder('Иван Иванов').fill('Иван Иванов')
  await form.getByPlaceholder('example@company.ru').fill('sample@example.com')
  await form.getByPlaceholder('Расскажите о вашем проекте...').fill('Нужен сайт для компании')
  const project = form.locator('button[aria-haspopup="listbox"]')
  await project.click()
  await form.getByRole('option', { name: 'Корпоративный сайт', exact: true }).click()
  await submit.click()

  await expect(form.getByText('Ошибка отправки. Попробуйте позже.')).toBeVisible()
  expect(submitted).toHaveLength(1)
  expect(await page.evaluate(() => window.sessionStorage.getItem('direct-test-goals'))).toBe('[]')
  await expect(form.getByPlaceholder('Иван Иванов')).toHaveValue('Иван Иванов')
  await expect(form.getByPlaceholder('example@company.ru')).toHaveValue('sample@example.com')
  await expect(form.getByPlaceholder('Расскажите о вашем проекте...')).toHaveValue(
    'Нужен сайт для компании',
  )
  await expect(project).toHaveText('Корпоративный сайт')

  responseStatus = 200
  await submit.click()
  await expect(page).toHaveURL(/\/thank-you\/?$/)
  expect(submitted).toHaveLength(2)
  expect(submitted[1]).toMatchObject({
    name: 'Иван Иванов',
    email: 'sample@example.com',
    service: 'Корпоративный сайт',
    message: 'Нужен сайт для компании',
    _page: '/razrabotka',
    _utm_source: 'ya',
    _utm_medium: 'cpc',
    _utm_campaign: 'direct_test',
    _yclid: 'test_click',
  })
  expect(
    await page.evaluate(() =>
      JSON.parse(window.sessionStorage.getItem('direct-test-goals') ?? '[]'),
    ),
  ).toEqual([{ counter: 109427452, target: 'contact_form_submit' }])
})
