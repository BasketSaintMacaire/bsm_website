import { test, expect } from '@playwright/test'

test.describe('Contact form', () => {
  test('shows a custom validation error the browser would not catch itself', async ({ page }) => {
    // Native HTML5 "required"/type=email validation blocks submission of an
    // empty/malformed form before Vue's handler ever runs, so an all-empty
    // submit can't reach our custom validateForm(). "test@test" passes the
    // native email pattern (no TLD required) but fails the app's stricter
    // regex, which does reach the custom error rendering.
    await page.goto('/contact')

    await page.fill('#lastName', 'Dupont')
    await page.fill('#firstName', 'Jean')
    await page.fill('#email', 'test@test')
    await page.selectOption('#about', 'contact')
    await page.fill('#message', 'Message de test')
    await page.check('#consent')

    await page.getByRole('button', { name: 'Envoyer' }).click()

    await expect(page.getByText("L'email n'est pas valide")).toBeVisible()
  })

  test('submits successfully and resets the form', async ({ page }) => {
    await page.route('**/api/contact', (route) => route.fulfill({ status: 204 }))

    await page.goto('/contact')

    await page.fill('#lastName', 'Dupont')
    await page.fill('#firstName', 'Jean')
    await page.fill('#email', 'jean.dupont@example.com')
    await page.selectOption('#about', 'contact')
    await page.fill('#message', "Test end-to-end du formulaire de contact via Playwright.")
    await page.check('#consent')

    await page.getByRole('button', { name: 'Envoyer' }).click()

    await expect(page.getByText('Message envoyé !')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('form')).not.toBeVisible()
  })
})
