import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { isListedStatus, type GuideSearchEntry } from "./search";

export function toSearchEntry(guide: CollectionEntry<"guides">): GuideSearchEntry {
  return {
    slug: guide.data.slug,
    title: guide.data.title,
    series: guide.data.series,
    author: guide.data.author,
    href: `/guides/${guide.data.slug}/`,
  };
}

export function listedGuides(guides: CollectionEntry<"guides">[]): CollectionEntry<"guides">[] {
  return guides.filter((guide) => isListedStatus(guide.data.status));
}

export async function publishedSearchIndex(): Promise<GuideSearchEntry[]> {
  const guides = listedGuides(await getCollection("guides"));
  return guides
    .map(toSearchEntry)
    .sort((a, b) => a.series.localeCompare(b.series));
}
