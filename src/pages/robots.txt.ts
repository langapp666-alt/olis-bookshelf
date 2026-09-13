import type { APIRoute } from "astro";

const getRobotsTxt = (site: URL) => `User-agent: *
Allow: /

Sitemap: ${new URL("sitemap.xml", site).href}
Sitemap: ${new URL("sitemap-index.xml", site).href}
`;

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL("https://olis-bookshelf.pages.dev");
  return new Response(getRobotsTxt(origin), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
