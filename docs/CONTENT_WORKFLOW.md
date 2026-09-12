# Content workflow

How a series guide goes from backlog line to “reviewed.”

## 1. Pick from the backlog

Use `docs/SERIES_BACKLOG.md`. Do not add Harry Potter, Tolkien, ASOIAF, or Star Wars as primaries.

## 2. Collect sources

- Author page
- Publisher series / reading-order page
- First US (or relevant) publication years
- A note of any short fiction, collections, or extras

Save URLs. Do not paste blurbs into the working notes that will be committed.

## 3. Draft in the content collection

Create `src/content/guides/<slug>.mdx` with frontmatter:

- `title`, `description`, `genre`, `lastVerified`, `slug`, `series`, `author`
- `status: draft`
- `reviewFlags` for anything a human must re-check
- `sources`

Genre must be one of: `epic-fantasy`, `space-opera`, `mystery-thriller`.

## 4. Required sections

1. Starting point
2. Order table(s)
3. Optional arcs / shorts
4. Common mistakes
5. Three to five what-to-read-next items with original reasons
6. FAQ
7. Sources
8. Human-review flags
9. Disclosure + `TODO_AFFILIATE_TAG` search URL

## 5. Human review (blocking)

A person, not only a model, should:

- [ ] Open every source URL
- [ ] Check every title string against a publisher or author page
- [ ] Confirm dates
- [ ] Confirm flagged shorts still exist where we say they do
- [ ] Confirm no jacket copy or book text landed in the draft
- [ ] Confirm no live affiliate tag

Then set `status: reviewed` and refresh `lastVerified`.

## 6. Build

`npm run build` must succeed. A draft guide that fails the schema is not drafted.

## 7. Do not “finish” a guide by deleting flags

If a date is uncertain, keep the flag. Shipping a confident wrong year is worse than a visible DRAFT pill.
