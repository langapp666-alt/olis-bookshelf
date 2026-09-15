import type { APIRoute } from "astro";
import { siteOrigin } from "../lib/site";
import { sitemapIndexXml, xmlResponse } from "../lib/sitemap";

/** Compatibility alias for older GSC submissions. Not advertised in robots.txt. */
export const GET: APIRoute = async ({ site }) => {
  const origin = siteOrigin(site);
  return xmlResponse(sitemapIndexXml([new URL("sitemap.xml", origin).href]));
};
