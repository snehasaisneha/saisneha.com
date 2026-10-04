// Convert reference markers at build time, leaving code and existing links alone.
export default function rehypeReferences() {
  return (tree, file) => {
    const {
      citations = [],
      notes,
      footnotes = [],
    } = file.data.astro?.frontmatter ?? {};
    const definitions = {
      citations: new Map(citations.map(ref => [String(ref.id), ref])),
      // Keep existing fragment IDs stable while standardising authoring.
      footnotes: new Map(
        (notes ?? footnotes).map(ref => [String(ref.id), ref])
      ),
    };
    const occurrences = new Map();
    const skip = new Set([
      "a",
      "code",
      "pre",
      "script",
      "style",
      "textarea",
      "sup",
    ]);
    function walk(node) {
      if (skip.has(node.tagName) || !node.children) return;
      node.children = node.children.flatMap(child => {
        if (child.type !== "text") {
          walk(child);
          return [child];
        }
        const result = [];
        let cursor = 0;
        for (const match of child.value.matchAll(/\[(n\s+)?([\w-]+)\]/g)) {
          const kind = match[1] ? "footnotes" : "citations";
          const id = match[2];
          const ref = definitions[kind].get(id);
          if (!ref) continue;
          const key = `${kind}-${id}`;
          const count = (occurrences.get(key) ?? 0) + 1;
          occurrences.set(key, count);
          const label = `${kind === "citations" ? "Citation" : "Note"} ${id}`;
          const preview = [
            ref.text,
            ref.doi && `DOI: ${ref.doi}`,
            ref.isbn && `ISBN: ${ref.isbn}`,
            ref.pp && `pp. ${ref.pp}`,
          ]
            .filter(Boolean)
            .join(" · ");
          result.push({
            type: "text",
            value: child.value.slice(cursor, match.index),
          });
          result.push({
            type: "element",
            tagName: "sup",
            properties: { className: ["reference-marker"] },
            children: [
              {
                type: "element",
                tagName: "a",
                properties: {
                  id: `${key}-ref-${count}`,
                  href: `#${key}`,
                  title: preview,
                  ariaLabel: `${label}: ${ref.text}`,
                },
                children: [{ type: "text", value: match[0] }],
              },
            ],
          });
          cursor = match.index + match[0].length;
        }
        if (!result.length) return [child];
        result.push({ type: "text", value: child.value.slice(cursor) });
        return result;
      });
    }
    walk(tree);
    if (file.data.astro?.frontmatter) {
      file.data.astro.frontmatter.referenceOccurrences =
        Object.fromEntries(occurrences);
    }
  };
}
