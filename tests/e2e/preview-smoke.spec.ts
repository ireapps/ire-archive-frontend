import { expect, test } from "@playwright/test";

test.skip(
  !process.env.PLAYWRIGHT_BASE_URL,
  "This smoke test only runs against a deployed preview."
);

test("loads the deployed SPA and its login route", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveURL(/\/login(?:\?|$)/);
  await expect(
    page.getByRole("button", { name: "Log in with IRE membership" })
  ).toBeVisible();
});
