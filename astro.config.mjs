import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from "@keystatic/astro";
import autoprefixer from "autoprefixer";
import postcssUtopia from "postcss-utopia";
import postcssMediaMinMax from "postcss-media-minmax";
import postcssLogicalViewportUnits from "@csstools/postcss-logical-viewport-units";
import postcssClamp from "postcss-clamp";
import cssnano from "cssnano";

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
