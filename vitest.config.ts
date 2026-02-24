/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";
import { configDefaults, coverageConfigDefaults } from "vitest/config";

export default getViteConfig({
  // @ts-expect-error - Might be fixed after upgrading to Astro v6
  test: {
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: [...configDefaults.exclude, "e2e/**"],
    setupFiles: ["./src/vitest.setup.ts"],
    environment: "jsdom",
    coverage: {
      reporter: ["text", "json-summary", "json"],
      reportOnFailure: true,
      include: [
        "src/components/**/*.{ts,tsx}",
        "src/db/**/*.{ts,tsx}",
        "src/pdfs/**/*.{ts,tsx}",
        "src/utils/**/*.{ts,tsx}",
      ],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/*.css",
        "**/*.pdf",
        "**/*.astro",
        "**/*.config.?(c|m)[jt]s?(x)",
        "**/*.stories.tsx",
        "src/components/**/index.ts",
        "src/pdfs/index.ts",
      ],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 65,
        lines: 70,
      },
    },
  },
});
