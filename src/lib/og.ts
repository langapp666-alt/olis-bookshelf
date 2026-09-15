import { Resvg } from "@resvg/resvg-js";
import { existsSync } from "node:fs";
import { join } from "node:path";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
export const OG_TYPE = "image/png";

export type OgInput = {
  kicker: string;
  title: string;
  subtitle?: string;
};

function fontFiles(): string[] {
  const dir = join(process.cwd(), "src/assets/fonts");
  const files = [
    join(dir, "NotoSerif-Regular.ttf"),
    join(dir, "NotoSerif-Bold.ttf"),
    join(dir, "Inter-SemiBold.ttf"),
  ];
  const missing = files.filter((file) => !existsSync(file));
  if (missing.length > 0) {
    throw new Error(`OG fonts missing: ${missing.join(", ")}`);
  }
  return files;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapLines(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) {
        const rest = [word, ...words.slice(words.indexOf(word) + 1)].join(" ");
        current = rest;
        break;
      }
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);

  return lines.slice(0, maxLines).map((line, i, all) => {
    if (i === all.length - 1 && line.length > maxChars + 4) {
      return `${line.slice(0, maxChars).replace(/[.,;:\s]+$/, "")}…`;
    }
    return line;
  });
}

function titleLayout(title: string): { fontSize: number; lines: string[]; maxChars: number } {
  const length = title.trim().length;
  if (length <= 28) return { fontSize: 64, lines: wrapLines(title, 22, 2), maxChars: 22 };
  if (length <= 52) return { fontSize: 52, lines: wrapLines(title, 28, 3), maxChars: 28 };
  return { fontSize: 44, lines: wrapLines(title, 32, 3), maxChars: 32 };
}

export function defaultOgInput(): OgInput {
  return {
    kicker: "Reading-order maps",
    title: "Oli's Bookshelf",
    subtitle: "Know the next book — not the loudest one.",
  };
}

export function renderOgSvg({ kicker, title, subtitle }: OgInput): string {
  const { fontSize, lines } = titleLayout(title);
  const lineHeight = Math.round(fontSize * 1.12);
  const titleBlock = lines
    .map((line, i) => {
      const y = 250 + i * lineHeight;
      return `<text x="80" y="${y}" font-family="Noto Serif" font-weight="700" font-size="${fontSize}" fill="#1b1714">${escapeXml(line)}</text>`;
    })
    .join("\n  ");
  const subtitleY = 250 + lines.length * lineHeight + 28;
  const subtitleText = subtitle
    ? `<text x="80" y="${subtitleY}" font-family="Noto Serif" font-size="28" fill="#3a342c">${escapeXml(subtitle)}</text>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f3ece0"/>
      <stop offset="1" stop-color="#e8dfd0"/>
    </linearGradient>
    <radialGradient id="wash" cx="0.06" cy="0" r="0.72">
      <stop offset="0" stop-color="#c11f13" stop-opacity="0.11"/>
      <stop offset="1" stop-color="#c11f13" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#paper)"/>
  <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#wash)"/>
  <rect width="${OG_WIDTH}" height="8" fill="#c11f13"/>
  <path d="M80 52h40v58l-20-11.6L80 110V52Z" fill="#c11f13"/>
  <text x="138" y="78" font-family="Inter SemiBold" font-size="18" letter-spacing="3.2" fill="#c11f13">OLI&apos;S</text>
  <text x="138" y="104" font-family="Inter SemiBold" font-size="18" letter-spacing="3.2" fill="#1b1714">BOOKSHELF</text>
  <rect x="80" y="132" width="160" height="2" fill="#d4c8b4"/>
  <text x="80" y="178" font-family="Inter SemiBold" font-size="16" letter-spacing="2.8" fill="#c11f13">${escapeXml(kicker.toUpperCase())}</text>
  ${titleBlock}
  ${subtitleText}
  <rect x="80" y="548" width="1040" height="1" fill="#d4c8b4"/>
  <text x="80" y="586" font-family="Inter SemiBold" font-size="20" fill="#6f675c">olisbookshelf.com</text>
</svg>`;
}

export function renderOgPng(input: OgInput): Buffer {
  const resvg = new Resvg(renderOgSvg(input), {
    fitTo: { mode: "width", value: OG_WIDTH },
    font: {
      fontFiles: fontFiles(),
      loadSystemFonts: false,
      defaultFontFamily: "Noto Serif",
    },
  });
  return Buffer.from(resvg.render().asPng());
}

export function ogPngResponse(input: OgInput): Response {
  return new Response(renderOgPng(input), {
    headers: {
      "Content-Type": OG_TYPE,
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function siteOgPath(): string {
  return "/og.png";
}

export function guideOgPath(slug: string): string {
  return `/og/guides/${slug}.png`;
}

export function questionOgPath(slug: string): string {
  return `/og/questions/${slug}.png`;
}

export function absoluteOgUrl(origin: URL, path: string): string {
  return new URL(path, origin).href;
}
