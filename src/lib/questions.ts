import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { isListedStatus } from "./search";

export type Question = CollectionEntry<"questions">;

export function questionHref(slug: string): string {
  return `/questions/${slug}/`;
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
