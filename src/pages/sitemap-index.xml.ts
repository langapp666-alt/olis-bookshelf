import type { APIRoute } from "astro";
import { sitemapIndexXml, xmlResponse } from "../lib/sitemap";

/** Index points at the single urlset. GSC can submit either URL. */
export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL("https://olis-bookshelf.pages.dev");
  return xmlResponse(sitemapIndexXml([new URL("sitemap.xml", origin).href]));
};
