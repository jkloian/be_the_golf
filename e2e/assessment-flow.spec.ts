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
      // Wait for current question to be visible
      await expect(page.locator(`text=Question ${i} of 16`)).toBeVisible()
      
      // Select first option as "Most" - click the first card
      const firstCard = page.locator('.border-gray-300').first()
      await firstCard.click()
      // Wait for selection to be applied
      await page.waitForTimeout(200)
      
      // Select last option as "Least" - click the last card
      const lastCard = page.locator('.border-gray-300').last()
      await lastCard.click()
      // Wait for selection to be applied
      await page.waitForTimeout(200)
      
      // Wait for Next/Finish button to be enabled
      const buttonText = i < 16 ? 'Next' : 'Finish'
      const nextButton = page.locator(`button:has-text("${buttonText}")`)
      await expect(nextButton).toBeEnabled()
      
      // Click the button and wait for navigation/update
      await nextButton.click()
      
      if (i < 16) {
        // Wait for the question text to update to the next question
        await expect(page.locator(`text=Question ${i + 1} of 16`)).toBeVisible({ timeout: 10000 })
        // Also wait a bit for React to fully update
        await page.waitForTimeout(300)
      } else {
        // Wait for navigation to results page
        await expect(page).toHaveURL(/\/results\/[\w-]+/, { timeout: 10000 })
      }
    }

    // Should navigate to results page
    await expect(page).toHaveURL(/\/results\/[\w-]+/)
    await expect(page.locator('text=Be Your Golf – Results')).toBeVisible()
    await expect(page.locator('text=Your Golf Persona')).toBeVisible()
  })
})

