/**
 * Parse guide MDX for JSON-LD. Keep this conservative: never invent books,
 * never claim a table is a complete official canon.
 */

export type FaqPair = { question: string; answer: string };
export type ListedTitle = { title: string; n?: string };

function stripMdxComments(text: string): string {
  return text.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
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
  const match = body.match(/<OrderTable[\s\S]*?books=\{\[([\s\S]*?)\]\s*\}/);
  if (!match?.[1]) return [];
  const titles: ListedTitle[] = [];
  const objects = match[1].matchAll(/\{([\s\S]*?)\}/g);
  for (const object of objects) {
    const block = object[1] ?? "";
    const title = block.match(/title:\s*["'`]([^"'`]+)["'`]/)?.[1]?.trim();
    if (!title) continue;
    const n = block.match(/\bn:\s*(?:["'`]([^"'`]+)["'`]|(\d+(?:\.\d+)?))/);
    titles.push({ title, n: n?.[1] ?? n?.[2] });
  }
  return titles;
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
