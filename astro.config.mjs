import cloudflare from "@astrojs/cloudflare";
import markdoc from "@astrojs/markdoc";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import sitemap from "@astrojs/sitemap";
import postcssLogicalViewportUnits from "@csstools/postcss-logical-viewport-units";
import { defineConfig } from "astro/config";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcssClamp from "postcss-clamp";
import postcssMediaMinMax from "postcss-media-minmax";
import postcssUtopia from "postcss-utopia";

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: cloudflare({
    imageService: "compile",
  }),
  site: "https://namesake.fyi",
  integrations: [sitemap(), react(), markdoc(), keystatic()],
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
