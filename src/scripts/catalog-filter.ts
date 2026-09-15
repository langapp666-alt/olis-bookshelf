export function bindCatalogFind(root: ParentNode = document) {
  const find = root.querySelector<HTMLElement>("[data-catalog-find]");
  const input = root.querySelector<HTMLInputElement>("[data-catalog-filter]");
  if (!input) return;

  const items = [...root.querySelectorAll<HTMLElement>("[data-catalog-item]")];
  const shelves = [...root.querySelectorAll<HTMLElement>("[data-shelf]")];
  const featured = root.querySelectorAll<HTMLElement>("[data-featured]");
  const masthead = root.querySelector<HTMLElement>("[data-masthead]");
  const empty = root.querySelector<HTMLElement>("[data-catalog-empty]");
  const countEl = root.querySelector<HTMLElement>("[data-catalog-count]");
  const chips = [...root.querySelectorAll<HTMLButtonElement>("[data-catalog-genre]")];
  const total = Number(find?.getAttribute("data-catalog-total") || items.length);

  const params = new URLSearchParams(window.location.search);
  const initialQ = params.get("q") ?? "";
  const initialGenre = params.get("genre") ?? "";
  if (initialQ) input.value = initialQ;

  let genre = chips.some((chip) => chip.dataset.catalogGenre === initialGenre) ? initialGenre : "";

  const syncChips = () => {
    chips.forEach((chip) => {
      chip.setAttribute("aria-pressed", chip.dataset.catalogGenre === genre ? "true" : "false");
    });
  };

  const persist = () => {
    const next = new URL(window.location.href);
    if (input.value.trim()) next.searchParams.set("q", input.value.trim());
    else next.searchParams.delete("q");
    if (genre) next.searchParams.set("genre", genre);
    else next.searchParams.delete("genre");
    window.history.replaceState({}, "", next);
  };

  const apply = (writeUrl = false) => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;

    items.forEach((item) => {
      const hay = item.getAttribute("data-catalog-text") || "";
      const itemGenre = item.getAttribute("data-genre") || "";
      const show = (!q || hay.includes(q)) && (!genre || itemGenre === genre);
      item.hidden = !show;
      if (show) visible += 1;
    });

    shelves.forEach((shelf) => {
      const shown = [...shelf.querySelectorAll<HTMLElement>("[data-catalog-item]")].filter(
        (item) => !item.hidden,
      );
      shelf.hidden = shown.length === 0;
      const count = shelf.querySelector<HTMLElement>("[data-shelf-total]");
      if (count) {
        const total = Number(count.getAttribute("data-shelf-total") || shown.length);
        const n = q || genre ? shown.length : total;
        const label = n === 1 ? "1 map" : `${n} maps`;
        const link = count.querySelector("a");
        if (link) link.textContent = label;
        else count.textContent = label;
      }
    });

    featured.forEach((block) => {
      block.hidden = Boolean(q || genre);
    });
    if (masthead) {
      masthead.hidden = Boolean(q || genre);
    }

    if (empty) {
      empty.hidden = visible > 0;
    }

    if (countEl) {
      if (!q && !genre) {
        countEl.textContent = `${total} series maps`;
      } else {
        countEl.textContent = visible === 1 ? "1 series" : `${visible} series`;
      }
    }

    syncChips();
    if (writeUrl) persist();
  };

  input.addEventListener("input", () => apply(true));
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      genre = chip.dataset.catalogGenre ?? "";
      apply(true);
    });
  });

  apply(false);

  if ((initialQ || genre) && find) {
    find.scrollIntoView({ block: "start" });
  }
}
