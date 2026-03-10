import { test, expect } from "@playwright/test";

test.describe("Controls Box", () => {
  test("should not trigger search when opening/closing controls box", async ({
    page,
  }) => {
    // Navigate to homepage and perform a search
    await page.goto("/");
    const searchInput = page.locator('input[type="text"]');
    await searchInput.fill("investigative journalism");
    await searchInput.press("Enter");

    // Wait for search page to load
    await page.waitForURL(/\/search\?q=investigative/);
    await page.waitForSelector('[data-testid="result-card"]');

    // Get the initial URL
    const initialUrl = page.url();
    const initialResultCount = await page
      .locator('[data-testid="result-card"]')
      .count();

    // Find and click the controls box toggle button
    const controlsToggle = page.locator('button.filter-toggle');
    await expect(controlsToggle).toBeVisible();
    await controlsToggle.click();

    // Wait a moment for any potential navigation
    await page.waitForTimeout(500);

    // Verify URL hasn't changed (no new search triggered)
    expect(page.url()).toBe(initialUrl);

    // Verify the controls box is now visible
    const controlsPanel = page.locator('#filter-controls-panel');
    await expect(controlsPanel).toBeVisible();

    // Verify the result count hasn't changed (no new search executed)
    const currentResultCount = await page
      .locator('[data-testid="result-card"]')
      .count();
    expect(currentResultCount).toBe(initialResultCount);

    // Close the controls box
    await controlsToggle.click();
    await page.waitForTimeout(500);

    // Verify URL still hasn't changed
    expect(page.url()).toBe(initialUrl);

    // Verify controls panel is now hidden
    await expect(controlsPanel).not.toBeVisible();

    // Verify results are still the same
    const finalResultCount = await page
      .locator('[data-testid="result-card"]')
      .count();
    expect(finalResultCount).toBe(initialResultCount);
  });

  test("should trigger search only when filter is actually changed", async ({
    page,
  }) => {
    // Navigate to search page with a query
    await page.goto("/search?q=investigative");
    await page.waitForSelector('[data-testid="result-card"]');

    // Open the controls box
    const controlsToggle = page.locator('button.filter-toggle');
    await controlsToggle.click();

    // Wait for controls to be visible
    const controlsPanel = page.locator('#filter-controls-panel');
    await expect(controlsPanel).toBeVisible();

    // Get initial URL
    const initialUrl = page.url();

    // Now actually change a filter (uncheck a category)
    const tipsheetCheckbox = page.locator(
      'input[type="checkbox"][value="tipsheet"]'
    );
    await tipsheetCheckbox.click();

    // Wait for URL to update (this SHOULD trigger a new search)
    await page.waitForURL(/categories=/);

    // Verify URL has changed (search was triggered)
    expect(page.url()).not.toBe(initialUrl);

    // Verify the filter is applied in the URL
    const url = new URL(page.url());
    const categories = url.searchParams.getAll("categories");
    expect(categories).not.toContain("tipsheet");
  });

  test("should expand controls box on keyboard shortcut", async ({ page }) => {
    // Navigate to search page
    await page.goto("/search?q=investigative");
    await page.waitForSelector('[data-testid="result-card"]');

    // Get initial URL
    const initialUrl = page.url();

    // Press Alt+S to expand controls and focus sort select
    await page.keyboard.press("Alt+KeyS");

    // Wait a moment
    await page.waitForTimeout(300);

    // Verify URL hasn't changed
    expect(page.url()).toBe(initialUrl);

    // Verify controls panel is visible
    const controlsPanel = page.locator('#filter-controls-panel');
    await expect(controlsPanel).toBeVisible();

    // Verify sort select has focus
    const sortSelect = page.locator('#sort-filter');
    await expect(sortSelect).toBeFocused();
  });
});
