# Oli's Bookshelf

Series reading-order and “what to read next” guides for long science fiction, fantasy, mystery/thriller, and romance shelves. Brand: **Oli's Bookshelf**.

This is a static [Astro](https://astro.build) site. Guides live in a Markdown/MDX content collection.

Amazon Associates is **active**. Per-title and series search links use the Associates tag from `PUBLIC_AFFILIATE_TAG` / `src/lib/site.ts` via `amazonBookUrl()` / `amazonSearchUrl()`. Do not invent ASINs.

## Local development

Requires Node 22+.

```bash
npm install
npm run dev
```

Open the URL Astro prints (usually `http://localhost:4321`).

```bash
npm run build    # writes static files to dist/
npm run preview  # serves dist/ locally
```

`npm run build` must succeed before you deploy.

## What’s on the site

A hundred-plus reading-order guides live in `src/content/guides/`. The home page, `/guides/`, and the four genre hubs list them automatically. The full published table is in `docs/SERIES_BACKLOG.md`.

High-search paths now include Tolkien, Harry Potter, James Bond, Agatha Christie, Sherlock Holmes, Divergent, Maze Runner, Inheritance Cycle, Shadowhunters, Vorkosigan, Temeraire, Discworld character lines, Bobiverse, Freida McFadden, Silo/Wool, Hunger Games, focused Stephen King pages, Broken Earth, Poppy War, Wayward Children, the Maas series, Empyrean, a Cosmere starter (not a 40-book spreadsheet), and other demand shelves.

Short **question hubs** live at `/questions/` (for example `/questions/where-to-start-the-cosmere/`). They answer one search intent, then send the reader to the matching guide. They are not a second catalog of affiliate pages.

Order tables show Open Library covers when `src/data/covers.json` has a reliable ID. Refresh IDs with `node src/scripts/fetch-covers.mjs`. Do not scrape Amazon images.

| Page | Route |
| --- | --- |
| Home | `/` |
| All guides | `/guides/` |
| Epic Fantasy hub | `/genres/epic-fantasy/` |
| Space Opera / SFF hub | `/genres/space-opera/` |
| Mystery / Thriller hub | `/genres/mystery-thriller/` |
| Romance hub | `/genres/romance/` |
| About / editorial standards | `/about/` |
| Disclosure (FTC + Associates wording) | `/disclosure/` |
| Methodology | `/methodology/` |
| Common questions | `/questions/` |
| Default Open Graph image | `/og.png` |
| `robots.txt` | `/robots.txt` |
| Sitemap | `/sitemap.xml` (robots.txt lists only this; `/sitemap-index.xml` and `/sitemap-0.xml` remain as aliases) |

House docs (not shipped as pages):

- `docs/SERIES_BACKLOG.md` — published slugs plus queued leftovers
- `docs/EDITORIAL_STANDARDS.md`
- `docs/HOW_IT_EARNS.md`
- `docs/CONTENT_WORKFLOW.md`

## Deploy on Cloudflare Pages

The custom domain **https://olisbookshelf.com** is already attached in Cloudflare Pages (SSL live). This repo does not change DNS. `https://olis-bookshelf.pages.dev` stays a working alternate host because in-app links are relative.

1. Push this repo to GitHub (already the source of truth).
2. In the [Cloudflare dashboard](https://dash.cloudflare.com/), go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select this repository.
4. Use the Astro preset, or set:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** `22` (repo has `.nvmrc` and `.node-version`; or set `NODE_VERSION=22`)
5. Canonical, Open Graph, and sitemap URLs default to `https://olisbookshelf.com`. Override with `PUBLIC_SITE_URL` or `SITE_URL` only if the canonical host changes. A leftover `https://olis-bookshelf.pages.dev` env value is ignored so canonicals stay on the custom domain.

## Affiliate tag

`src/lib/site.ts` exports `affiliateTag` from `PUBLIC_AFFILIATE_TAG` (default `olisbookshelf-20`). Keep `/disclosure/` accurate if the tag changes. Search URLs are fine; do not invent ASINs.

## Stack

- Astro (static output)
- Markdown/MDX content collections
- TypeScript
- Custom `/sitemap.xml` (single urlset with `lastmod`). `robots.txt` advertises only that file. Older `/sitemap-index.xml` and `/sitemap-0.xml` URLs stay valid so an existing Search Console row does not 404.

## Google Search Console

Submit **`https://olisbookshelf.com/sitemap.xml`**. That file is a bare `urlset` with `lastmod`, served as `text/xml; charset=utf-8`. `robots.txt` lists only this sitemap. `/sitemap-index.xml` and `/sitemap-0.xml` stay valid so an older GSC row does not 404, but they are not advertised. The `pages.dev` host can remain a second property if needed; page canonicals point at `https://olisbookshelf.com`.

If GSC still says “Couldn’t fetch” while a public GET returns HTTP 200:

1. Confirm the property is the URL-prefix `https://olisbookshelf.com/` (not `pages.dev`).
2. Submit the exact string with no trailing slash.
3. In Cloudflare: Security Events / Bot Fight Mode. Super Bot Fight Mode on a `pages.dev` host often challenges Google’s sitemap fetcher even when a browser, `curl`, and URL Inspection succeed.
4. URL Inspection → Test live URL on `/sitemap.xml`. If that is available to Google, the Sitemaps report is usually lag or a stale first-fetch error — resubmit and wait.

This repo cannot turn Bot Fight Mode off. That is a dashboard setting, not a code defect.

## IndexNow

A public IndexNow key is served at `https://olisbookshelf.com/5058d13b230c9d374f2b0d74aef0e894.txt` (the file body is the key). The key is public by design; no CI secret is required.

To tell Bing and other IndexNow engines about new or updated URLs, POST to `https://api.indexnow.org/indexnow`:

```json
{
  "host": "olisbookshelf.com",
  "key": "5058d13b230c9d374f2b0d74aef0e894",
  "keyLocation": "https://olisbookshelf.com/5058d13b230c9d374f2b0d74aef0e894.txt",
  "urlList": [
    "https://olisbookshelf.com/questions/where-to-start-the-cosmere/"
  ]
}
```

Submit the question-hub URLs and any changed guides after deploy. This repo does not call IndexNow at build time.

## License of this repo

Site code is for the Oli's Bookshelf project. Book titles and series names are used to identify works. Do not add copyrighted book text to the collection.
