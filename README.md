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

High-search paths now include Tolkien, Harry Potter, Divergent, Maze Runner, Inheritance Cycle, Shadowhunters, Vorkosigan, Temeraire, Discworld character lines, Bobiverse, Freida McFadden, Silo/Wool, Hunger Games, focused Stephen King pages, Broken Earth, Poppy War, Wayward Children, the Maas series, Empyrean, a Cosmere starter (not a 40-book spreadsheet), and other demand shelves.

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
| `robots.txt` | `/robots.txt` |
| Sitemap | `/sitemap-index.xml` |

House docs (not shipped as pages):

- `docs/SERIES_BACKLOG.md` — published slugs plus queued leftovers
- `docs/EDITORIAL_STANDARDS.md`
- `docs/HOW_IT_EARNS.md`
- `docs/CONTENT_WORKFLOW.md`

## Deploy on Cloudflare Pages (free `*.pages.dev`)

No custom domain is required.

1. Push this repo to GitHub (already the source of truth).
2. In the [Cloudflare dashboard](https://dash.cloudflare.com/), go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select this repository.
4. Use the Astro preset, or set:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** `22` (repo has `.nvmrc` and `.node-version`; or set `NODE_VERSION=22`)
5. Save and deploy. Cloudflare gives the project a free `https://<project-name>.pages.dev` URL.
6. Copy that hostname into `site` in `astro.config.mjs` so the sitemap and `robots.txt` use the real origin, then redeploy.

The public origin is `https://olis-bookshelf.pages.dev`.

## Affiliate tag

`src/lib/site.ts` exports `affiliateTag` from `PUBLIC_AFFILIATE_TAG` (default `olisbookshelf-20`). Keep `/disclosure/` accurate if the tag changes. Search URLs are fine; do not invent ASINs.

## Stack

- Astro (static output)
- Markdown/MDX content collections
- TypeScript
- `@astrojs/sitemap` for the sitemap

## License of this repo

Site code is for the Oli's Bookshelf project. Book titles and series names are used to identify works. Do not add copyrighted book text to the collection.
