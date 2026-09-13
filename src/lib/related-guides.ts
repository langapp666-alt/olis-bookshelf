import type { CollectionEntry } from "astro:content";

type Guide = CollectionEntry<"guides">;

function normalizeAuthor(author: string): string {
  return author.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/** Stable FNV-1a so the same page always shows the same neighbors. */
function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function rotate<T>(items: T[], offset: number): T[] {
  if (items.length < 2) return items;
  const start = offset % items.length;
  return items.slice(start).concat(items.slice(0, start));
}

/**
 * Same-author guides first (Discworld, Maas, Cosmere, King), then other
 * same-shelf titles. Used for the small related-guides strip.
 */
export function relatedGuides(current: Guide, all: Guide[], limit = 5): Guide[] {
  const others = all.filter((guide) => guide.data.slug !== current.data.slug);
  const author = normalizeAuthor(current.data.author);

  const sameAuthor = others
    .filter((guide) => normalizeAuthor(guide.data.author) === author)
    .sort((a, b) => a.data.series.localeCompare(b.data.series));

  const taken = new Set(sameAuthor.map((guide) => guide.data.slug));
  const sameShelf = others
    .filter((guide) => guide.data.genre === current.data.genre && !taken.has(guide.data.slug))
    .sort((a, b) => a.data.series.localeCompare(b.data.series));

  const neighbors = [...sameAuthor, ...rotate(sameShelf, hashSeed(current.data.slug))];
  return neighbors.slice(0, limit);
}
