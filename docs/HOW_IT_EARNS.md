# How this site might earn

Status as of 2026-09-13: **the Amazon Associates tag is live** (`olisbookshelf-20` via `PUBLIC_AFFILIATE_TAG` / `src/lib/site.ts`).

## Current state

- Guide CTAs prefer book-1 Amazon **product** links (`/dp/{ASIN}?tag=…`) when an ASIN is on file in `src/data/asins.json` (looked up from Open Library English-group ISBN-10 or a public Amazon product page). Otherwise title + author search.
- Per-title OrderTable shop buttons use the same ASIN map with search fallback.
- Sticky dock / hero / aside “Book 1 on Amazon” points at the first recommended title, not a vague series search.
- Buy-intent `/questions/` hubs may show one prominent book-1 Amazon control. No Associates wording in body prose; disclosure stays footer + `/disclosure/`.
- Amazon still reviews the application: we need **3 non-personal qualifying sales within 180 days**. That is a program requirement, not an income forecast.
- `/disclosure/` states Amazon’s required sentence and that the program is active.

## We will not

- Claim a specific income
- Stuff keyword pages that exist only for clicks
- Treat the qualifying-sale review as guaranteed approval or revenue

## Other money

No display ads, sponsored rankings, or paid review placements in the current design. If that changes, update `/disclosure/` first.

## Required public sentence

> As an Amazon Associate I earn from qualifying purchases.

Keep that sentence in the site footer and on `/disclosure/` only. Do not repeat it in guide prose, asides, docks, or house-rule copy.
