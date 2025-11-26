import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import sanity from "@sanity/astro";
import { defineConfig, passthroughImageService } from "astro/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    imageService: "compile",
  }),
  image: {
    service: passthroughImageService(),
  },
  site: "https://namesake.fyi",
  integrations: [
    sitemap(),
    mdx(),
    sanity({
      projectId: "k4p1j15y",
      dataset: "production",
      useCdn: true,
      studioBasePath: "/studio",
      apiVersion: "2025-09-19",
    }),
    react(),
  ],
  prefetch: true,
  trailingSlash: "never",
  build: {
    // Eliminate trailing slashes from Cloudflare Pages
    // https://creativehike.com/posts/removing-trailng-slashes-astro
    format: "file",
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          // Use a supported file pattern for Vite 5/Rollup 4
          // @doc https://relative-ci.com/documentation/guides/vite-config
          assetFileNames: "assets/[name].[hash][extname]",
          chunkFileNames: "assets/[name].[hash].js",
          entryFileNames: "assets/[name].[hash].js",
          manualChunks(id) {
            // Astro
            if (id.includes("astro") || id.includes("@astrojs")) {
              return "astro";
            }

            // Sanity
            if (id.includes("sanity") || id.includes("@sanity")) {
              return "sanity";
            }

            // Core component primitives
            if (
              id.includes("@radix-ui") ||
              id.includes("react-aria") ||
              id.includes("react-aria-components")
            ) {
              return "react-aria";
            }

            // Icons and visual components
            if (id.includes("@maskito") || id.includes("@remixicon")) {
              return "ui-components";
            }

            // PDF lib
            if (id.includes("@cantoo/pdf-lib")) {
              return "pdf";
            }

            // Analytics
            if (id.includes("posthog-js")) {
              return "analytics";
            }
          },
        },
      },
    },
    plugins: [
      tsconfigPaths(),
      visualizer({
        emitFile: true,
        filename: "stats.html",
      }),
    ],
    ssr: {
      external: ["buffer", "path", "fs", "os", "crypto", "async_hooks"].map(
        (i) => `node:${i}`,
      ),
    },
  },
  devToolbar: {
    enabled: false,
  },
  server: {
    host: true,
  },
});
