import { test, expect } from "@playwright/test";

test.describe("Direct URL Navigation", () => {
  test("should handle direct navigation to search URL with query params", async ({
    page,
  }) => {
    // Simulate opening URL directly in browser (e.g., pasting in address bar or new tab)
    await page.goto("/search?q=real%20estate");

    // Wait for the page to load
    await expect(page.locator(".search-page")).toBeVisible();

    // Verify the search input has the query
    const searchInput = page.locator('input[type="text"]');
    await expect(searchInput).toHaveValue("real estate");

    // Verify we have search results or a loading state
    // (we may not have results if the backend isn't running, but the page should load)
    await expect(page).toHaveURL(/\/search\?q=real.*estate/);
  });

  test("should handle direct navigation to resource detail URL", async ({
    page,
  }) => {
    // Simulate opening resource URL directly
    // Using a known resource ID from the issue
    await page.goto("/resource/66cbe79d-c198-fbe9-7690-85f49502e63a");

    // The page should load (even if the backend isn't running, the route should work)
    await expect(page).toHaveURL(
      /\/resource\/66cbe79d-c198-fbe9-7690-85f49502e63a/
    );

    // The resource detail container should be present
    // (content may not load without backend, but the route should work)
    await expect(page.locator(".resource-detail")).toBeVisible({
      timeout: 5000,
    });
  });

  test("should handle search URL with multiple query params", async ({
    page,
  }) => {
    // Test with multiple parameters including filters and sorting
    await page.goto(
      "/search?q=investigative+journalism&categories=tipsheet&sort=newest"
    );

    // Page should load
    await expect(page.locator(".search-page")).toBeVisible();

    // Verify URL is preserved
    await expect(page).toHaveURL(/\/search/);
    await expect(page).toHaveURL(/q=investigative/);
    await expect(page).toHaveURL(/categories=tipsheet/);
    await expect(page).toHaveURL(/sort=newest/);

    // Verify search input
    const searchInput = page.locator('input[type="text"]');
    await expect(searchInput).toHaveValue("investigative journalism");
  });

  test("should handle URL with special characters", async ({ page }) => {
    // Test URL encoding/decoding
    await page.goto("/search?q=data%20%26%20analytics");

    await expect(page.locator(".search-page")).toBeVisible();

    const searchInput = page.locator('input[type="text"]');
    await expect(searchInput).toHaveValue("data & analytics");
  });
});
