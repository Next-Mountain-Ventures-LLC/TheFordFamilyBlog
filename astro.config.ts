// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Required for GitHub Pages
  site: "https://next-mountain-ventures-llc.github.io",

  // Repo name (NO trailing slash)
  base: "/TheFordFamilyBlog",

  output: "static",

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },
});
