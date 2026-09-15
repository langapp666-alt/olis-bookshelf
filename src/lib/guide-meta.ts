import type { CollectionEntry } from "astro:content";

const SKIP_HEADINGS =
  /^(faq|sources|what to read next|common mistakes|house rules?|editorial|the working order)$/i;

/** Count titles listed in MDX OrderTable blocks without editing guide copy. */
export function orderBookCount(body: string | undefined): number {
  if (!body) return 0;
  let count = 0;
  const tables = body.matchAll(/<OrderTable[\s\S]*?books=\{\[([\s\S]*?)\]\}/g);
  for (const match of tables) {
    count += match[1].match(/title:\s*["'`]/g)?.length ?? 0;
  }
  return count;
}

export function formatTitleCount(count: number): string | null {
  if (count < 1) return null;
  return count === 1 ? "1 title" : `${count} titles`;
}

/** Short path labels from H2s — used as world-card chips. */
export function pathChips(body: string | undefined, limit = 3): string[] {
  if (!body) return [];
  return [...body.matchAll(/^## (.+)$/gm)]
    .map((match) => match[1].replace(/:$/, "").trim())
    .filter((heading) => !SKIP_HEADINGS.test(heading))
    .slice(0, limit);
}

export function withGuideMeta(guide: CollectionEntry<"guides">) {
  const count = orderBookCount(guide.body);
  return {
    count,
    countLabel: formatTitleCount(count),
    paths: pathChips(guide.body),
  };
}
