import { test, expect } from '@playwright/test'

test('homepage renders hero, venues, and games', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Premium experiences, reimagined/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Explore Venues/i })).toBeVisible()

  const venueCards = page.locator('a[href^="/venues/"]')
  await expect(venueCards.first()).toBeVisible()
  // Each venue appears in both the grid (5) and as a venues nav link target — count >= 5
  expect(await venueCards.count()).toBeGreaterThanOrEqual(5)

  await expect(page.getByText(/Upcoming Home Games/i)).toBeVisible()
})

test('CTA navigates to /inquire', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /Plan Your Visit/i }).first().click()
  await expect(page).toHaveURL(/\/inquire/)
})
