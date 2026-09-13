# Oli's Bookshelf

Series reading-order and “what to read next” guides for long science fiction, fantasy, and mystery/thriller shelves. Brand: **Oli's Bookshelf**.

This is a static [Astro](https://astro.build) site. Guides live in a Markdown/MDX content collection.

Amazon Associates is **not** active. Book search links use the placeholder tag `TODO_AFFILIATE_TAG` only.

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

| Page | Route |
| --- | --- |
| Home | `/` |
| Murderbot Diaries | `/guides/murderbot-diaries-reading-order/` |
| The Expanse | `/guides/the-expanse-reading-order/` |
| Discworld City Watch | `/guides/discworld-city-watch-reading-order/` |
| Rivers of London | `/guides/rivers-of-london-reading-order/` |
| The Locked Tomb | `/guides/the-locked-tomb-reading-order/` |
| Mistborn Era 1 + 2 | `/guides/mistborn-era-1-2-reading-order/` |
| The Dresden Files | `/guides/dresden-files-reading-order/` |
| The Craft Sequence | `/guides/craft-sequence-reading-order/` |
| Cormoran Strike | `/guides/cormoran-strike-reading-order/` |
| The Culture | `/guides/the-culture-reading-order/` |
| The Books of Babel | `/guides/books-of-babel-reading-order/` |
| Epic Fantasy hub | `/genres/epic-fantasy/` |
| Space Opera / SFF hub | `/genres/space-opera/` |
| Mystery / Thriller hub | `/genres/mystery-thriller/` |
| About / editorial standards | `/about/` |
| Disclosure (FTC + Associates wording) | `/disclosure/` |
| Methodology | `/methodology/` |
| `robots.txt` | `/robots.txt` |
| Sitemap | `/sitemap-index.xml` |

House docs (not shipped as pages):

- `docs/SERIES_BACKLOG.md` — 15 long-tail series
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
   - **Node version:** `22` (or add an environment variable `NODE_VERSION=22`)
5. Save and deploy. Cloudflare gives the project a free `https://<project-name>.pages.dev` URL.
6. Copy that hostname into `site` in `astro.config.mjs` so the sitemap and `robots.txt` use the real origin, then redeploy.

Preview deployments on pull requests also get `*.pages.dev` URLs. That is enough to share drafts. Do not set up Associates or a custom domain as part of this scaffold.

## Affiliate placeholder

`src/lib/site.ts` exports `affiliateTag = "TODO_AFFILIATE_TAG"`. Do not replace it with a live tag until:

- Associates is approved
- `/disclosure/` still says how links work
- `docs/HOW_IT_EARNS.md` records the go-live date

## Stack

- Astro (static output)
- Markdown/MDX content collections
- TypeScript
- `@astrojs/sitemap` for the sitemap

## License of this repo

Site code is for the Oli's Bookshelf project. Book titles and series names are used to identify works. Do not add copyrighted book text to the collection.
