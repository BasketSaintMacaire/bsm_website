import { test, expect } from '@playwright/test'

test.describe('main pages render real data from the API', () => {
  test('home page shows the season events fetched from the API', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    await page.goto('/')

    await expect(page.getByText('NOS ÉVÉNEMENTS DE LA SAISON')).toBeVisible()
    // at least one event card rendered from /api/season-events
    await expect(page.locator('.bg-purple-600').first()).toBeVisible()
    expect(errors).toEqual([])
  })

  test('committees page shows the bureau and key roles', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    await page.goto('/bureau')

    await expect(page.getByRole('heading', { name: 'Le Bureau' })).toBeVisible()
    await expect(page.getByText('Membres Clés du Bureau')).toBeVisible()
    expect(errors).toEqual([])
  })

  test('history page shows the club timeline', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    await page.goto('/histoire')

    await expect(page.getByRole('heading', { name: "L'Histoire du BSM" })).toBeVisible()
    await expect(page.getByText('1981', { exact: true })).toBeVisible()
    expect(errors).toEqual([])
  })

  test('news page shows articles fetched from the API', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    await page.goto('/actualites')

    await expect(page.locator('.news-card').first()).toBeVisible()
    expect(errors).toEqual([])
  })

  test('training planning page shows the period and day tabs', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    await page.goto('/planning-entrainement')

    await expect(page.getByRole('heading', { name: "Planning d'entraînement" })).toBeVisible()
    await expect(page.getByText('LUNDI')).toBeVisible()
    expect(errors).toEqual([])
  })

  test('planning page shows match cards and filters', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    await page.goto('/planning')

    await expect(page.getByText('Filtres de recherche')).toBeVisible()
    // <option> text isn't independently "visible" in a closed <select>
    await expect(page.locator('select').last()).toContainText('Toutes les équipes')
    expect(errors).toEqual([])
  })
})
