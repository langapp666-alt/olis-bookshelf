# ASIN deep-link conversion (2026-09-22)

Per-title Amazon shop links previously used search URLs only (`/s?k=…&tag=olisbookshelf-20`).
This pass adds looked-up ASINs in `src/data/asins.json` (Open Library English-group ISBN-10, plus public Amazon product pages for a few Open Library misses).

## How to refresh

```bash
npm run asins              # all OrderTable titles
npm run asins -- --book1-only
```

Do not invent ASINs. Misses stay as title + author search via `amazonBookUrl()`.

## Counts (this PR)

| Metric | Before | After |
| --- | ---: | ---: |
| OrderTable unique titles | 1111 | 1111 |
| ASIN product deep links | 0 | **1030** |
| Left as title + author search | 1111 | **81** |
| Guide book-1 CTAs with ASIN | 0 | **126 / 126** |

Affiliate tag on every Amazon outbound: `olisbookshelf-20` (`affiliateTag` / `PUBLIC_AFFILIATE_TAG`).
