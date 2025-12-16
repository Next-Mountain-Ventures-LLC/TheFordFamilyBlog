// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// Use base path only in production for GitHub Pages
// In development, serve from root
const isProduction = process.env.NODE_ENV === 'production';

// GitHub Pages configuration
// Site URL will be set via environment variable in GitHub Actions
// Local development uses localhost, production uses GitHub Pages URL
export default defineConfig({
  site: process.env.SITE_URL || "http://localhost:4321",
  base: isProduction ? "/TheFordFamilyBlog/" : "/",
  integrations: [react()],
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
});
