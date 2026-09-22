/**
 * Client boot: defer non-critical work so guide Amazon taps stay responsive.
 * Search index is fetched on demand (no inline JSON on every page).
 * Soft-nav risk: catalog URL writes are debounced in catalog-filter.
 */

function idle(run: () => void) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => run(), { timeout: 1200 });
  } else {
    window.setTimeout(run, 1);
  }
}

function enhancePage() {
  const needsTables = Boolean(document.querySelector(".prose table, .order-table"));
  const needsGuide = Boolean(document.querySelector(".guide-prose"));
  if (!needsTables && !needsGuide) return;

  idle(() => {
    if (needsTables) void import("./enhance-tables");
    if (needsGuide) void import("./enhance-guide");
  });
}

function bindSearchLazy() {
  const inputs = document.querySelectorAll<HTMLInputElement>("[data-typeahead]");
  const randoms = document.querySelectorAll<HTMLAnchorElement>("[data-random-guide]");
  if (inputs.length === 0 && randoms.length === 0) return;

  let booted = false;
  const boot = async () => {
    if (booted) return;
    booted = true;
    const { bindSiteSearch } = await import("./site-search");
    bindSiteSearch();
  };

  inputs.forEach((input) => {
    input.addEventListener("pointerdown", () => void boot(), { once: true });
    input.addEventListener("focus", () => void boot(), { once: true });
  });

  randoms.forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const { goRandomGuide } = await import("./site-search");
      await goRandomGuide();
    });
  });
}

enhancePage();
bindSearchLazy();
