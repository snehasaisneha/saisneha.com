// Extract rendered text at build time, preserving words split by inline markup.
const blocks = new Set([
  "p",
  "div",
  "section",
  "article",
  "blockquote",
  "li",
  "ul",
  "ol",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "pre",
  "br",
  "hr",
  "table",
  "tr",
  "td",
  "th",
  "figure",
  "figcaption",
  "details",
  "summary",
]);

export function searchText(node) {
  if (node.type === "text") return node.value;
  if (["script", "style", "template"].includes(node.tagName)) return "";
  if (node.properties?.hidden || node.properties?.ariaHidden === "true")
    return "";
  if (node.tagName === "img") return ` ${node.properties?.alt ?? ""} `;
  const text = (node.children ?? []).map(searchText).join("");
  return blocks.has(node.tagName) ? ` ${text} ` : text;
}

export default function rehypeSearchText() {
  return (tree, file) => {
    if (file.data.astro?.frontmatter) {
      file.data.astro.frontmatter.searchText = searchText(tree)
        .replace(/\s+/gu, " ")
        .trim();
    }
  };
}
