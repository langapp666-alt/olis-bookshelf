# How this site might earn

Status as of 2026-09-13: **the Amazon Associates tag is live** (`olisbookshelf-20` via `PUBLIC_AFFILIATE_TAG` / `src/lib/site.ts`).

## Current state

- Series search links and per-title Amazon links on guides use the live Associates tag (search by default; ASIN deep links only when a verified ASIN is present in data).
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
