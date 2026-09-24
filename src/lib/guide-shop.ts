/**
 * First recommended title on a guide (spine OrderTable book 1 / "Start here").
 * Used for Book-1 Amazon CTAs — never invents titles.
 */
import { lookupAsin } from "./asins";
import { amazonBookUrl } from "./site";

export type RecommendedBook = {
  title: string;
  author: string;
  query?: string;
  asin?: string;
  href: string;
  isAsin: boolean;
  year?: string;
};

type ParsedRow = {
  title: string;
  author: string;
  query?: string;
  notes: string;
  startHere: boolean;
  stop: boolean;
  year?: string;
};

function foldTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Parse rows from the first OrderTable in guide MDX. */
export function parseOrderRows(body: string | undefined, fallbackAuthor: string): ParsedRow[] {
  if (!body) return [];
  const table = body.match(/<OrderTable([\s\S]*?)books=\{\[([\s\S]*?)\]\s*\}/);
  if (!table) return [];
  const attrs = table[1] ?? "";
  const booksBody = table[2] ?? "";
  const tableAuthor = attrs.match(/author=["']([^"']+)["']/)?.[1] ?? fallbackAuthor;

  const rows: ParsedRow[] = [];
  for (const object of booksBody.matchAll(/\{([\s\S]*?)\}/g)) {
    const chunk = object[1] ?? "";
    const title = chunk.match(/title:\s*["'`]([^"'`]+)["'`]/)?.[1]?.trim();
    if (!title) continue;
    const author = chunk.match(/author:\s*["'`]([^"'`]+)["'`]/)?.[1]?.trim() ?? tableAuthor;
    const query = chunk.match(/query:\s*["'`]([^"'`]+)["'`]/)?.[1]?.trim();
    const notes = chunk.match(/notes:\s*["'`]([^"'`]*)["'`]/)?.[1] ?? "";
    const year = chunk.match(/year:\s*["']?(\d{4})["']?/)?.[1];
    const stop = /do not start|not (an? )?(on-ramp|book one|required)/i.test(notes);
    const startHere = /start here/i.test(notes);
    rows.push({ title, author, query, notes, startHere, stop, year });
  }
  return rows;
}

function pickRow(rows: ParsedRow[]): ParsedRow | undefined {
  return rows.find((row) => row.startHere && !row.stop) ?? rows.find((row) => !row.stop) ?? rows[0];
}

/** Parse the first non-stop row from the first OrderTable in guide MDX. */
export function parseFirstRecommendedBook(
  body: string | undefined,
  fallbackAuthor: string,
): RecommendedBook | undefined {
  const pick = pickRow(parseOrderRows(body, fallbackAuthor));
  if (!pick) return undefined;
  return bookShopLink(pick.title, pick.author, pick.query, undefined, pick.year);
}

export function bookShopLink(
  title: string,
  author: string,
  query?: string,
  explicitAsin?: string,
  year?: string | number,
): RecommendedBook {
  const asin = lookupAsin(title, author, explicitAsin);
  const href = amazonBookUrl(title, author, { query, asin });
  const yearLabel = year !== undefined && String(year).trim() !== "" ? String(year) : undefined;
  return { title, author, query, asin, href, isAsin: Boolean(asin), year: yearLabel };
}

export function startHereTitle(body: string | undefined): string | undefined {
  if (!body) return undefined;
  const match = body.match(/<StartHere\s+title=["'`]([^"'`]+)["'`]/);
  return match?.[1]?.trim();
}

function yearForTitle(rows: ParsedRow[], title: string): string | undefined {
  const wanted = foldTitle(title);
  return rows.find((row) => foldTitle(row.title) === wanted)?.year;
}

/** Prefer StartHere title when it matches a spine row; else first recommended. */
export function guideBookOne(
  body: string | undefined,
  fallbackAuthor: string,
): RecommendedBook | undefined {
  const rows = parseOrderRows(body, fallbackAuthor);
  const pick = pickRow(rows);
  if (!pick) return undefined;
  const first = bookShopLink(pick.title, pick.author, pick.query, undefined, pick.year);
  const startTitle = startHereTitle(body);
  if (!startTitle) return first;
  // If StartHere names a specific door (and not a multi-door sentence), prefer that title.
  if (
    startTitle.length < 80 &&
    !/\s(?:—|–|-|or)\s/i.test(startTitle) &&
    foldTitle(startTitle) !== foldTitle(first.title)
  ) {
    return bookShopLink(startTitle, first.author, undefined, undefined, yearForTitle(rows, startTitle));
  }
  return first;
}

export type QuestionShopInput = {
  shortAnswerTitle: string;
  shortAnswer: string;
  buy?: {
    title: string;
    author: string;
    year?: number;
    query?: string;
    asin?: string;
  };
};

/**
 * Book one for a question hub. Uses explicit `buy` frontmatter when present.
 * Otherwise the linked guide's book one that the short answer names first.
 */
export function questionBookOne(
  question: QuestionShopInput,
  guides: { body?: string; author: string }[],
): RecommendedBook | undefined {
  if (question.buy) {
    return bookShopLink(
      question.buy.title,
      question.buy.author,
      question.buy.query,
      question.buy.asin,
      question.buy.year,
    );
  }
  const books = guides
    .map((guide) => guideBookOne(guide.body, guide.author))
    .filter((book): book is RecommendedBook => Boolean(book));
  if (books.length === 0) return undefined;
  const haystack = foldTitle(`${question.shortAnswerTitle}\n${question.shortAnswer}`);
  let best = books[0];
  let bestAt = Number.POSITIVE_INFINITY;
  for (const book of books) {
    const at = haystack.indexOf(foldTitle(book.title));
    if (at >= 0 && at < bestAt) {
      best = book;
      bestAt = at;
    }
  }
  return best;
}
