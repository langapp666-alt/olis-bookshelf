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
  "the lord of the rings|j. r. r. tolkien": "the fellowship of the ring|j. r. r. tolkien",
  "the atlas series|olivie blake": "the atlas six|olivie blake",
  "the broken kingdoms|l.j. andrews": "curse of shadows and thorns|l.j. andrews",
  "discworld — moist von lipwig|terry pratchett": "going postal|terry pratchett",
  "discworld — rincewind|terry pratchett": "the colour of magic|terry pratchett",
  "lightbringer|brent weeks": "the black prism|brent weeks",
  "the lunar chronicles|marissa meyer": "cinder|marissa meyer",
  "the roots of chaos|samantha shannon": "the priory of the orange tree|samantha shannon",
  "shadowhunter chronicles|cassandra clare": "city of bones|cassandra clare",
  "vorkosigan saga|lois mcmaster bujold": "shards of honor|lois mcmaster bujold",
  "james bond|ian fleming": "casino royale|ian fleming",
  "agatha christie|agatha christie": "the mysterious affair at styles|agatha christie",
  "sherlock holmes|arthur conan doyle": "a study in scarlet|arthur conan doyle",
  "the old kingdom|garth nix": "sabriel|garth nix",
  "night angel|brent weeks": "the way of shadows|brent weeks",
  "flesh and fire|jennifer l. armentrout": "a shadow in the ember|jennifer l. armentrout",
  "the bargainer|laura thalassa": "rhapsodic|laura thalassa",
  "hades x persephone|scarlett st. clair": "a touch of darkness|scarlett st. clair",
  "mitch rapp|vince flynn": "transfer of power|vince flynn",
  "will trent / grant county|karin slaughter": "triptych|karin slaughter",
  "honorverse|david weber": "on basilisk station|david weber",
  "valdemar|mercedes lackey": "arrows of the queen|mercedes lackey",
  "the banished lands|john gwynne": "malice|john gwynne",
};

export function lookupCover(
  title: string,
  author: string,
  explicit?: CoverRecord,
): CoverRecord | undefined {
  if (explicit && hasCover(explicit)) return explicit;
  const key = coverKey(title, author);
  const aliased = seriesCoverAliases[key];
  const record = (aliased ? covers[aliased] : undefined) ?? covers[key];
  return record && hasCover(record) ? record : undefined;
}

export function coverInitials(title: string): string {
  const words = title
    .replace(/[—–/()[\],.:]/g, " ")
    .split(/\s+/)
    .filter((word) => word && !/^(the|a|an|and|of|era|\d+)$/i.test(word));
  if (words.length >= 2) {
    return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
  }
  return (words[0] ?? title).replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "•";
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
