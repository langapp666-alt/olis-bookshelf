export const siteName = "Oli's Bookshelf";
export const siteTagline = "Reading order for long series. Then what to read next.";

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
      "Long-arc fantasy where the hard part is not the plot. It is knowing which book is next, and which extra is not a book.",
  },
  "space-opera": {
    slug: "space-opera",
    label: "Space Opera / SFF",
    blurb:
      "Crews, stations, and political machinery. Novel versus novella, and the prequels that spoil if you treat them as on-ramps.",
  },
  "mystery-thriller": {
    slug: "mystery-thriller",
    label: "Mystery / Thriller",
    blurb:
      "Detective series in publication order, plus the spin-offs that look optional until a later book assumes you have read them.",
  },
  romance: {
    slug: "romance",
    label: "Romance",
    blurb:
      "Family sagas and long historical runs where the screen order is not the book order, and prequels look like book one.",
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

/** Title + author search. Do not invent ASINs; this is the required per-book link. */
export function amazonBookUrl(title: string, author: string, query?: string): string {
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
