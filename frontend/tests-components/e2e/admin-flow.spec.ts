import { test, expect } from "@playwright/test";

test.describe("Admin Flow E2E", () => {
  test("admin can log in", async ({ page }) => {
    await page.goto("/admin");

    await page.fill('input[type="email"]', "admin@test.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page.url()).toContain("/admin");
  });

  test("admin can view dashboard", async ({ page }) => {
    await page.goto("/admin/dashboard");

    await expect(page.locator("text=Gestió")).toBeVisible();
  });

  test("admin can navigate to events management", async ({ page }) => {
    await page.goto("/admin");

    const eventsLink = page.locator("a").filter({ hasText: /Esdeveniments|Events/ });
    if (await eventsLink.isVisible()) {
      await eventsLink.click();
      await expect(page.url()).toContain("/admin/events");
    }
  });

  test("admin can create new event", async ({ page }) => {
    await page.goto("/admin/events");

    const createButton = page.locator("button").filter({ hasText: /Nou|NEW|Crear/ });
    if (await createButton.isVisible()) {
      await createButton.click();

      await page.fill('input[name="nom"]', "Test Event");
      await page.fill('input[name="artista"]', "Test Artist");
      await page.fill('input[type="date"]', "2026-12-31");

      const saveButton = page.locator("button").filter({ hasText: /Guardar|Save/ });
      await saveButton.click();
    }
  });
});
