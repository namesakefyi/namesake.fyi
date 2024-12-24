import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import autoprefixer from "autoprefixer";
import postcssUtopia from "postcss-utopia";
import postcssMediaMinMax from "postcss-media-minmax";
import postcssLogicalViewportUnits from "@csstools/postcss-logical-viewport-units";
import postcssClamp from "postcss-clamp";
import cssnano from "cssnano";
import remarkToc from "remark-toc";

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: cloudflare({
    imageService: "compile",
  }),
  markdown: {
    remarkPlugins: [ [remarkToc, {}] ]
  },
  site: "https://namesake.fyi",
  integrations: [
    sitemap(),
    react(),
    markdoc(),
    // keystatic() Re-enable when Keystatic supports Astro v5
  ],
  prefetch: true,
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
