import type { APIRoute } from "astro";
import { siteOrigin } from "../lib/site";

/** Advertise only the urlset. Compatibility aliases are not listed. */

const getRobotsTxt = (site: URL) => `User-agent: *
Allow: /

Sitemap: ${new URL("sitemap.xml", site).href}
`;

export const GET: APIRoute = ({ site }) => {
  const origin = siteOrigin(site);
  return new Response(getRobotsTxt(origin), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
