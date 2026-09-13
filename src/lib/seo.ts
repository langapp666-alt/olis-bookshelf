import { siteName } from "./site";

/** Keep meta descriptions inside the length Google typically displays. */
export function clipMeta(text: string, max = 160): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  const slice = trimmed.slice(0, max - 1);
  const breakAt = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf(" — "),
    slice.lastIndexOf("; "),
    slice.lastIndexOf(", "),
    slice.lastIndexOf(" "),
  );
  const clipped = (breakAt > 80 ? slice.slice(0, breakAt) : slice).replace(/[.,;:—\s]+$/, "");
  return `${clipped}…`;
}

export function documentTitle(title: string): string {
  return title === siteName ? title : `${title} · ${siteName}`;
}
