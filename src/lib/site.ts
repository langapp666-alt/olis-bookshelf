import { ASIN_DEEP_LINKS_ENABLED } from "./asins";

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
      "Epic fantasy reading order: Kingkiller (Name of the Wind first), Mistborn Era 1 before Alloy, Cosmere, Malazan (Gardens first), Roots of Chaos (Priory first), Witcher, Dark Tower. Prequels labeled so they do not become book one.",
  },
  "space-opera": {
    slug: "space-opera",
    label: "Space Opera / SFF",
    blurb:
      "Space opera reading order: Murderbot (All Systems Red first), Lunar Chronicles (Cinder before Fairest), Expanse novels then novellas, Vorkosigan (Cordelia first), Red Rising not Iron Gold first. Prequels that spoil stay labeled.",
  },
  "mystery-thriller": {
    slug: "mystery-thriller",
    label: "Mystery / Thriller",
    blurb:
      "Mystery and thriller reading order: James Bond (Casino Royale, Fleming first), Reacher publication vs chronological, Sherlock, Thursday Murder Club, Rivers of London. Publication first; films and prequels labeled.",
  },
  romance: {
    slug: "romance",
    label: "Romance",
    blurb:
      "Romance reading order: Fourth Wing (2023), not Threshing Day. Shatter Me not Watch Me. Bargainer before the Emperor novella. Outlander, Twilight.",
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
 * Official Amazon product deep link. Only call with a *validated* amazon.com ASIN.
 * Open Library ISBN-10 is not enough — many codes 404 on www.amazon.com.
 * Shop CTAs currently use search via amazonBookUrl(); see docs/ASIN_DEEP_LINKS.md.
 */
export function amazonProductUrl(asin: string): string {
  const id = asin.trim().toUpperCase();
  const params = new URLSearchParams({ tag: affiliateTag });
  return `https://www.amazon.com/dp/${encodeURIComponent(id)}?${params.toString()}`;
}

/** Alias for amazonProductUrl — used by buy-intent starters. */
export function amazonAsinUrl(asin: string): string {
  return amazonProductUrl(asin);
}

export type AmazonBookLinkOptions = {
  query?: string;
  /** Validated amazon.com ASIN only. Ignored while ASIN_DEEP_LINKS_ENABLED is false. */
  asin?: string;
};

/**
 * Tagged title + author search by default. Emits `/dp/{ASIN}` only when
 * `ASIN_DEEP_LINKS_ENABLED` is true *and* a validated amazon.com ASIN is passed.
 * Accepts either options `{ query, asin }` or positional `(query, asin)`.
 */
export function amazonBookUrl(
  title: string,
  author: string,
  queryOrOptions?: string | AmazonBookLinkOptions,
  asin?: string,
): string {
  const options: AmazonBookLinkOptions =
    typeof queryOrOptions === "string"
      ? { query: queryOrOptions, asin }
      : (queryOrOptions ?? {});
  if (ASIN_DEEP_LINKS_ENABLED && options.asin?.trim()) {
    return amazonProductUrl(options.asin);
  }
  return amazonSearchUrl(options.query?.trim() || `${title} ${author}`);
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
