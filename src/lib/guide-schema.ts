/**
 * Parse guide MDX for JSON-LD. Keep this conservative: never invent books,
 * never claim a table is a complete official canon.
 */

export type FaqPair = { question: string; answer: string };
export type ListedTitle = { title: string; n?: string };

/** First-read door for Amazon CTAs — never invent titles. */
export type BookOne = {
  title: string;
  author?: string;
  year?: string | number;
  query?: string;
};

function stripMdxComments(text: string): string {
  return text.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
}

function parseOrderTableBooks(body: string): Array<BookOne & { n?: string; notes?: string }> {
  const match = body.match(/<OrderTable[\s\S]*?books=\{\[([\s\S]*?)\]\s*\}/);
  if (!match?.[1]) return [];
  const books: Array<BookOne & { n?: string; notes?: string }> = [];
  for (const object of match[1].matchAll(/\{([\s\S]*?)\}/g)) {
    const block = object[1] ?? "";
    const title = block.match(/title:\s*["'`]([^"'`]+)["'`]/)?.[1]?.trim();
    if (!title) continue;
    const n = block.match(/\bn:\s*(?:["'`]([^"'`]+)["'`]|(\d+(?:\.\d+)?))/);
    const year = block.match(/\byear:\s*(?:["'`]([^"'`]+)["'`]|(\d{4}))/);
    const author = block.match(/\bauthor:\s*["'`]([^"'`]+)["'`]/)?.[1]?.trim();
    const query = block.match(/\bquery:\s*["'`]([^"'`]+)["'`]/)?.[1]?.trim();
    const notes = block.match(/\bnotes:\s*["'`]([^"'`]+)["'`]/)?.[1]?.trim();
    books.push({
      title,
      n: n?.[1] ?? n?.[2],
      year: year?.[1] ?? year?.[2],
      author,
      query,
      notes,
    });
  }
  return books;
}

function parseStartHereTitle(body: string): string | undefined {
  return body.match(/<StartHere\s+[^>]*title=["'`]([^"'`]+)["'`]/)?.[1]?.trim();
}

/**
 * Book-1 Amazon target for a guide. Prefer the editorial StartHere title,
 * then an OrderTable row marked “Start here”, then n=1 / first spine row.
 */
export function parseBookOne(body: string | undefined): BookOne | null {
  if (!body) return null;
  const stripped = stripMdxComments(body);
  const books = parseOrderTableBooks(stripped);
  const startTitle = parseStartHereTitle(stripped);

  if (startTitle) {
    const matched = books.find(
      (book) => book.title.toLowerCase() === startTitle.toLowerCase(),
    );
    return matched
      ? {
          title: matched.title,
          author: matched.author,
          year: matched.year,
          query: matched.query,
        }
      : { title: startTitle };
  }

  const marked = books.find((book) => {
    const notes = (book.notes ?? "").toLowerCase();
    return /start here/.test(notes) && !/not (an? )?(on-ramp|starting|book one)/.test(notes);
  });
  if (marked) {
    return {
      title: marked.title,
      author: marked.author,
      year: marked.year,
      query: marked.query,
    };
  }

  const numbered = books.find((book) => book.n === "1");
  const pick = numbered ?? books[0];
  if (!pick) return null;
  return {
    title: pick.title,
    author: pick.author,
    year: pick.year,
    query: pick.query,
  };
}

export function parseFaqPairs(body: string | undefined): FaqPair[] {
  if (!body) return [];
  const stripped = stripMdxComments(body);
  const after = stripped.split(/^## FAQ\s*$/m)[1];
  if (!after) return [];
  const section = after.split(/^## /m)[0] ?? "";
  const pairs: FaqPair[] = [];
  const matches = section.matchAll(/\*\*(.+?)\*\*[ \t]*\n+([\s\S]*?)(?=\n\*\*|\n*$)/g);
  for (const match of matches) {
    const question = match[1]?.replace(/\s+/g, " ").trim();
    const answer = match[2]
      ?.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
    if (question && answer) pairs.push({ question, answer });
  }
  return pairs;
}

/** First OrderTable on the page — usually the spine, not extras. */
export function parseFirstOrderTableTitles(body: string | undefined): ListedTitle[] {
  if (!body) return [];
  return parseOrderTableBooks(stripMdxComments(body)).map((book) => ({
    title: book.title,
    n: book.n,
  }));
}

export function faqPageSchema(
  pairs: FaqPair[],
  pageUrl: string,
): Record<string, unknown> | null {
  if (pairs.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: pageUrl,
    mainEntity: pairs.map((pair) => ({
      "@type": "Question",
      name: pair.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: pair.answer,
      },
    })),
  };
}

export function itemListSchema(
  titles: ListedTitle[],
  name: string,
  pageUrl: string,
): Record<string, unknown> | null {
  if (titles.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: pageUrl,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: titles.length,
    itemListElement: titles.map((book, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: book.title,
    })),
  };
}

export function breadcrumbSchema(
  crumbs: { name: string; item: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

export function webPageSchema(input: {
  name: string;
  description: string;
  url: string;
  origin: string;
  siteName: string;
  image?: string;
  dateModified?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: input.url,
    isPartOf: {
      "@type": "WebSite",
      name: input.siteName,
      url: input.origin,
    },
    ...(input.image ? { primaryImageOfPage: input.image } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  url: string;
  dateModified: string;
  siteName: string;
  image?: string;
  logo?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    dateModified: input.dateModified,
    mainEntityOfPage: input.url,
    author: { "@type": "Organization", name: input.siteName },
    publisher: {
      "@type": "Organization",
      name: input.siteName,
      ...(input.logo
        ? { logo: { "@type": "ImageObject", url: input.logo } }
        : {}),
    },
    ...(input.image ? { image: input.image } : {}),
  };
}
