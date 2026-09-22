/**
 * Look up Amazon ASINs (book ISBN-10) for titles used in guides.
 * Source: Open Library work editions. Prefer English-group ISBNs (978-0 / 978-1).
 * Writes src/data/asins.json. Does not invent ASINs.
 *
 * Usage: node src/scripts/fetch-asins.mjs
 *        node src/scripts/fetch-asins.mjs --book1-only
 *        node src/scripts/fetch-asins.mjs --limit=50
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const guidesDir = path.join(root, "src/content/guides");
const outFile = path.join(root, "src/data/asins.json");

const args = new Set(process.argv.slice(2));
const book1Only = args.has("--book1-only");
const limitArg = [...args].find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : Infinity;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const UA = "OlisBookshelf/1.0 (reading-order asin lookup; olisbookshelf.com)";

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function coverKey(title, author) {
  return `${normalize(title)}|${normalize(author)}`;
}

function titlesClose(a, b) {
  const left = normalize(a).replace(/[^a-z0-9 ]/g, "");
  const right = normalize(b).replace(/[^a-z0-9 ]/g, "");
  if (!left || !right) return false;
  if (left === right) return true;
  if (left.includes(right) || right.includes(left)) return true;
  return false;
}

function isbn13To10(isbn13) {
  const digits = String(isbn13).replace(/[^0-9X]/gi, "");
  if (!digits.startsWith("978") || digits.length !== 13) return undefined;
  const core = digits.slice(3, 12);
  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += Number(core[i]) * (10 - i);
  const check = (11 - (sum % 11)) % 11;
  const checkChar = check === 10 ? "X" : String(check);
  return `${core}${checkChar}`;
}

function validIsbn10(value) {
  const cleaned = String(value).replace(/[^0-9Xx]/g, "").toUpperCase();
  if (!/^\d{9}[\dX]$/.test(cleaned)) return undefined;
  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += Number(cleaned[i]) * (10 - i);
  const check = (11 - (sum % 11)) % 11;
  const expected = check === 10 ? "X" : String(check);
  return cleaned[9] === expected ? cleaned : undefined;
}

function isEnglishGroupIsbn13(isbn13) {
  const digits = String(isbn13).replace(/[^0-9]/g, "");
  return digits.startsWith("9780") || digits.startsWith("9781");
}

function pickAsinFromEdition(edition) {
  const isbn10s = edition.isbn_10 ?? [];
  const isbn13s = edition.isbn_13 ?? [];
  const preferred13 = isbn13s.filter(isEnglishGroupIsbn13);
  for (const raw of preferred13) {
    const ten = validIsbn10(isbn13To10(raw));
    if (ten) return { asin: ten, via: "isbn13-eng-group" };
  }
  for (const raw of isbn10s) {
    const ten = validIsbn10(raw);
    if (ten) return { asin: ten, via: "isbn10" };
  }
  for (const raw of isbn13s) {
    const ten = validIsbn10(isbn13To10(raw));
    if (ten) return { asin: ten, via: "isbn13-other" };
  }
  return undefined;
}

function isEnglishEdition(edition) {
  const langs = edition.languages ?? [];
  if (langs.length === 0) return true;
  return langs.some((lang) => {
    const key = typeof lang === "string" ? lang : lang?.key;
    return key === "eng" || key === "/languages/eng";
  });
}

function extractBooks(source) {
  const books = [];
  const guideAuthor = source.match(/^author:\s*(.+)$/m)?.[1]?.replace(/^["']|["']$/g, "");
  const tableRe = /<OrderTable([\s\S]*?)books=\{\[([\s\S]*?)\]\s*\}/g;
  let tableIndex = 0;
  for (const table of source.matchAll(tableRe)) {
    tableIndex += 1;
    const attrs = table[1] ?? "";
    const body = table[2] ?? "";
    const tableAuthor = attrs.match(/author="([^"]+)"/)?.[1] ?? guideAuthor ?? "";
    let row = 0;
    for (const object of body.matchAll(/\{([\s\S]*?)\}/g)) {
      const chunk = object[1] ?? "";
      const title = chunk.match(/title:\s*"([^"]+)"/)?.[1];
      if (!title) continue;
      const author = chunk.match(/author:\s*"([^"]+)"/)?.[1] ?? tableAuthor;
      const notes = chunk.match(/notes:\s*"([^"]*)"/)?.[1] ?? "";
      const stop = /do not start|not (an? )?(on-ramp|book one|required)/i.test(notes);
      books.push({
        title,
        author,
        tableIndex,
        row,
        stop,
        startHere: /start here/i.test(notes),
      });
      row += 1;
    }
  }
  return books;
}

function selectWanted(books) {
  if (!book1Only) return books.filter((b) => b.title && b.author);
  const firstTable = books.filter((b) => b.tableIndex === 1);
  const marked = firstTable.find((b) => b.startHere && !b.stop);
  if (marked) return [marked];
  const firstOk = firstTable.find((b) => !b.stop);
  return firstOk ? [firstOk] : firstTable.slice(0, 1);
}

async function findWorkKey(title, author) {
  const url = new URL("https://openlibrary.org/search.json");
  url.searchParams.set("title", title);
  url.searchParams.set("author", author);
  url.searchParams.set("limit", "8");
  url.searchParams.set("fields", "key,title,author_name");
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`OL search ${res.status}`);
  const data = await res.json();
  const docs = data.docs ?? [];
  return docs.find((doc) => titlesClose(doc.title ?? "", title))?.key;
}

function scoreEdition(edition, picked) {
  let score = 0;
  if (isEnglishEdition(edition)) score += 10;
  if (picked.via === "isbn13-eng-group") score += 5;
  if (picked.via === "isbn10") score += 2;
  // Prefer US-ish Tor/Bantam/etc. retail range lightly via leading digit after group
  if (/^[01]/.test(picked.asin)) score += 1;
  return score;
}

async function asinFromWork(workKey, title) {
  const res = await fetch(`https://openlibrary.org${workKey}/editions.json?limit=100`, {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) throw new Error(`OL editions ${res.status}`);
  const data = await res.json();
  const editions = data.entries ?? [];
  let best;
  for (const edition of editions) {
    if (edition.title && !titlesClose(edition.title, title)) {
      // Skip boxed sets / clearly different titles
      const ed = normalize(edition.title).replace(/[^a-z0-9 ]/g, "");
      const want = normalize(title).replace(/[^a-z0-9 ]/g, "");
      if (!ed.includes(want) && !want.includes(ed)) continue;
    }
    const picked = pickAsinFromEdition(edition);
    if (!picked) continue;
    const candidate = {
      asin: picked.asin,
      source: `openlibrary:${edition.key ?? workKey}`,
      title: edition.title ?? title,
      score: scoreEdition(edition, picked),
    };
    if (!best || candidate.score > best.score) best = candidate;
  }
  return best;
}

async function fromOpenLibrary(title, author) {
  const workKey = await findWorkKey(title, author);
  if (!workKey) return undefined;
  return asinFromWork(workKey, title);
}

const files = (await readdir(guidesDir)).filter((name) => name.endsWith(".mdx"));
const existing = JSON.parse(await readFile(outFile, "utf8").catch(() => "{}"));
const wanted = new Map();

for (const file of files) {
  const source = await readFile(path.join(guidesDir, file), "utf8");
  for (const book of selectWanted(extractBooks(source))) {
    if (!book.title || !book.author) continue;
    const key = coverKey(book.title, book.author);
    if (!wanted.has(key)) wanted.set(key, book);
  }
}

let fetched = 0;
let skipped = 0;
let missed = 0;
let processed = 0;

for (const [key, book] of wanted) {
  if (processed >= limit) break;
  processed += 1;
  if (existing[key]?.asin && validIsbn10(existing[key].asin)) {
    skipped += 1;
    continue;
  }
  try {
    const record = await fromOpenLibrary(book.title, book.author);
    if (record?.asin) {
      existing[key] = {
        asin: record.asin.toUpperCase(),
        source: record.source,
        title: book.title,
        author: book.author,
      };
      fetched += 1;
      console.log(`ok  ${book.title} — ${book.author} → ${record.asin} (${record.source})`);
    } else {
      missed += 1;
      console.log(`miss ${book.title} — ${book.author}`);
    }
  } catch (error) {
    missed += 1;
    console.log(`err  ${book.title} — ${error.message}`);
  }
  await sleep(200);
  if (processed % 20 === 0) {
    await writeFile(outFile, `${JSON.stringify(existing, null, 2)}\n`);
  }
}

await writeFile(outFile, `${JSON.stringify(existing, null, 2)}\n`);
console.log(
  `wrote ${outFile} (${fetched} new, ${skipped} cached, ${missed} miss, ${wanted.size} wanted, processed ${processed})`,
);
