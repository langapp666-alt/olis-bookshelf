import {
  currentGuideSlug,
  matchGuides,
  pickRandomGuide,
  type GuideSearchEntry,
} from "../lib/search";

const LIMIT = 8;
const DEBOUNCE_MS = 120;

let cachedIndex: GuideSearchEntry[] | null = null;
let indexPromise: Promise<GuideSearchEntry[]> | null = null;

function parseIndex(raw: string): GuideSearchEntry[] {
  const data = JSON.parse(raw) as unknown;
  if (!Array.isArray(data)) return [];
  return data.filter((entry): entry is GuideSearchEntry => {
    return (
      Boolean(entry) &&
      typeof entry === "object" &&
      typeof (entry as GuideSearchEntry).slug === "string" &&
      typeof (entry as GuideSearchEntry).href === "string" &&
      typeof (entry as GuideSearchEntry).series === "string" &&
      typeof (entry as GuideSearchEntry).author === "string" &&
      typeof (entry as GuideSearchEntry).title === "string"
    );
  });
}

async function loadIndex(): Promise<GuideSearchEntry[]> {
  if (cachedIndex) return cachedIndex;
  if (indexPromise) return indexPromise;

  indexPromise = (async () => {
    const inline = document.getElementById("guides-index");
    if (inline?.textContent) {
      try {
        cachedIndex = parseIndex(inline.textContent);
        return cachedIndex;
      } catch {
        /* fall through to fetch */
      }
    }

    const res = await fetch("/search-index.json", { credentials: "same-origin" });
    if (!res.ok) return [];
    cachedIndex = parseIndex(await res.text());
    return cachedIndex;
  })();

  try {
    return await indexPromise;
  } finally {
    if (!cachedIndex) indexPromise = null;
  }
}

function currentSlug(): string | undefined {
  return currentGuideSlug(window.location.pathname);
}

function go(href: string) {
  window.location.assign(href);
}

function bindRandom() {
  document.querySelectorAll<HTMLAnchorElement>("[data-random-guide]").forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const index = await loadIndex();
      const pick = pickRandomGuide(index, currentSlug());
      go(pick?.href ?? "/guides/");
    });
  });
}

function bindTypeahead(input: HTMLInputElement) {
  const field =
    input.closest<HTMLElement>("[data-search-field]") ??
    input.parentElement ??
    input;
  field.classList.add("search-field");

  const listId = `${input.id || "find"}-listbox`;
  const list = document.createElement("ul");
  list.id = listId;
  list.className = "typeahead-panel";
  list.setAttribute("role", "listbox");
  list.hidden = true;

  const status = document.createElement("div");
  status.className = "visually-hidden";
  status.setAttribute("aria-live", "polite");

  field.append(list, status);

  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "false");
  input.setAttribute("aria-controls", listId);
  input.setAttribute("aria-haspopup", "listbox");

  let items: GuideSearchEntry[] = [];
  let active = -1;
  let timer = 0;

  const close = () => {
    list.hidden = true;
    list.innerHTML = "";
    items = [];
    active = -1;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    status.textContent = "";
  };

  const paintActive = () => {
    [...list.children].forEach((child, i) => {
      const on = i === active;
      child.classList.toggle("is-active", on);
      child.setAttribute("aria-selected", on ? "true" : "false");
      if (on) {
        input.setAttribute("aria-activedescendant", child.id);
        (child as HTMLElement).scrollIntoView({ block: "nearest" });
      }
    });
    if (active < 0) input.removeAttribute("aria-activedescendant");
  };

  const render = (results: GuideSearchEntry[], q: string) => {
    items = results;
    active = results.length ? 0 : -1;
    list.innerHTML = "";

    if (!q) {
      close();
      return;
    }

    if (results.length === 0) {
      const empty = document.createElement("li");
      empty.className = "typeahead-empty";
      empty.setAttribute("role", "presentation");
      empty.textContent = "No matching guides";
      list.append(empty);
      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
      status.textContent = "No matching guides";
      return;
    }

    results.forEach((entry, i) => {
      const option = document.createElement("li");
      option.id = `${listId}-opt-${i}`;
      option.className = "typeahead-option";
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", i === 0 ? "true" : "false");
      option.dataset.href = entry.href;

      const series = document.createElement("span");
      series.className = "typeahead-series";
      series.textContent = entry.series;

      const meta = document.createElement("span");
      meta.className = "typeahead-meta";
      meta.textContent = entry.author;

      option.append(series, meta);
      option.addEventListener("mousedown", (event) => {
        event.preventDefault();
        go(entry.href);
      });
      list.append(option);
    });

    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
    paintActive();
    status.textContent =
      results.length === 1 ? "1 matching guide" : `${results.length} matching guides`;
  };

  const run = async () => {
    const q = input.value.trim();
    if (!q) {
      close();
      return;
    }
    const index = await loadIndex();
    render(matchGuides(index, q, LIMIT), q);
  };

  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      void run();
    }, DEBOUNCE_MS);
  };

  input.addEventListener("input", schedule);
  input.addEventListener("focus", () => {
    if (input.value.trim()) void run();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      input.value = "";
      close();
      input.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    if (event.key === "ArrowDown") {
      if (items.length === 0) return;
      event.preventDefault();
      active = (active + 1) % items.length;
      paintActive();
      return;
    }

    if (event.key === "ArrowUp") {
      if (items.length === 0) return;
      event.preventDefault();
      active = (active - 1 + items.length) % items.length;
      paintActive();
      return;
    }

    if (event.key === "Enter") {
      if (active >= 0 && items[active]) {
        event.preventDefault();
        go(items[active].href);
      }
    }
  });

  document.addEventListener("click", (event) => {
    if (!field.contains(event.target as Node)) close();
  });
}

function bindSearchForms() {
  document.querySelectorAll<HTMLFormElement>("form[data-search-field]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      const input = form.querySelector<HTMLInputElement>("[data-typeahead]");
      if (!input) return;
      const q = input.value.trim();
      const selected = form.querySelector<HTMLElement>(".typeahead-option.is-active");
      if (selected?.dataset.href) {
        event.preventDefault();
        go(selected.dataset.href);
        return;
      }
      if (!q) event.preventDefault();
    });
  });
}

export function bindSiteSearch() {
  document.querySelectorAll<HTMLInputElement>("[data-typeahead]").forEach(bindTypeahead);
  bindSearchForms();
  bindRandom();
}

bindSiteSearch();
