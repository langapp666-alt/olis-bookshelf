import type { CollectionEntry } from "astro:content";
import { genres, type GenreSlug } from "./site";

/** High-traffic, often-misstarted series — one per desk slot, mixed shelves. */
export const featuredSlugs = [
  "empyrean-reading-order",
  "lord-of-the-rings-reading-order",
  "dune-novels-reading-order",
  "housemaid-reading-order",
  "harry-potter-reading-order",
  "murderbot-diaries-reading-order",
  "acotar-reading-order",
  "jack-reacher-reading-order",
] as const;

export const catalogChips: { slug: GenreSlug | ""; label: string }[] = [
  { slug: "", label: "All" },
  { slug: "epic-fantasy", label: "Fantasy" },
  { slug: "space-opera", label: "Space" },
  { slug: "mystery-thriller", label: "Mystery" },
  { slug: "romance", label: "Romance" },
];

export function catalogText(guide: CollectionEntry<"guides">): string {
  const genre = genres[guide.data.genre as GenreSlug];
  return [guide.data.series, guide.data.author, guide.data.title, genre.label]
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
