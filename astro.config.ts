import markdoc from "@astrojs/markdoc";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { SITE_URL } from "./src/consts";

export default defineConfig({
  site: SITE_URL,
  integrations: [markdoc(), sitemap()],
  prefetch: true,
  vite: {
    server: { open: true },
    plugins: [tailwindcss()],
  },
});
