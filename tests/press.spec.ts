import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

test.describe("press", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/press");
  });

  test("should not have any automatically detectable accessibility issues", async ({
    page,
  }, testInfo) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    await testInfo.attach("accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});