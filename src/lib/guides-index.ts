import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { guidesForQuestion, listedQuestions, questionHref } from "./questions";
import { isListedStatus, type GuideSearchEntry } from "./search";

export function toSearchEntry(guide: CollectionEntry<"guides">): GuideSearchEntry {
  return {
    slug: guide.data.slug,
    title: guide.data.title,
    series: guide.data.series,
    author: guide.data.author,
    href: `/guides/${guide.data.slug}/`,
    kind: "guide",
  };
}

export function listedGuides(guides: CollectionEntry<"guides">[]): CollectionEntry<"guides">[] {
  return guides.filter((guide) => isListedStatus(guide.data.status));
}

export async function publishedSearchIndex(): Promise<GuideSearchEntry[]> {
  const guides = listedGuides(await getCollection("guides"));
  const questions = listedQuestions(await getCollection("questions"));
  const guideEntries = guides.map(toSearchEntry);
  const questionEntries: GuideSearchEntry[] = questions.map((question) => {
    const related = guidesForQuestion(question, guides);
    return {
      slug: question.data.slug,
      title: question.data.title,
      series: question.data.title,
      author: related[0]?.data.author ?? "Oli's Bookshelf",
      href: questionHref(question.data.slug),
      kind: "question",
      keywords: related.map((guide) => `${guide.data.series} ${guide.data.author}`).join(" "),
    };
  });
  return [...guideEntries, ...questionEntries].sort((a, b) =>
    a.series.localeCompare(b.series),
  );
}
