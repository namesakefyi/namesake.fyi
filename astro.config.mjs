import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://namesake.fyi",
  integrations: [sitemap(), react()],
  devToolbar: {
    enabled: false
  }
});