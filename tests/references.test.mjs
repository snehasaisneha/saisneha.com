import test from "node:test";
import assert from "node:assert/strict";
import plugin from "../src/plugins/rehype-references.js";
const text = value => ({ type: "text", value });
const el = (tagName, children) => ({ type: "element", tagName, children });
const frontmatter = { citations: [{ id: 1, text: '<unsafe> "source"', doi: "10.test", pp: "2" }, { id: "other", text: "Other source" }], notes: [{ id: 1, text: "Side note" }] };
function convert(children) {
  const tree = { type: "root", children };
  plugin()(tree, { data: { astro: { frontmatter } } });
  return tree;
}
test("links repeated citations and notes with distinct IDs and preserves unknown markers", () => {
  const tree = convert([el("p", [text("Claim [1], again [1], note [n 1], named [other], unknown [2].")])]);
  const children = tree.children[0].children;
  const links = children.filter(n => n.tagName === "sup").map(n => n.children[0]);
  assert.deepEqual(links.map(n => n.properties.href), ["#citations-1", "#citations-1", "#footnotes-1", "#citations-other"]);
  assert.equal(new Set(links.map(n => n.properties.id)).size, 4);
  assert.equal(links[0].properties.title, '<unsafe> "source" · DOI: 10.test · pp. 2');
  assert.equal(children.at(-1).value, ", unknown [2].");
  assert.ok(links[0].properties.ariaLabel.startsWith("Citation 1:"));
});
test("does not replace markers inside links, code, scripts, or existing superscripts", () => {
  for (const tag of ["a", "code", "pre", "script", "style", "textarea", "sup"]) {
    const node = el(tag, [text("[1] [n 1]")]);
    assert.deepEqual(convert([node]).children, [el(tag, [text("[1] [n 1]")])]);
  }
});
test("converts emphasis but leaves ordinary markdown footnote syntax alone", () => {
  const tree = convert([el("em", [text("[1] [^note]")])]);
  assert.equal(tree.children[0].children[1].tagName, "sup");
  assert.equal(tree.children[0].children.at(-1).value, " [^note]");
});
test("works on pages with no reference metadata", () => {
  const tree = { type: "root", children: [text("[1]")] };
  plugin()(tree, { data: {} });
  assert.deepEqual(tree.children, [text("[1]")]);
});

test("legacy footnotes metadata still links to the same note targets", () => {
  const tree = { type: "root", children: [text("[n 1]")] };
  plugin()(tree, { data: { astro: { frontmatter: { footnotes: [{ id: 1, text: "Legacy note" }] } } } });
  assert.equal(tree.children[1].children[0].properties.href, "#footnotes-1");
});

test("exports counts for backlinks without counting code or unused notes", () => {
  const metadata = { notes: [{ id: 1, text: "Repeated" }, { id: "unused", text: "Unused" }] };
  const tree = { type: "root", children: [el("p", [text("[n 1] and [n 1]")]), el("code", [text("[n 1]")])] };
  plugin()(tree, { data: { astro: { frontmatter: metadata } } });
  assert.deepEqual(metadata.referenceOccurrences, { "footnotes-1": 2 });
});
