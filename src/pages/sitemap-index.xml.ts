import type { APIRoute } from "astro";
import { siteOrigin } from "../lib/site";
import { sitemapIndexXml, xmlResponse } from "../lib/sitemap";

/** Index points at the single urlset. GSC can submit either URL. */
export const GET: APIRoute = async ({ site }) => {
  const origin = siteOrigin(site);
  return xmlResponse(sitemapIndexXml([new URL("sitemap.xml", origin).href]));
};
