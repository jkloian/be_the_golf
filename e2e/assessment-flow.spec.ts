import { test, expect } from '@playwright/test'

test.describe('Assessment Flow', () => {
  test('complete assessment flow from landing to results', async ({ page }) => {
    // Start at landing page
    await page.goto('/')
    // Wait for React app to load
    await page.waitForSelector('#app', { state: 'attached' })
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=Be Your Golf')).toBeVisible({ timeout: 10000 })

    // Click start button
    await page.click('text=Start Free Assessment')
    await expect(page).toHaveURL(/\/start/)

    // Fill out start form
    await page.fill('input[type="text"]', 'Test User')
    await page.check('input[value="male"]')
    await page.fill('input[type="number"]', '14')
    await page.click('button[type="submit"]')

    // Should navigate to assessment page
    await expect(page).toHaveURL(/\/assessment\/\d+/)
    await expect(page.locator('text=Question 1 of 16')).toBeVisible()

    // Complete all 16 frames
    for (let i = 1; i <= 16; i++) {
      // Select first option as "Most"
      await page.click('.border-gray-300:first-of-type')
      // Select last option as "Least"
      await page.click('.border-gray-300:last-of-type')
      
      if (i < 16) {
        await page.click('text=Next')
        await expect(page.locator(`text=Question ${i + 1} of 16`)).toBeVisible()
      } else {
        await page.click('text=Finish')
      }
    }

    // Should navigate to results page
    await expect(page).toHaveURL(/\/results\/[\w-]+/)
    await expect(page.locator('text=Be Your Golf – Results')).toBeVisible()
    await expect(page.locator('text=Your Golf Persona')).toBeVisible()
  })
})

