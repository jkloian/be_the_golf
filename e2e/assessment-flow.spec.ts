import { test, expect } from '@playwright/test'

test.describe('Assessment Flow', () => {
  test('complete assessment flow from landing to results', async ({ page }) => {
    // Start at landing page
    await page.goto('/')
    // Wait for React app to load
    await page.waitForSelector('#app', { state: 'attached' })
    // Wait for the JavaScript to execute and React to render
    await page.waitForFunction(() => {
      const app = document.getElementById('app')
      return app && app.children.length > 0
    }, { timeout: 10000 })
    await page.waitForLoadState('networkidle')
    // Wait for the landing page content to be visible
    await expect(page.locator('h1:has-text("Be Your Golf")')).toBeVisible({ timeout: 10000 })

    // Click start button
    await page.click('text=Start Free Assessment')
    await expect(page).toHaveURL(/\/start/)

    // Fill out start form
    await page.fill('input[type="text"]', 'Test User')
    // Gender is selected by default as "male", but click it to ensure it's selected
    await page.click('button:has-text("Male")')
    await page.fill('input[type="number"]', '14')
    await page.click('button[type="submit"]')

    // Should navigate to assessment page
    await expect(page).toHaveURL(/\/assessment\/\d+/)
    await expect(page.locator('h2:has-text("Question 1 of 16")')).toBeVisible()

    // Complete all 16 frames
    for (let i = 1; i <= 16; i++) {
      // Wait for current question to be visible
      await expect(page.locator(`h2:has-text("Question ${i} of 16")`)).toBeVisible()
      
      // Select first option as "Most" - click the first option card
      // OptionCard components have role="button" and are in a space-y container
      const optionCards = page.locator('[role="button"]').filter({ hasNotText: 'Next' }).filter({ hasNotText: 'Finish' })
      const firstCard = optionCards.first()
      await expect(firstCard).toBeVisible()
      await firstCard.click()
      // Wait for selection to be applied
      await page.waitForTimeout(200)
      
      // Select last option as "Least" - click the last option card
      const lastCard = optionCards.last()
      await expect(lastCard).toBeVisible()
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
        await expect(page.locator(`h2:has-text("Question ${i + 1} of 16")`)).toBeVisible({ timeout: 10000 })
        // Also wait a bit for React to fully update
        await page.waitForTimeout(300)
      } else {
        // Wait for navigation to results page
        await expect(page).toHaveURL(/\/results\/[\w-]+/, { timeout: 10000 })
      }
    }

    // Should navigate to results page
    await expect(page).toHaveURL(/\/results\/[\w-]+/, { timeout: 15000 })
    // Wait for the results reveal to show - look for "You are the" text
    // The processing animation shows for at least 8.5 seconds, so we wait with a longer timeout
    await expect(page.locator('text=You are the')).toBeVisible({ timeout: 20000 })
  })
})

