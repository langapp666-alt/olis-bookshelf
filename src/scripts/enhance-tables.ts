function enhanceTables() {
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
    table.querySelectorAll("tbody tr").forEach((tr) => {
      [...tr.children].forEach((td, i) => {
        if (headers[i]) td.setAttribute("data-label", headers[i]);
      });
    });

    table.classList.add("is-stacked");
    wrap.classList.add("is-stacked");
  });
}

enhanceTables();
