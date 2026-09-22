# ASIN deep links — rolled back (2026-09-22)

## Why ASINs were disabled

PR #28 mapped Open Library English-group **ISBN-10** values into `src/data/asins.json` and used them as amazon.com `/dp/{id}` product links.

That is unsafe: ISBN-10 from Open Library is often a **UK or other-marketplace** product code. It is not a validated **amazon.com ASIN**. Example:

- Guide: [Dune novels reading order](https://olisbookshelf.com/guides/dune-novels-reading-order/)
- Bad deep link: `https://www.amazon.com/dp/057512279X?tag=olisbookshelf-20`
- `057512279X` is a UK ISBN-10; amazon.com returns “SORRY we couldn't find that page.”

Broken `/dp/` links are worse than search. Revenue and trust both take the hit.

## Current safe policy

1. **Do not emit `/dp/{id}`** unless `id` is a *validated* amazon.com ASIN (confirmed product page on www.amazon.com, or Associates tools). Do not invent ASINs. Do not treat Open Library ISBN-10 as amazon.com ASIN.
2. **Default shop URL:** tagged title + author search  
   `https://www.amazon.com/s?k={title}+{author}&tag=olisbookshelf-20`
3. Runtime gate: `ASIN_DEEP_LINKS_ENABLED = false` in `src/lib/asins.ts`.  
   `amazonBookUrl()` and `lookupAsin()` ignore map / explicit ASINs while the flag is off.
4. `src/data/asins.json` was cleared. Book 1 CTAs (hero, StartHere, aside, dock) and OrderTable shop buttons keep the same UI; they all use search.

## Re-enabling later (only with validation)

When we can verify amazon.com listings (not Open Library alone):

1. Populate `asins.json` with **verified** amazon.com ASINs only.
2. Drop any id that 404s on `https://www.amazon.com/dp/{id}`.
3. Set `ASIN_DEEP_LINKS_ENABLED = true`.
4. Spot-check high-traffic guides (Dune, Empyrean, Harry Potter, Mistborn, etc.).
5. `npm run build` must pass.

`npm run asins` still exists for research against Open Library, but its output must **not** be treated as amazon.com-ready until each ASIN is verified on amazon.com.

## Counts after rollback

| Metric | Value |
| --- | ---: |
| OrderTable shop links using `/dp/` | **0** |
| Shop links using tagged title + author search | **all** |
| Guide Book 1 CTAs kept | yes (search) |
