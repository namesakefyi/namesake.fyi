import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";

export default defineConfig({
  output: "hybrid",
  adapter: cloudflare({
    imageService: "compile",
  }),
  site: "https://namesake.fyi",
  integrations: [sitemap(), react(), markdoc()],
  prefetch: true,
  vite: {
    ssr: {
      external: ["buffer", "path", "fs", "os", "crypto", "async_hooks"].map(
        (i) => `node:${i}`,
      ),
    },
  },
  devToolbar: {
    enabled: false,
  },
});
