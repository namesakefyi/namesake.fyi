import path from "node:path";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import sanity from "@sanity/astro";
import { defineConfig, passthroughImageService } from "astro/config";
import { visualizer } from "rollup-plugin-visualizer";

// https://github.com/withastro/astro/issues/12824
const alias = import.meta.env.PROD
  ? {
      "react-dom/server": "react-dom/server.edge",
    }
  : undefined;

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    cloudflareModules: false,
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
          manualChunks(id: string) {
            if (!id.includes("node_modules")) return;

            if (id.includes("@cantoo/pdf-lib")) {
              return "pdf";
            }

            if (id.includes("language-name-map")) {
              return "language-names";
            }

            if (
              id.includes("d3") ||
              id.includes("topojson") ||
              id.includes("@severo_bo/us-atlas")
            ) {
              return "d3";
            }

            if (
              id.includes("react-aria") ||
              id.includes("react-aria-components") ||
              id.includes("react-dom") ||
              id.includes("react/jsx") ||
              id.includes("react-is") ||
              id.includes("/react/")
            ) {
              return "react";
            }
          },
        },
      },
    },
    plugins: [
      visualizer({
        emitFile: true,
        filename: "stats.html",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve("src"),
        ...alias,
      },
    },
  },
  devToolbar: {
    enabled: false,
  },
  server: {
    host: true,
  },
});
