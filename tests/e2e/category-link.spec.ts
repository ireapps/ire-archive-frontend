import { test, expect } from "@playwright/test";

test.describe("Category Link", () => {
  test("should navigate to search with correct category filter when clicking category link", async ({
    page,
  }) => {
    // Visit a mock resource detail page (AUTH_BYPASS uses mock-investigative-1)
    await page.goto("/resource/mock-investigative-1");

    // Wait for the resource detail to load
    await expect(page.locator(".resource-detail")).toBeVisible({
      timeout: 5000,
    });

    // Find the category link in the metadata section
    const categoryLink = page.locator(".metadata dd a", { hasText: "Tipsheet" });
    await expect(categoryLink).toBeVisible();

    // Click the category link
    await categoryLink.click();

    // Verify we navigated to the search page with the correct categories param
    await expect(page).toHaveURL(/\/search\?categories=tipsheet/);

    // Verify the search page loaded
    await expect(page.locator(".search-page")).toBeVisible();
  });
});
