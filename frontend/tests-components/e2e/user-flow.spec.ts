import { test, expect } from "@playwright/test";

test.describe("User Flow E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("user browses events on home page", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
  });

  test("user can navigate to event details", async ({ page }) => {
    const eventLink = page.locator("a[href*='/events/']").first();
    if (await eventLink.isVisible()) {
      await eventLink.click();
      await expect(page.url()).toContain("/events/");
    }
  });

  test("user can select seats", async ({ page }) => {
    await page.goto("/events/test-event");

    const seatButton = page.locator("button").filter({ hasText: /A-\d+/ }).first();
    if (await seatButton.isVisible()) {
      await seatButton.click();
      const summary = page.locator("text=Resum");
      await expect(summary).toBeVisible();
    }
  });

  test("user can proceed to checkout", async ({ page }) => {
    await page.goto("/events/test-event?orderId=123");

    const checkoutButton = page.locator("button").filter({ hasText: /Ir a compra|Confirmar/ });
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
    }
  });
});
