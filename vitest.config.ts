import fs from "node:fs";
import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import {
  configDefaults,
  coverageConfigDefaults,
  defineConfig,
} from "vitest/config";

const d1Migrations = fs
  .readFileSync("./migrations/001_form_feedback.sql", "utf-8")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

export default defineConfig({
  test: {
    coverage: {
      reporter: ["text", "json-summary", "json"],
      reportOnFailure: true,
      include: [
        "src/components/**/*.{ts,tsx}",
        "src/db/**/*.{ts,tsx}",
        "src/forms/**/*.ts",
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
        "src/pdfs/**/schema.ts",
      ],
      thresholds: {
        lines: 85,
        statements: 85,
        functions: 85,
        branches: 85,
      },
    },
    projects: [
      {
        plugins: [
          {
            name: "mock-virtual-modules",
            resolveId(id) {
              if (id === "sanity:client") return id;
            },
          },
        ],
        test: {
          name: "jsdom",
          globals: true,
          clearMocks: true,
          include: ["src/**/*.test.{ts,tsx}"],
          exclude: [
            ...configDefaults.exclude,
            "src/**/*.spec.ts",
            "src/pages/api/__tests__/**",
          ],
          setupFiles: ["./src/vitest.setup.ts"],
          environment: "jsdom",
        },
      },
      {
        plugins: [
          cloudflareTest({
            wrangler: { configPath: "./wrangler.jsonc" },
          }),
        ],
        define: {
          D1_MIGRATIONS: JSON.stringify(d1Migrations),
        },
        test: {
          name: "workers",
          include: ["src/pages/api/__tests__/*.test.ts"],
        },
      },
    ],
  },
});
