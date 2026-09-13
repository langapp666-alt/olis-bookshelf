import coverMap from "../data/covers.json";

export type CoverRecord = {
  coverId?: number;
  isbn?: string;
  olid?: string;
  gbid?: string;
};

type CoverMap = Record<string, CoverRecord>;

const covers = coverMap as CoverMap;

export function coverKey(title: string, author: string): string {
  return `${normalize(title)}|${normalize(author)}`;
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function lookupCover(
  title: string,
  author: string,
  explicit?: CoverRecord,
): CoverRecord | undefined {
  if (explicit && hasCover(explicit)) return explicit;
  const record = covers[coverKey(title, author)];
  return record && hasCover(record) ? record : undefined;
}

export function hasCover(record?: CoverRecord): boolean {
  return Boolean(record?.coverId || record?.isbn || record?.olid || record?.gbid);
}

export function openLibraryCoverUrl(record: CoverRecord, size: "S" | "M" | "L" = "M"): string | undefined {
  if (record.coverId) {
    return `https://covers.openlibrary.org/b/id/${record.coverId}-${size}.jpg?default=false`;
  }
  if (record.isbn) {
    return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(record.isbn)}-${size}.jpg?default=false`;
  }
  if (record.olid) {
    return `https://covers.openlibrary.org/b/olid/${encodeURIComponent(record.olid)}-${size}.jpg?default=false`;
  }
  return undefined;
}

export function googleBooksCoverUrl(record: CoverRecord): string | undefined {
  if (!record.gbid) return undefined;
  const params = new URLSearchParams({
    id: record.gbid,
    printsec: "frontcover",
    img: "1",
    zoom: "1",
  });
  return `https://books.google.com/books/content?${params.toString()}`;
}
