export const siteName = "Oli's Bookshelf";
export const siteTagline = "Reading order for long series. Then what to read next.";

/**
 * Canonical public origin. Cloudflare Pages also serves
 * https://olis-bookshelf.pages.dev as an alternate host; keep in-app
 * links relative so both work. Canonical / OG / sitemap URLs use .com.
 */
export const canonicalSiteOrigin = "https://olisbookshelf.com";
export const pagesDevOrigin = "https://olis-bookshelf.pages.dev";
export const defaultSiteOrigin = canonicalSiteOrigin;

function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

/** Prefer the custom domain; treat a leftover pages.dev env as unset. */
export function resolveConfiguredOrigin(raw?: string): string {
  const origin = raw ? normalizeOrigin(raw) : "";
  if (!origin || origin === pagesDevOrigin) return canonicalSiteOrigin;
  return origin;
}

export function siteOrigin(site?: URL | string | undefined): URL {
  if (site instanceof URL) return new URL(resolveConfiguredOrigin(site.origin));
  if (typeof site === "string" && site.trim()) {
    return new URL(resolveConfiguredOrigin(site));
  }
  return new URL(canonicalSiteOrigin);
}

/** Confirmed public brand channels. Do not invent handles or follower counts. */
export const socials = [
  {
    id: "youtube",
    label: "YouTube",
    handle: "@olisbookshelf",
    href: "https://www.youtube.com/@olisbookshelf",
    inFooter: true,
  },
  {
    id: "x",
    label: "X",
    handle: "@OlisBookshelf",
    href: "https://x.com/OlisBookshelf",
    inFooter: true,
  },
  {
    id: "goodreads",
    label: "Goodreads",
    handle: "olisbookshelfofficial",
    href: "https://www.goodreads.com/olisbookshelfofficial",
    inFooter: false,
  },
] as const;

export type SocialId = (typeof socials)[number]["id"];

/** Public Amazon Associates tag. Override with PUBLIC_AFFILIATE_TAG if needed. */
export const affiliateTag =
  import.meta.env.PUBLIC_AFFILIATE_TAG?.trim() || "olisbookshelf-20";

/** Required on every Associates outbound link. */
export const amazonRel = "sponsored nofollow";

export const genres = {
  "epic-fantasy": {
    slug: "epic-fantasy",
    label: "Epic Fantasy",
    blurb:
      "Epic fantasy reading order: Witcher, Cosmere, Dark Tower, Malazan Book of the Fallen, Roots of Chaos (Priory first), Books of Babel. Prequels labeled so they do not become book one.",
  },
  "space-opera": {
    slug: "space-opera",
    label: "Space Opera / SFF",
    blurb:
      "Space opera reading order: Vorkosigan (Cordelia first), Expanse novels then novellas, Red Rising not Iron Gold first. Prequels that spoil stay labeled.",
  },
  "mystery-thriller": {
    slug: "mystery-thriller",
    label: "Mystery / Thriller",
    blurb:
      "Mystery and thriller reading order: Reacher publication vs chronological, Sherlock, Thursday Murder Club, Rivers of London. Publication first; prequels labeled.",
  },
  romance: {
    slug: "romance",
    label: "Romance",
    blurb:
      "Family sagas, romantasy runs, and long historical shelves where the screen order is not the book order, and prequels look like book one.",
  },
} as const;

export type GenreSlug = keyof typeof genres;

export function amazonSearchUrl(query: string): string {
  const params = new URLSearchParams({
    k: query,
    tag: affiliateTag,
  });
  return `https://www.amazon.com/s?${params.toString()}`;
}

/**
 * Deep link when a verified ASIN is already in content data.
 * Do not invent ASINs — prefer search via amazonBookUrl when unsure.
 */
export function amazonAsinUrl(asin: string): string {
  const clean = asin.trim().toUpperCase();
  const params = new URLSearchParams({ tag: affiliateTag });
  return `https://www.amazon.com/dp/${clean}?${params.toString()}`;
}

/**
 * Per-title Amazon link. Uses an ASIN deep link only when one is supplied
 * in data; otherwise title + author search. Do not invent ASINs.
 */
export function amazonBookUrl(
  title: string,
  author: string,
  query?: string,
  asin?: string,
): string {
  if (asin?.trim()) return amazonAsinUrl(asin);
  return amazonSearchUrl(query?.trim() || `${title} ${author}`);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
