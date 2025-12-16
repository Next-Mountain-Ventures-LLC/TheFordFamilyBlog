// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// Custom domain configuration for GitHub Pages
// Using thefourfamily.life as the production domain
export default defineConfig({
  site: process.env.SITE_URL || "http://thefourfamily.life",
  base: "/",
  integrations: [react()],
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
});
