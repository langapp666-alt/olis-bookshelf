export type GuideSearchEntry = {
  slug: string;
  title: string;
  series: string;
  author: string;
  href: string;
  kind?: "guide" | "question";
  keywords?: string;
};

export function isListedStatus(status: string | undefined): boolean {
  return status !== "draft";
}

export function matchGuides(
  index: readonly GuideSearchEntry[],
  query: string,
  limit = 8,
): GuideSearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored: { entry: GuideSearchEntry; score: number }[] = [];

  for (const entry of index) {
    const fields = [entry.series, entry.title, entry.author, entry.slug, entry.keywords ?? ""];
    let score = 0;

    for (const field of fields) {
      const hay = field.toLowerCase();
      if (hay === q) score = Math.max(score, 100);
      else if (hay.startsWith(q)) score = Math.max(score, 80);
      else if (hay.includes(q)) score = Math.max(score, 55);
    }

    const blob =
      `${entry.series} ${entry.author} ${entry.title} ${entry.slug} ${entry.keywords ?? ""}`.toLowerCase();
    if (score === 0 && blob.includes(q)) score = 30;
    if (score > 0) scored.push({ entry, score });
  }

  scored.sort(
    (a, b) => b.score - a.score || a.entry.series.localeCompare(b.entry.series),
  );
  return scored.slice(0, limit).map((row) => row.entry);
}

export function pickRandomGuide(
  index: readonly GuideSearchEntry[],
  exceptSlug?: string,
): GuideSearchEntry | undefined {
  const listed = index.filter((entry) => entry.kind !== "question");
  const pool = exceptSlug ? listed.filter((entry) => entry.slug !== exceptSlug) : listed;
  if (pool.length === 0) return undefined;
  const i = Math.floor(Math.random() * pool.length);
  return pool[i];
}

export function currentGuideSlug(pathname: string): string | undefined {
  const match = pathname.match(/\/guides\/([^/]+)\/?$/);
  const slug = match?.[1];
  if (!slug || slug === "index") return undefined;
  return slug;
}
