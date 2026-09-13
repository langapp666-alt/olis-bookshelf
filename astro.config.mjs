import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://olis-bookshelf.pages.dev",
  output: "static",
  trailingSlash: "always",
  integrations: [mdx()],
});
