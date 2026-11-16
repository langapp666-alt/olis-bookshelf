/**
 * Replaces the deployable site with a minimal closed page.
 * Reversible: restore package.json "build" to "astro build" (and drop the
 * astro.config.mjs hook). Old content stays in this repo and in git history.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const CLOSED_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>This site is closed.</title>
</head>
<body>
  <p>This site is closed.</p>
</body>
</html>
`;

export const ROBOTS_TXT = "User-agent: *\nDisallow: /\n";

// 404.html covers unknown paths. A /* → / 302 is omitted so / cannot loop
// if redirects are applied before static assets.
export const REDIRECTS = "# Site is closed. Unknown paths use 404.html.\n";

export const HEADERS = `/*
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-cache, no-store, must-revalidate
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer

/robots.txt
  Content-Type: text/plain; charset=utf-8
`;

export function writeClosedSite(outDir = path.join(root, "dist")) {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), CLOSED_HTML);
  fs.writeFileSync(path.join(outDir, "404.html"), CLOSED_HTML);
  fs.writeFileSync(path.join(outDir, "robots.txt"), ROBOTS_TXT);
  fs.writeFileSync(path.join(outDir, "_redirects"), REDIRECTS);
  fs.writeFileSync(path.join(outDir, "_headers"), HEADERS);
}

const isMain =
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  writeClosedSite();
  console.log("Wrote closed site to dist/ (index.html, 404.html, robots.txt, _redirects, _headers)");
}
