import asinMap from "../data/asins.json";
import { coverKey } from "./covers";

export type AsinRecord = {
  asin: string;
  source?: string;
  title?: string;
  author?: string;
};

type AsinMap = Record<string, AsinRecord>;

const asins = asinMap as AsinMap;

/** ISBN-10 / Amazon ASIN pattern (10 alphanumeric, checksum not re-validated here). */
export function isAsin(value: string | undefined | null): value is string {
  return Boolean(value && /^[A-Z0-9]{10}$/i.test(value.trim()));
}

export function lookupAsin(
  title: string,
  author: string,
  explicit?: string,
): string | undefined {
  if (isAsin(explicit)) return explicit.trim().toUpperCase();
  const record = asins[coverKey(title, author)];
  return record && isAsin(record.asin) ? record.asin.trim().toUpperCase() : undefined;
}

/**
 * When StartHere only has a title, use a unique title match in the ASIN map.
 * Ambiguous titles fall through to search URLs.
 */
export function lookupAsinByTitle(title: string): string | undefined {
  const wanted = title.trim().toLowerCase().replace(/\s+/g, " ");
  if (!wanted) return undefined;
  const matches: string[] = [];
  for (const [key, record] of Object.entries(asins)) {
    if (!isAsin(record.asin)) continue;
    const keyTitle = key.split("|")[0] ?? "";
    if (keyTitle === wanted) matches.push(record.asin.trim().toUpperCase());
  }
  const unique = [...new Set(matches)];
  return unique.length === 1 ? unique[0] : undefined;
}

export function asinCount(): { entries: number; withAsin: number } {
  const entries = Object.keys(asins).length;
  const withAsin = Object.values(asins).filter((r) => isAsin(r.asin)).length;
  return { entries, withAsin };
}
