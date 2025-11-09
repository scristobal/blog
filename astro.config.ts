import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { SITE_URL } from "./src/consts";

export default defineConfig({
  site: SITE_URL,
  integrations: [mdx(), sitemap()],
  prefetch: true,
  vite: {
    server: { open: true },
    plugins: [tailwindcss()],
  },
});
