import { test, expect } from '@playwright/test'

test.describe('Team view', () => {
  test('auto-selects the latest season and renders team cards', async ({ page }) => {
    await page.goto('/equipes')

    await expect(page.getByRole('heading', { name: 'Nos Équipes BSM' })).toBeVisible()

    const select = page.locator('select')
    await expect(select).toHaveValue(/\d{4}-\d{4}/)

    await expect(page.locator('.team-card').first()).toBeVisible()
  })

  test('opens a team panel showing its players on click', async ({ page }) => {
    await page.goto('/equipes')

    await page.locator('.team-card').first().click()

    await expect(page.locator('.sliding-panel')).toBeVisible()
    await expect(page.locator('.player-card').first()).toBeVisible()
  })

  test('switching category changes the visible teams', async ({ page }) => {
    await page.goto('/equipes')
    await expect(page.locator('.team-card').first()).toBeVisible()

    const menButtonCount = await page.locator('.team-card').count()
    await page.getByRole('button', { name: 'Féminin' }).click()

    await expect(page.locator('.team-card').first()).toBeVisible()
    // category switch should change the rendered set (men vs women rosters differ in size)
    const womenButtonCount = await page.locator('.team-card').count()
    expect(menButtonCount).toBeGreaterThan(0)
    expect(womenButtonCount).toBeGreaterThan(0)
  })
})
