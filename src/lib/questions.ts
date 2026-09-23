import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { isListedStatus } from "./search";
import type { GenreSlug } from "./site";

export type Question = CollectionEntry<"questions">;

export function questionHref(slug: string): string {
  return `/questions/${slug}/`;
}

/**
 * Homepage and catalog promo — high-intent hubs, human-scannable order.
 * Keep in sync with published `src/content/questions/` slugs.
 */
export const popularQuestionSlugs = [
  "what-to-read-after-acotar",
  "where-to-start-roots-of-chaos",
  "where-to-start-malazan",
  "where-to-start-the-cosmere",
  "mistborn-era-1-or-era-2",
  "where-to-start-books-of-babel",
  "where-to-start-the-dark-tower",
  "where-to-start-harry-potter",
  "where-to-start-discworld",
  "where-to-start-silo",
  "where-to-start-dune",
  "jack-reacher-publication-or-chronological",
  "where-to-start-acotar",
  "where-to-start-the-expanse",
  "where-to-start-the-witcher",
  "drizzt-homeland-or-crystal-shard",
  "where-to-start-laundry-files",
  "belgariad-belgarath-first",
  "where-to-start-osten-ard",
  "divine-cities-or-founders",
  "shadows-of-the-apt-or-children-of-time",
  "riftwar-magician-or-empire",
  "where-to-start-harry-bosch",
  "where-to-start-in-death",
  "gunmetal-magic-or-magic-bites",
  "warrior-cats-sun-trail-or-into-the-wild",
] as const;

/**
 * Genre-hub “common questions” preview. Weak and new P3 doors first, then a
 * few high-traffic questions, so alpha order does not bury them past the fold.
 */
export const genreQuestionPriority: Record<GenreSlug, readonly string[]> = {
  "epic-fantasy": [
    "where-to-start-osten-ard",
    "divine-cities-or-founders",
    "shadows-of-the-apt-or-children-of-time",
    "riftwar-magician-or-empire",
    "warrior-cats-sun-trail-or-into-the-wild",
    "artemis-fowl-series-order",
    "what-to-read-after-acotar",
    "where-to-start-discworld",
    "drizzt-homeland-or-crystal-shard",
  ],
  "space-opera": [
    "foreigner-start-later-arc",
    "where-to-start-the-expanse",
    "where-to-start-dune",
    "where-to-start-red-rising",
    "where-to-start-vorkosigan",
  ],
  "mystery-thriller": [
    "where-to-start-laundry-files",
    "where-to-start-harry-bosch",
    "where-to-start-in-death",
    "gunmetal-magic-or-magic-bites",
    "jack-reacher-publication-or-chronological",
    "where-to-start-rivers-of-london",
    "where-to-start-sherlock-holmes",
  ],
  romance: ["hades-persephone-touch-or-game"],
};

export function prioritizeQuestions(questions: Question[], priority: readonly string[]): Question[] {
  const bySlug = new Map(questions.map((question) => [question.data.slug, question]));
  const seen = new Set<string>();
  const ordered: Question[] = [];
  for (const slug of priority) {
    const question = bySlug.get(slug);
    if (question) {
      ordered.push(question);
      seen.add(slug);
    }
  }
  for (const question of questions) {
    if (!seen.has(question.data.slug)) ordered.push(question);
  }
  return ordered;
}

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
