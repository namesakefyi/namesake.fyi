import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://namesake.fyi",
  integrations: [sitemap(), react()],
  devToolbar: {
    enabled: false,
  },
});
