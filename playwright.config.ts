import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for e2e tests
 * See https://playwright.dev/docs/test-configuration
 *
 * Set TEST_MODE=preview to test against production build:
 *   TEST_MODE=preview npm run test:e2e
 *   npm run test:e2e:preview
 *
 * Default (no TEST_MODE) runs against dev server for faster feedback.
 */

const testMode = process.env.TEST_MODE || "dev";
const isPreviewMode = testMode === "preview";

// Use different ports to avoid conflicts
const devPort = 5173;
const previewPort = 4173;
const port = isPreviewMode ? previewPort : devPort;

const testEnv = {
  ...process.env,
  VITE_AUTH_BYPASS: "true",
  // Keep API calls local/safe even though mock responses short-circuit
  VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || "http://localhost:8000",
};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Use 2 workers in CI for parallel browser execution (faster)
  workers: process.env.CI ? 2 : undefined,
  reporter: "html",
  // Reduce timeout in CI to fail faster (default is 30s)
  timeout: process.env.CI ? 10_000 : 30_000,
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "on-first-retry",
    // Reduce action timeout in CI
    actionTimeout: process.env.CI ? 5_000 : 10_000,
    navigationTimeout: process.env.CI ? 10_000 : 30_000,
  },

  // Run fastest browser first for quicker feedback
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  /* Run local server before starting tests */
  webServer: {
    command: isPreviewMode ? "npm run build && npm run preview" : "npm run dev",
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: isPreviewMode ? 120_000 : 60_000, // Preview needs more time for build
    env: testEnv,
  },
});
