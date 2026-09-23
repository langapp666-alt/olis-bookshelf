# How this site might earn

Status as of 2026-09-13: **the Amazon Associates tag is live** (`olisbookshelf-20` via `PUBLIC_AFFILIATE_TAG` / `src/lib/site.ts`).

## Current state

- Guide CTAs and OrderTable shop buttons use tagged **title + author search** (`/s?k=…&tag=olisbookshelf-20`). ASIN `/dp/` deep links were rolled back: Open Library ISBN-10 ≠ amazon.com ASIN (many 404). See `docs/ASIN_DEEP_LINKS.md`.
- The guide hero uses a primary “{Title} on Amazon” search control. Dock, aside, and StartHere still say “Book 1 on Amazon.” All of them point at the first recommended title (tagged title + author search), not a vague series search.
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
