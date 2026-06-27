import { expect, test, type Page } from '@playwright/test'

async function expectNoHorizontalOverflow(page: Page) {
  const offenders = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth

    const isInsideClippedOrScrollableArea = (element: Element) => {
      let current = element.parentElement

      while (current && current !== document.body && current !== document.documentElement) {
        const styles = window.getComputedStyle(current)
        const clipsHorizontalOverflow = ['clip', 'hidden'].includes(styles.overflowX)
        const canScrollHorizontally =
          ['auto', 'scroll'].includes(styles.overflowX) &&
          current.scrollWidth > current.clientWidth + 1

        if (clipsHorizontalOverflow || canScrollHorizontally) return true
        current = current.parentElement
      }

      return false
    }

    return Array.from(document.body.querySelectorAll<HTMLElement>('*'))
      .filter((element) => {
        const rect = element.getBoundingClientRect()
        const leaksOutOfViewport = rect.left < -1 || rect.right > viewportWidth + 1

        return (
          rect.width > 0 &&
          rect.height > 0 &&
          leaksOutOfViewport &&
          !isInsideClippedOrScrollableArea(element)
        )
      })
      .map((element) => {
        const rect = element.getBoundingClientRect()

        return {
          tag: element.tagName.toLowerCase(),
          id: element.id,
          className: element.className,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
        }
      })
  })

  expect(offenders).toEqual([])
}

test.describe('razrabotka page', () => {
  test('keeps Safari-sensitive page elements usable', async ({ page }) => {
    await page.goto('/razrabotka-sayta')

    await expect(page.getByTestId('razrabotka-page-canvas')).toBeVisible()
    await expect(page.getByTestId('razrabotka-header')).toBeVisible()
    await expectNoHorizontalOverflow(page)

    const menuButton = page.getByRole('button', { name: 'Открыть меню' })
    const isMobileMenu = await menuButton.isVisible()

    if (isMobileMenu) {
      await menuButton.click()
      await expect(page.getByRole('navigation', { name: 'Основная навигация' })).toBeVisible()
    }

    await page.getByRole('link', { name: 'Проекты' }).click()
    await expect(page.locator('#projects')).toBeVisible()
    await expectNoHorizontalOverflow(page)

    await page.getByRole('button', { name: /Открыть кейс ROSA/ }).click()
    const caseDialog = page.getByRole('dialog', { name: 'ROSA' })

    await expect(caseDialog).toBeVisible()
    await expect(caseDialog.getByRole('button', { name: 'Закрыть' })).toBeVisible()
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')

    await page.keyboard.press('Escape')
    await expect(caseDialog).toBeHidden()

    if (isMobileMenu) {
      await page.getByRole('button', { name: 'Открыть меню' }).click()
    }

    await page.getByRole('link', { name: 'Обсудить проект' }).click()
    const quizDialog = page.getByRole('dialog', { name: 'Оставьте заявку' })

    await expect(quizDialog).toBeVisible()
    await expect(page.locator('#razrabotka-quiz-name')).toBeVisible()
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')

    await page.keyboard.press('Escape')
    await expect(quizDialog).toBeHidden()
    await expectNoHorizontalOverflow(page)
  })
})
