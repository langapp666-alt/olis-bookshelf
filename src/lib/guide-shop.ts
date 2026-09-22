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
};

/** Parse the first non-stop row from the first OrderTable in guide MDX. */
export function parseFirstRecommendedBook(
  body: string | undefined,
  fallbackAuthor: string,
): RecommendedBook | undefined {
  if (!body) return undefined;
  const table = body.match(/<OrderTable([\s\S]*?)books=\{\[([\s\S]*?)\]\s*\}/);
  if (!table) return undefined;
  const attrs = table[1] ?? "";
  const booksBody = table[2] ?? "";
  const tableAuthor = attrs.match(/author=["']([^"']+)["']/)?.[1] ?? fallbackAuthor;

  type Row = {
    title: string;
    author: string;
    query?: string;
    notes: string;
    startHere: boolean;
    stop: boolean;
  };
  const rows: Row[] = [];
  for (const object of booksBody.matchAll(/\{([\s\S]*?)\}/g)) {
    const chunk = object[1] ?? "";
    const title = chunk.match(/title:\s*["'`]([^"'`]+)["'`]/)?.[1]?.trim();
    if (!title) continue;
    const author =
      chunk.match(/author:\s*["'`]([^"'`]+)["'`]/)?.[1]?.trim() ?? tableAuthor;
    const query = chunk.match(/query:\s*["'`]([^"'`]+)["'`]/)?.[1]?.trim();
    const notes = chunk.match(/notes:\s*["'`]([^"'`]*)["'`]/)?.[1] ?? "";
    const stop = /do not start|not (an? )?(on-ramp|book one|required)/i.test(notes);
    const startHere = /start here/i.test(notes);
    rows.push({ title, author, query, notes, startHere, stop });
  }
  const pick = rows.find((row) => row.startHere && !row.stop) ?? rows.find((row) => !row.stop) ?? rows[0];
  if (!pick) return undefined;
  return bookShopLink(pick.title, pick.author, pick.query);
}

export function bookShopLink(
  title: string,
  author: string,
  query?: string,
  explicitAsin?: string,
): RecommendedBook {
  const asin = lookupAsin(title, author, explicitAsin);
  const href = amazonBookUrl(title, author, { query, asin });
  return { title, author, query, asin, href, isAsin: Boolean(asin) };
}

export function startHereTitle(body: string | undefined): string | undefined {
  if (!body) return undefined;
  const match = body.match(/<StartHere\s+title=["'`]([^"'`]+)["'`]/);
  return match?.[1]?.trim();
}

/** Prefer StartHere title when it matches a spine row; else first recommended. */
export function guideBookOne(
  body: string | undefined,
  fallbackAuthor: string,
): RecommendedBook | undefined {
  const first = parseFirstRecommendedBook(body, fallbackAuthor);
  const startTitle = startHereTitle(body);
  if (!first) return undefined;
  if (!startTitle) return first;
  // If StartHere names a specific door (and not a multi-door sentence), prefer that title.
  if (
    startTitle.length < 80 &&
    !/\s(?:—|–|-|or)\s/i.test(startTitle) &&
    startTitle.toLowerCase() !== first.title.toLowerCase()
  ) {
    return bookShopLink(startTitle, first.author);
  }
  return first;
}
