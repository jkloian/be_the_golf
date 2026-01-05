import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv';
import fs from 'fs';

// Load .env.test if it exists
if (fs.existsSync('.env.test')) {
  dotenv.config({ path: '.env.test' });
  console.log('📁 Playwright: Loaded .env.test configuration');
} else {
  console.log('ℹ️  Playwright: Using default test configuration (no .env.test found)');
}

// Get port configuration with fallbacks
const railsPort = process.env.PLAYWRIGHT_RAILS_SERVER_PORT || 3001;
const baseURL = `http://localhost:${railsPort}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  timeout: 60000, // 60 seconds for e2e tests (processing animation takes ~8.5s)
  use: {
    baseURL: `http://localhost:${railsPort}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: `bundle exec rails server -e test -p ${railsPort}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})

