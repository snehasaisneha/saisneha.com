import test from 'node:test';
import assert from 'node:assert/strict';
import plugin from '../src/plugins/rehype-search-text.js';
const text = value => ({ type: 'text', value });
const el = (tagName, children, properties = {}) => ({ type: 'element', tagName, children, properties });
function extract(children) {
  const file = { data: { astro: { frontmatter: {} } } };
  plugin()({ type: 'root', children }, file);
  return file.data.astro.frontmatter.searchText;
}
test('indexes readable text across inline markup and separates blocks', () => {
  assert.equal(extract([
    el('p', [text('Read '), el('em', [text('all')]), text(' of this & that.')]),
    el('p', [text('word'), el('strong', [text('part')])]),
    el('pre', [el('code', [text('sample code')])]),
    el('img', [], { alt: 'Image description' }),
  ]), 'Read all of this & that. wordpart sample code Image description');
});
test('excludes executable content and hidden elements, retaining native footnotes', () => {
  assert.equal(extract([
    el('script', [text('secretScript')]), el('style', [text('CSS')]),
    el('p', [text('hidden')], { hidden: true }),
    el('section', [el('ol', [el('li', [text('Footnote text')])])]),
  ]), 'Footnote text');
});
