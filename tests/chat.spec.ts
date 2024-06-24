import { test, expect } from "@playwright/test";

test.describe("chat", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/chat");
  });

  test("should redirect to Discord invite", async ({ page }) => {
    expect(page.url()).toContain("discord.com");
  });
});
