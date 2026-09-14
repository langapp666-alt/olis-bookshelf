import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

/** Keep in sync with src/lib/site.ts. */
const CANONICAL = "https://olisbookshelf.com";
const PAGES_DEV = "https://olis-bookshelf.pages.dev";

/**
 * Canonical origin for sitemap / robots / Astro.site.
 * PUBLIC_SITE_URL or SITE_URL still override, except a leftover
 * pages.dev value is treated as unset so this build ships .com.
 */
function siteOrigin() {
  const raw = (process.env.PUBLIC_SITE_URL || process.env.SITE_URL || "").trim().replace(/\/+$/, "");
  if (!raw || raw === PAGES_DEV) return CANONICAL;
  return raw;
}

export default defineConfig({
  site: siteOrigin(),
  output: "static",
  trailingSlash: "always",
  integrations: [mdx()],
});
