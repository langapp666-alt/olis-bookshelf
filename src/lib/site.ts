export const siteName = "Oli's Bookshelf";
export const siteTagline = "Series reading order, then what to read next.";

export const affiliateTag = "TODO_AFFILIATE_TAG";

export const genres = {
  "epic-fantasy": {
    slug: "epic-fantasy",
    label: "Epic Fantasy",
    blurb:
      "Long-arc fantasy where the question is less “what happens next” than “which book is next, and why.”",
  },
  "space-opera": {
    slug: "space-opera",
    label: "Space Opera / SFF",
    blurb:
      "Crews, stations, and political machinery. We track novel vs novella order and the prequels that spoil.",
  },
  "mystery-thriller": {
    slug: "mystery-thriller",
    label: "Mystery / Thriller",
    blurb:
      "Detective series with publication-order defaults, plus the spin-offs that look optional until they aren’t.",
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

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
