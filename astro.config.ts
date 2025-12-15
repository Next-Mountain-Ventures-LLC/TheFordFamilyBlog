// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// Use base path only in production for GitHub Pages
// In development, serve from root
const isProduction = process.env.NODE_ENV === 'production';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "http://localhost:4321",
  base: isProduction ? "/TheFordFamilyBlog/" : "/",
  integrations: [react()],
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
});
