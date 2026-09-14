import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

/** Swap later with PUBLIC_SITE_URL or SITE_URL (no trailing slash). */
function siteOrigin() {
  const raw =
    process.env.PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    "https://olis-bookshelf.pages.dev";
  return raw.replace(/\/+$/, "");
}

export default defineConfig({
  site: siteOrigin(),
  output: "static",
  trailingSlash: "always",
  integrations: [mdx()],
});
