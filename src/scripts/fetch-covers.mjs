/**
 * Look up Open Library cover IDs for titles used in guides.
 * Writes src/data/covers.json. Does not invent ASINs.
 *
 * Usage: node src/scripts/fetch-covers.mjs
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const guidesDir = path.join(root, "src/content/guides");
const outFile = path.join(root, "src/data/covers.json");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function coverKey(title, author) {
  return `${normalize(title)}|${normalize(author)}`;
}

function extractBooks(source) {
  const books = [];
  const authorMatch = source.match(/author="([^"]+)"/);
  const defaultAuthor = authorMatch?.[1] ?? "";
  const bookBlocks = source.matchAll(/\{\s*n:[\s\S]*?\}|\{\s*title:[\s\S]*?\}/g);
  for (const block of bookBlocks) {
    const chunk = block[0];
    const title = chunk.match(/title:\s*"([^"]+)"/)?.[1];
    if (!title) continue;
    const author = chunk.match(/author:\s*"([^"]+)"/)?.[1] ?? defaultAuthor;
    books.push({ title, author });
  }
  const series = source.match(/^series:\s*(.+)$/m)?.[1]?.replace(/^"|"$/g, "");
  const guideAuthor = source.match(/^author:\s*(.+)$/m)?.[1]?.replace(/^"|"$/g, "");
  if (series && guideAuthor) books.push({ title: series, author: guideAuthor, seriesKey: true });
  return books;
}

async function searchOpenLibrary(title, author) {
  const url = new URL("https://openlibrary.org/search.json");
  url.searchParams.set("title", title);
  url.searchParams.set("author", author);
  url.searchParams.set("limit", "5");
  const res = await fetch(url, {
    headers: { "User-Agent": "OlisBookshelf/1.0 (reading-order covers; openlibrary)" },
  });
  if (!res.ok) throw new Error(`OL ${res.status} for ${title}`);
  const data = await res.json();
  const docs = data.docs ?? [];
  const wanted = normalize(title);
  const match =
    docs.find((doc) => normalize(doc.title ?? "") === wanted && doc.cover_i) ??
    docs.find((doc) => normalize(doc.title ?? "").includes(wanted) && doc.cover_i) ??
    docs.find((doc) => doc.cover_i);
  if (!match) return undefined;
  const record = {};
  if (match.cover_i) record.coverId = match.cover_i;
  if (match.cover_edition_key) record.olid = match.cover_edition_key;
  const isbn = (match.isbn ?? []).find((value) => /^\d{10,13}$/.test(value));
  if (isbn) record.isbn = isbn;
  return record;
}

const files = (await readdir(guidesDir)).filter((name) => name.endsWith(".mdx"));
const existing = JSON.parse(await readFile(outFile, "utf8").catch(() => "{}"));
const wanted = new Map();

for (const file of files) {
  const source = await readFile(path.join(guidesDir, file), "utf8");
  for (const book of extractBooks(source)) {
    const key = coverKey(book.title, book.author);
    if (!wanted.has(key)) wanted.set(key, book);
  }
}

let fetched = 0;
let skipped = 0;
for (const [key, book] of wanted) {
  if (existing[key]?.coverId || existing[key]?.gbid) {
    skipped += 1;
    continue;
  }
  try {
    const record = await searchOpenLibrary(book.title, book.author);
    if (record) {
      existing[key] = record;
      fetched += 1;
      console.log(`ok  ${book.title} — ${book.author} (${record.coverId ?? record.olid})`);
    } else {
      console.log(`miss ${book.title} — ${book.author}`);
    }
  } catch (error) {
    console.log(`err  ${book.title} — ${error.message}`);
  }
  await sleep(120);
}

await writeFile(outFile, `${JSON.stringify(existing, null, 2)}\n`);
console.log(`wrote ${outFile} (${fetched} new, ${skipped} cached, ${wanted.size} titles)`);
