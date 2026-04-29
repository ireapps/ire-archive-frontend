import { test, expect } from "@playwright/test";

test.describe("Category Link", () => {
  test("should navigate to search with correct category filter when clicking category link", async ({
    page,
  }) => {
    // Visit a resource detail page (AUTH_BYPASS is enabled in playwright config)
    await page.goto("/resource/66cbe79d-c198-fbe9-7690-85f49502e63a");

    // Wait for the resource detail to load
    await expect(page.locator(".resource-detail")).toBeVisible({
      timeout: 5000,
    });

    // Find the category link in the metadata section
    const categoryLink = page.locator(".metadata dt", { hasText: "Category" })
      .locator("..")
      .locator("a");
    await expect(categoryLink).toBeVisible();

    // Get the category text and click the link
    const categoryText = await categoryLink.innerText();
    await categoryLink.click();

    // Verify we navigated to the search page with the correct categories param
    await expect(page).toHaveURL(/\/search\?categories=/);
    await expect(page).toHaveURL(
      new RegExp(`categories=${encodeURIComponent(categoryText.toLowerCase())}`)
    );

    // Verify the search page loaded
    await expect(page.locator(".search-page")).toBeVisible();
  });
});
