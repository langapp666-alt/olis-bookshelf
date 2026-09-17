import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { isListedStatus } from "./search";

export type Question = CollectionEntry<"questions">;

export function questionHref(slug: string): string {
  return `/questions/${slug}/`;
}

/**
 * Homepage and catalog promo — high-intent hubs, human-scannable order.
 * Keep in sync with published `src/content/questions/` slugs.
 */
export const popularQuestionSlugs = [
  "where-to-start-the-cosmere",
  "where-to-start-the-witcher",
  "where-to-start-the-dark-tower",
  "where-to-start-vorkosigan",
  "narnia-publication-or-chronological",
  "jack-reacher-publication-or-chronological",
  "where-to-start-discworld",
  "acotar-or-throne-of-glass",
  "where-to-start-malazan",
  "hobbit-or-silmarillion-first",
] as const;

export function questionsBySlug(questions: Question[], slugs: readonly string[]): Question[] {
  const map = new Map(questions.map((question) => [question.data.slug, question]));
  return slugs.flatMap((slug) => {
    const question = map.get(slug);
    return question ? [question] : [];
  });
}

export function listedQuestions(questions: Question[]): Question[] {
  return questions.filter((question) => isListedStatus(question.data.status));
}

export async function publishedQuestions(): Promise<Question[]> {
  return listedQuestions(await getCollection("questions")).sort((a, b) =>
    a.data.title.localeCompare(b.data.title),
  );
}

export function questionsForGuide(questions: Question[], guideSlug: string): Question[] {
  return questions.filter((question) => question.data.guides.includes(guideSlug));
}

export function guidesForQuestion(
  question: Question,
  guides: CollectionEntry<"guides">[],
): CollectionEntry<"guides">[] {
  const bySlug = new Map(guides.map((guide) => [guide.data.slug, guide]));
  return question.data.guides
    .map((slug) => bySlug.get(slug))
    .filter((guide): guide is CollectionEntry<"guides"> => Boolean(guide));
}
