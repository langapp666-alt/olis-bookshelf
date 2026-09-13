# Editorial standards

Oli's Bookshelf publishes series reading-order guides and short “what to read next” notes. This file is the house rule. The public version lives on `/about/` and `/methodology/`.

## Purpose

Help a first-time reader pick a starting book and a path through a long series without being spoiled by prequels, retailer blurbs, or lists that mix novels with extras.

## Hard rules

1. **No copyrighted book text.** No chapter quotes, no lyric blocks, no pasted prologue.
2. **No scraped or rewritten jacket copy.** If we need to describe a book, we use original sentences about *placement* and *form* (novella vs novel, prequel vs sequel), not plot recap.
3. **No fake reviews.** No invented reader quotes, no star ratings, no “I stayed up until 3am.”
4. **No spam.** One guide per series spine. No doorway pages that only exist to host affiliate links.
5. **No income claims.** We do not publish revenue, RPM, or “this niche is easy money.”
6. **Internal accuracy notes stay off the public chrome.** New work can use `status: draft` in frontmatter. Published pages use `status: published` and do not render draft banners, stamps, or review-flag lists. Keep remaining accuracy notes in `docs/` or HTML comments.
7. **Affiliate links use the live site tag.** `affiliateTag` / `PUBLIC_AFFILIATE_TAG` in `src/lib/site.ts`. Do not invent a second tag. Each title in an order table gets its own Amazon **search** URL via `amazonBookUrl()` — do not invent ASINs. See `HOW_IT_EARNS.md`.

## Sourcing

Prefer, in order:

1. Author site
2. Publisher reading-order or series page
3. Library / bibliographic records for years and form
4. Fandom wikis only as pointers to a primary source

Record the URL and the date opened (`lastVerified` in frontmatter). If an official URL 404s, say so. Do not silently replace it with a wiki.

## Order philosophy

- **Publication order is the default first read.**
- Chronology is documented when it diverges.
- Chronological prequels that spoil later novels are flagged, not promoted as on-ramps.
- Optional shorts, picture books, RPG extras, and cameos stay out of the numbered novel column.

## What-to-read-next

Three to five titles. Each needs an original reason that names a *structure* or *aftercare* (voice, institution, scale), not a vibe adjective pile. Do not scrape “readers also enjoyed.”

## Voice

Bookshop desk, not growth-hacking blog. Specific, calm, slightly dry. No purple UI energy in the prose either.

## Legal / ethics

- We do not host pirated texts or “free PDF” links.
- We do not claim a specific Associates income.
- FTC disclosure stays in the footer and on `/disclosure/` only. Do not repeat Associates wording in guide chrome or main content.
