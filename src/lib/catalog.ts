import type { CollectionEntry } from "astro:content";
import { genres, type GenreSlug } from "./site";

/** High-traffic, often-misstarted series — one per desk slot, mixed shelves. */
export const featuredSlugs = [
  "empyrean-reading-order",
  "harry-potter-reading-order",
  "dune-novels-reading-order",
  "housemaid-reading-order",
  "acotar-reading-order",
  "murderbot-diaries-reading-order",
  "jack-reacher-reading-order",
  "lord-of-the-rings-reading-order",
] as const;

/**
 * Homepage “deep catalog” row. Prefer contested / weak-index maps so
 * high-authority home equity reaches them (GSC crawled-not-indexed + orphans).
 */
export const spotlightSlugs = [
  "divine-cities-founders-reading-order",
  "shadows-of-the-apt-reading-order",
  "riftwar-reading-order",
  "warrior-cats-reading-order",
  "kate-daniels-spin-offs-reading-order",
  "cosmere-starter-reading-order",
  "lunar-chronicles-reading-order",
  "the-expanse-reading-order",
  "shatter-me-reading-order",
  "bargainer-reading-order",
  "first-law-reading-order",
  "books-of-babel-reading-order",
] as const;

/**
 * Prefer these when previewing a genre shelf or hub — contested doors and
 * maps that need stronger internal links from high-authority pages.
 */
export const genrePrioritySlugs: Record<GenreSlug, readonly string[]> = {
  "epic-fantasy": [
    "kingkiller-chronicle-reading-order",
    "mistborn-era-1-2-reading-order",
    "roots-of-chaos-reading-order",
    "malazan-book-of-the-fallen-reading-order",
    "acotar-reading-order",
    "osten-ard-reading-order",
    "divine-cities-founders-reading-order",
    "shadows-of-the-apt-reading-order",
    "riftwar-reading-order",
    "warrior-cats-reading-order",
  ],
  "space-opera": [
    "murderbot-diaries-reading-order",
    "lunar-chronicles-reading-order",
    "the-expanse-reading-order",
    "dune-novels-reading-order",
    "red-rising-reading-order",
  ],
  "mystery-thriller": [
    "james-bond-reading-order",
    "jack-reacher-reading-order",
    "sherlock-holmes-reading-order",
    "housemaid-reading-order",
    "harry-bosch-reading-order",
    "in-death-reading-order",
    "kate-daniels-spin-offs-reading-order",
  ],
  romance: [
    "empyrean-reading-order",
    "shatter-me-reading-order",
    "bargainer-reading-order",
    "outlander-reading-order",
    "twilight-reading-order",
  ],
};

export const SHELF_PREVIEW = 6;

export const catalogChips: { slug: GenreSlug | ""; label: string }[] = [
  { slug: "", label: "All" },
  { slug: "epic-fantasy", label: "Fantasy" },
  { slug: "space-opera", label: "Space" },
  { slug: "mystery-thriller", label: "Mystery" },
  { slug: "romance", label: "Romance" },
];

export function catalogText(guide: CollectionEntry<"guides">): string {
  const genre = genres[guide.data.genre as GenreSlug];
  return [guide.data.series, guide.data.author, guide.data.title, guide.data.slug, genre.label]
    .join(" ")
    .toLowerCase();
}

export function sortGuides(guides: CollectionEntry<"guides">[]) {
  return [...guides].sort((a, b) => a.data.series.localeCompare(b.data.series));
}

export function guidesBySlug(
  guides: CollectionEntry<"guides">[],
  slugs: readonly string[],
) {
  const map = new Map(guides.map((guide) => [guide.data.slug, guide]));
  return slugs.flatMap((slug) => {
    const guide = map.get(slug);
    return guide ? [guide] : [];
  });
}

/** Stable order: priority slugs first (when present), then the rest unchanged. */
export function prioritizeGuides(
  guides: CollectionEntry<"guides">[],
  priority: readonly string[],
) {
  const bySlug = new Map(guides.map((guide) => [guide.data.slug, guide]));
  const seen = new Set<string>();
  const ordered: CollectionEntry<"guides">[] = [];
  for (const slug of priority) {
    const guide = bySlug.get(slug);
    if (guide) {
      ordered.push(guide);
      seen.add(slug);
    }
  }
  for (const guide of guides) {
    if (!seen.has(guide.data.slug)) ordered.push(guide);
  }
  return ordered;
}
