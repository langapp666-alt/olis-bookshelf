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

/**
 * Series names that do not match a single jacket. Point at book one
 * (or the named door) so catalog cards are not empty.
 */
const seriesCoverAliases: Record<string, string> = {
  "the age of madness|joe abercrombie": "a little hatred|joe abercrombie",
  "the books of babel|josiah bancroft": "senlin ascends|josiah bancroft",
  "cosmere starter|brandon sanderson": "the final empire|brandon sanderson",
  "discworld — witches|terry pratchett": "equal rites|terry pratchett",
  "the empyrean|rebecca yarros": "fourth wing|rebecca yarros",
  "grishaverse|leigh bardugo": "shadow and bone|leigh bardugo",
  "the hierarchy|james islington": "the will of the many|james islington",
  "holly gibney|stephen king": "mr. mercedes|stephen king",
  "the kingkiller chronicle|patrick rothfuss": "the name of the wind|patrick rothfuss",
  "mistborn (era 1 and 2)|brandon sanderson": "the final empire|brandon sanderson",
  "the murderbot diaries|martha wells": "all systems red|martha wells",
  "percy jackson / camp half-blood|rick riordan": "the lightning thief|rick riordan",
  "realm of the elderlings|robin hobb": "assassin's apprentice|robin hobb",
  "the scholomance|naomi novik": "a deadly education|naomi novik",
  "southern reach|jeff vandermeer": "annihilation|jeff vandermeer",
  "stephen king starters|stephen king": "misery|stephen king",
  "the culture|iain m. banks": "consider phlebas|iain m. banks",
  "the locked tomb|tamsyn muir": "gideon the ninth|tamsyn muir",
  "remembrance of earth's past|cixin liu": "the three-body problem|cixin liu",
};

export function lookupCover(
  title: string,
  author: string,
  explicit?: CoverRecord,
): CoverRecord | undefined {
  if (explicit && hasCover(explicit)) return explicit;
  const key = coverKey(title, author);
  const record = covers[key] ?? covers[seriesCoverAliases[key] ?? ""];
  return record && hasCover(record) ? record : undefined;
}

export function coverInitials(title: string): string {
  const words = title
    .replace(/[—–/-]/g, " ")
    .split(/\s+/)
    .filter((word) => word && !/^(the|a|an)$/i.test(word));
  if (words.length >= 2) {
    return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
  }
  return title.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "•";
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
