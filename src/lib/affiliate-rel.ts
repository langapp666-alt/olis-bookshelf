type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function isAmazonHref(href: unknown): href is string {
  return typeof href === "string" && /(?:^|\.)amazon\./i.test(href);
}

/** Add rel="sponsored nofollow" to Amazon links in Markdown/MDX. */
export function affiliateRel() {
  return function transform(tree: HastNode) {
    const walk = (node: HastNode) => {
      if (node.type === "element" && node.tagName === "a" && isAmazonHref(node.properties?.href)) {
        const existing = String(node.properties?.rel ?? "");
        const tokens = new Set(existing.split(/\s+/).filter(Boolean));
        tokens.add("sponsored");
        tokens.add("nofollow");
        node.properties = { ...node.properties, rel: [...tokens].join(" ") };
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
