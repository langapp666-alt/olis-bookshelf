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

/** Longer or multi-door maps for the homepage “deep catalog” row. */
export const spotlightSlugs = [
  "roots-of-chaos-reading-order",
  "cosmere-starter-reading-order",
  "mistborn-era-1-2-reading-order",
  "books-of-babel-reading-order",
  "malazan-book-of-the-fallen-reading-order",
  "dark-tower-reading-order",
  "discworld-city-watch-reading-order",
  "the-expanse-reading-order",
  "first-law-reading-order",
] as const;

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
