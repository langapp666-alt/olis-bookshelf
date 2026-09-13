import type { APIRoute } from "astro";
import { sitemapEntries, urlsetXml, xmlResponse } from "../lib/sitemap";

/** Same urlset as /sitemap.xml so an existing GSC child submission stays valid. */
export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL("https://olis-bookshelf.pages.dev");
  return xmlResponse(urlsetXml(await sitemapEntries(origin)));
};
