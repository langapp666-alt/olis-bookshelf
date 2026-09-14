import type { APIRoute } from "astro";
import { siteOrigin } from "../lib/site";
import { sitemapEntries, urlsetXml, xmlResponse } from "../lib/sitemap";

/** Same urlset as /sitemap.xml so an existing GSC child submission stays valid. */
export const GET: APIRoute = async ({ site }) => {
  const origin = siteOrigin(site);
  return xmlResponse(urlsetXml(await sitemapEntries(origin)));
};
