import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// Replace with your free Cloudflare Pages hostname after first deploy
// (for example https://olis-bookshelf.pages.dev).
export default defineConfig({
  site: "https://olis-bookshelf.pages.dev",
  output: "static",
  trailingSlash: "always",
  integrations: [mdx(), sitemap()],
});
