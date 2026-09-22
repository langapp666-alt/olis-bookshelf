const COL_CLASS: Record<string, string> = {
  "#": "col-n",
  n: "col-n",
  year: "col-year",
  form: "col-form",
  amazon: "col-amazon",
  shop: "col-amazon",
  title: "col-title",
  notes: "col-notes",
};

export function enhanceTables() {
  document.querySelectorAll<HTMLTableElement>(".prose table").forEach((table) => {
    let wrap = table.parentElement;
    if (!wrap?.classList.contains("table-wrap")) {
      wrap = document.createElement("div");
      wrap.className = "table-wrap";
      table.parentNode?.insertBefore(wrap, table);
      wrap.appendChild(table);
    }

    if (!wrap.querySelector(".table-hint")) {
      const hint = document.createElement("p");
      hint.className = "table-hint";
      hint.textContent = "Swipe sideways for the full table.";
      wrap.insertBefore(hint, table);
    }

    const headers = [...table.querySelectorAll("thead th")].map((th) =>
      (th.textContent || "").trim(),
    );

    headers.forEach((header, i) => {
      const colClass = COL_CLASS[header.toLowerCase()];
      const th = table.querySelectorAll("thead th")[i];
      if (colClass && th && !th.classList.contains(colClass)) th.classList.add(colClass);
    });

    table.querySelectorAll("tbody tr").forEach((tr) => {
      [...tr.children].forEach((td, i) => {
        if (headers[i]) td.setAttribute("data-label", headers[i]);
        const colClass = COL_CLASS[headers[i]?.toLowerCase() ?? ""];
        if (colClass && !td.classList.contains(colClass)) td.classList.add(colClass);
      });
    });

    table.classList.add("is-stacked");
    wrap.classList.add("is-stacked");
  });
}

enhanceTables();
export default enhanceTables;
