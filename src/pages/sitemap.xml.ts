import type { APIRoute } from "astro";
import { siteOrigin } from "../lib/site";
import { sitemapEntries, urlsetXml, xmlResponse } from "../lib/sitemap";

export const GET: APIRoute = async ({ site }) => {
  const origin = siteOrigin(site);
  return xmlResponse(urlsetXml(await sitemapEntries(origin)));
};
