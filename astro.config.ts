// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "https://thefordfamily.life",

  // IMPORTANT: no base path when using a custom domain
  base: "/",

  output: "static",

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },
});
