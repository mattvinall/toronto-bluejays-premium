import { test, expect } from '@playwright/test'

test('full inquiry happy path', async ({ page }) => {
  await page.goto('/venues/td-clubhouse')
  await page.getByRole('link', { name: /Plan Your Visit/i }).last().click()
  await expect(page).toHaveURL(/\/inquire\?venue=td-clubhouse/)

  // Step 0: venue is preselected — Continue
  await expect(page.getByRole('group', { name: /Which venue/i })).toBeVisible()
  await page.getByRole('button', { name: /Continue/i }).click()

  // Step 1: pick flexible
  await expect(page.getByRole('group', { name: /Preferred date/i })).toBeVisible()
  await page.getByLabel(/I'm flexible/i).check()
  await page.getByRole('button', { name: /Continue/i }).click()

  // Step 2: group size 50, occasion corporate
  await page.getByLabel(/Group size/i).fill('50')
  await page.getByLabel(/Occasion/i).selectOption('corporate')
  await page.getByRole('button', { name: /Continue/i }).click()

  // Step 3: contact + submit
  await page.getByLabel(/First name/i).fill('Matt')
  await page.getByLabel(/Last name/i).fill('Vinall')
  await page.getByLabel(/Email/i).fill('matt@example.com')
  await page.getByLabel(/Phone/i).fill('+14165550100')
  await page.getByLabel(/I consent/i).check()

  await page.getByRole('button', { name: /Submit Inquiry/i }).click()

  await expect(page.getByText(/Thank you/i)).toBeVisible({ timeout: 5_000 })
  await expect(page.getByText(/Reference ID/i)).toBeVisible()
})
