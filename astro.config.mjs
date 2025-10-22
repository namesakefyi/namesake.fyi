import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import postcssLogicalViewportUnits from "@csstools/postcss-logical-viewport-units";
import sanity from "@sanity/astro";
import { defineConfig } from "astro/config";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcssClamp from "postcss-clamp";
import postcssMediaMinMax from "postcss-media-minmax";
import postcssUtopia from "postcss-utopia";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    imageService: "compile",
  }),
  site: "https://namesake.fyi",
  integrations: [
    sitemap(),
    mdx(),
    sanity({
      projectId: "k4p1j15y",
      dataset: "production",
      // Disabled CDN static builds to prevent stale content
      // If we change output to "server" in the future, enable CDN
      useCdn: false,
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
    ssr: {
      external: ["buffer", "path", "fs", "os", "crypto", "async_hooks"].map(
        (i) => `node:${i}`,
      ),
    },
    resolve: {
      // Workaround until fixed: https://github.com/withastro/adapters/pull/436
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD && {
        "react-dom/server": "react-dom/server.edge",
      },
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          postcssUtopia({
            minWidth: 320,
            maxWidth: 1240,
          }),
          postcssMediaMinMax(),
          postcssLogicalViewportUnits(),
          postcssClamp(),
          cssnano(),
        ],
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
