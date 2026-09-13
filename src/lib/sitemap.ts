import { getCollection } from "astro:content";
import { genres } from "./site";

export type SitemapEntry = {
  path: string;
  lastmod?: Date;
};

const STATIC_PAGES = [
  "/",
  "/guides/",
  "/about/",
  "/methodology/",
  "/disclosure/",
  ...Object.keys(genres).map((slug) => `/genres/${slug}/`),
];

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function sitemapEntries(site: URL): Promise<{ loc: string; lastmod: string }[]> {
  const guides = await getCollection("guides");
  const newestGuide = guides.reduce<Date | undefined>((latest, guide) => {
    const date = guide.data.lastVerified;
    if (!latest || date > latest) return date;
    return latest;
  }, undefined);

  const entries: SitemapEntry[] = [
    ...STATIC_PAGES.map((path) => ({ path, lastmod: newestGuide })),
    ...guides.map((guide) => ({
      path: `/guides/${guide.data.slug}/`,
      lastmod: guide.data.lastVerified,
    })),
  ];

  entries.sort((a, b) => a.path.localeCompare(b.path));

  return entries.map((entry) => ({
    loc: new URL(entry.path, site).href,
    lastmod: isoDate(entry.lastmod ?? new Date()),
  }));
}

export function urlsetXml(urls: { loc: string; lastmod: string }[]): string {
  const body = urls
    .map(
      (url) =>
        `  <url>\n    <loc>${escapeXml(url.loc)}</loc>\n    <lastmod>${url.lastmod}</lastmod>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function sitemapIndexXml(locs: string[]): string {
  const body = locs
    .map((loc) => `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>\n  </sitemap>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
