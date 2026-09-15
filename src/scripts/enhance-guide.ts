function classifyHeading(text: string): string {
  const key = text.replace(/:$/, "").trim().toLowerCase();
  if (key === "faq") return "faq";
  if (key === "sources") return "sources";
  if (key.startsWith("what to read next")) return "next";
  if (key === "common mistakes") return "mistakes";
  return "checkpoint";
}

function takeUntilH2(start: Element): Element[] {
  const nodes: Element[] = [];
  let el = start.nextElementSibling;
  while (el && el.tagName !== "H2") {
    nodes.push(el);
    el = el.nextElementSibling;
  }
  return nodes;
}

function enhanceFaq(h2: Element) {
  const nodes = takeUntilH2(h2);
  if (nodes.length === 0) return;

  const wrap = document.createElement("div");
  wrap.className = "faq-list";
  h2.after(wrap);

  let i = 0;
  while (i < nodes.length) {
    const node = nodes[i];
    const strong = node.tagName === "P" ? node.querySelector("strong") : null;
    const isQuestion = Boolean(strong && node.firstElementChild === strong);

    if (!isQuestion || !strong) {
      wrap.append(node);
      i += 1;
      continue;
    }

    const question = (strong.textContent || "").trim();
    strong.remove();
    const firstBr = node.querySelector("br");
    if (firstBr && firstBr === node.firstChild) firstBr.remove();
    node.innerHTML = node.innerHTML.replace(/^(<br\s*\/?>|\s)+/i, "");

    let answerHtml = node.innerHTML.trim();
    const consumed: Element[] = [node];
    if (!answerHtml && nodes[i + 1]?.tagName === "P") {
      const next = nodes[i + 1];
      answerHtml = next.innerHTML.trim();
      consumed.push(next);
      i += 1;
    }

    const details = document.createElement("details");
    details.className = "faq-item";
    const summary = document.createElement("summary");
    summary.textContent = question;
    const body = document.createElement("div");
    body.className = "faq-answer";
    body.innerHTML = answerHtml;
    details.append(summary, body);
    wrap.append(details);
    consumed.forEach((item) => item.remove());
    i += 1;
  }
}

function enhanceGuide() {
  const prose = document.querySelector(".guide-prose");
  if (!prose) return;

  prose.querySelectorAll("h2").forEach((h2) => {
    const kind = classifyHeading(h2.textContent || "");
    h2.classList.add(`is-${kind}`);

    if (kind === "faq") {
      enhanceFaq(h2);
      return;
    }

    const next = h2.nextElementSibling;
    if (kind === "next" && next && (next.tagName === "OL" || next.tagName === "UL")) {
      next.classList.add("next-reads");
    }
    if (kind === "mistakes" && next && next.tagName === "UL") {
      next.classList.add("mistake-list");
    }
  });
}

enhanceGuide();
