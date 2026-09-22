# Content workflow

How a series guide goes from backlog line to a published page.

## 1. Pick from the backlog

Use `docs/SERIES_BACKLOG.md`. High-search titles are in scope when the order is still contested. Star Wars remains out as a primary unless a later pass adds a focused novel-only path.

## 2. Collect sources

- Author page
- Publisher series / reading-order page
- First US (or relevant) publication years
- A note of any short fiction, collections, or extras

Save URLs. Do not paste blurbs into the working notes that will be committed.

## 3. Draft in the content collection

Create `src/content/guides/<slug>.mdx` with frontmatter:

- `title`, `description`, `genre`, `lastVerified`, `slug`, `series`, `author`
- `status: draft` while the page should not be treated as finished product
- `reviewFlags` for anything a person must re-check (do not render these on the public page)
- `sources`

Genre must be one of: `epic-fantasy`, `space-opera`, `mystery-thriller`, `romance`.

## 4. Required sections

1. Starting point
2. Order table(s)
3. Optional arcs / shorts
4. Common mistakes
5. Three to five what-to-read-next items with original reasons. Link to an on-site guide URL when that series already has a page.
6. FAQ
7. Sources
8. Accuracy notes as HTML comments (not a public “human-review flags” heading)
9. Per-title Amazon URLs via `OrderTable` / `amazonBookUrl()` (site tag; tagged title + author search — ASIN `/dp/` links stay off until amazon.com-validated; see `ASIN_DEEP_LINKS.md`). Do not invent ASINs. Buy-intent question hubs may set optional `buy:` frontmatter for one book-1 Amazon control. Do not add affiliate-explainer prose to the guide; sitewide disclosure lives in the footer and on `/disclosure/` only.

## 5. Human review (blocking)

A person, not only a model, should:

- [ ] Open every source URL
- [ ] Check every title string against a publisher or author page
- [ ] Confirm dates
- [ ] Confirm flagged shorts still exist where we say they do
- [ ] Confirm no jacket copy or book text landed in the file
- [ ] Confirm search links use the site Associates tag (not a leftover placeholder)

Then set `status: published` and refresh `lastVerified`. Published pages must not show draft banners, stamps, or review-flag lists.

## 6. Build

`npm run build` must succeed. A guide that fails the schema is not ready.

## 7. Do not “finish” a guide by deleting uncertainty

If a date is uncertain, keep an HTML comment or a calm note in the sources section. Do not put DRAFT chrome on the public site.
