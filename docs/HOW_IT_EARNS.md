# How this site might earn (later)

Status as of 2026-09-12: **Amazon Associates is not set up.** No application, no approval, no live tag, no custom domain work in this repo.

## Current state

- Search links on guides use the public placeholder `TODO_AFFILIATE_TAG`.
- Those links are not intended to generate commission.
- The site states Amazon’s required sentence on `/disclosure/` so the wording is ready, and immediately notes that the program is not active.

## Planned, not promised

If Associates is approved later:

1. Replace `TODO_AFFILIATE_TAG` in `src/lib/site.ts` (and any remaining hardcoded URLs).
2. Keep `/disclosure/` and the footer note.
3. Record the go-live date in this file.
4. Do not add a live tag in a commit that also hides the disclosure.

We will not:

- Claim a specific income
- Stuff keyword pages that exist only for clicks
- Pretend a placeholder tag is “already earning”

## Other money

No display ads, sponsored rankings, or paid review placements in the current design. If that changes, update `/disclosure/` first.

## Required public sentence

> As an Amazon Associate I earn from qualifying purchases.

Keep that sentence on the disclosure page even while the program is inactive, and keep the inactivity sentence next to it.
