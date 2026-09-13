import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { affiliateRel } from "./src/lib/affiliate-rel.ts";

export default defineConfig({
  site: "https://olis-bookshelf.pages.dev",
  output: "static",
  trailingSlash: "always",
  markdown: {
    rehypePlugins: [affiliateRel],
  },
  integrations: [mdx({ rehypePlugins: [affiliateRel] }), sitemap()],
});
