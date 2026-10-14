import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
const source = ts.transpileModule(
  await readFile(
    new URL("../src/scripts/draft-updates.ts", import.meta.url),
    "utf8"
  ),
  {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.None,
    },
  }
).outputText;
const flush = () => new Promise(resolve => setImmediate(resolve));
function setup({
  saved,
  hidden = false,
  fail = false,
  response = { version: "new", url: "/drafts/id/", published: false },
  statusCode = 200,
  nodes = [],
} = {}) {
  const events = {};
  const button = {
    hidden: false,
    addEventListener: (name, fn) => {
      events[name] = fn;
    },
  };
  const status = {};
  const banner = {
    hidden: true,
    dataset: { draftVersion: "old" },
    querySelector: selector => (selector === "button" ? button : status),
  };
  const storage = new Map(
    saved
      ? [
          [
            "draft-position:/drafts/id/",
            JSON.stringify({ at: Date.now(), ...saved }),
          ],
        ]
      : []
  );
  const calls = [];
  const location = {
    pathname: "/drafts/id/",
    origin: "https://example.com",
    href: "https://example.com/drafts/id/",
    reload: () => calls.push("reload"),
    assign: url => calls.push(url),
  };
  const document = {
    hidden,
    images: [],
    fonts: { ready: Promise.resolve() },
    documentElement: { scrollHeight: 2000 },
    querySelector: () => banner,
    querySelectorAll: () => nodes,
    getElementById: id => nodes.find(n => n.id === id),
    addEventListener: (name, fn) => {
      events[name] = fn;
    },
  };
  vm.runInNewContext(source, {
    document,
    location,
    sessionStorage: {
      getItem: k => storage.get(k),
      removeItem: k => storage.delete(k),
      setItem: (k, v) => storage.set(k, v),
    },
    window: {
      addEventListener: (name, fn) => {
        events[name] = fn;
      },
      scrollTo: position => calls.push(position),
    },
    scrollY: 500,
    innerHeight: 800,
    requestAnimationFrame: fn => fn(),
    setInterval: fn => {
      events.tick = fn;
    },
    setTimeout,
    URL,
    AbortSignal,
    fetch: async (_, options) => {
      calls.push(options.cache);
      if (fail) throw new Error("offline");
      return {
        ok: statusCode === 200,
        status: statusCode,
        json: async () => response,
      };
    },
  });
  return { banner, button, status, events, storage, calls, document };
}
test("new versions offer reload without reloading automatically; requests bypass cache", async () => {
  const s = setup();
  await flush();
  assert.equal(s.banner.hidden, false);
  assert.equal(s.status.textContent, "New version available");
  assert.deepEqual(s.calls, ["no-store"]);
  s.events.click();
  assert.equal(s.calls.at(-1), "reload");
  assert.equal(s.storage.size, 1);
});
test("unchanged versions, offline checks, and hidden tabs do not display an update", async () => {
  for (const options of [
    { response: { version: "old", url: "/drafts/id/" } },
    { fail: true },
    { hidden: true },
  ]) {
    const s = setup(options);
    await flush();
    assert.equal(s.banner.hidden, true);
    if (options.hidden) {
      assert.equal(s.calls.length, 0);
      s.document.hidden = false;
      s.events.visibilitychange();
      await flush();
      assert.equal(s.banner.hidden, false);
    }
  }
});
test("published and deleted drafts provide appropriate actions", async () => {
  const pub = setup({
    response: { version: "new", url: "/blog/final/", published: true },
  });
  await flush();
  assert.equal(pub.button.textContent, "Read post");
  pub.events.click();
  assert.equal(pub.calls.at(-1), "https://example.com/blog/final/");
  const gone = setup({ statusCode: 404 });
  await flush();
  assert.equal(gone.button.hidden, true);
  assert.equal(gone.status.textContent, "This draft is no longer available");
});
test("reload restores the same passage despite content inserted above it", async () => {
  const node = {
    tagName: "P",
    textContent: "The passage",
    getBoundingClientRect: () => ({ top: 400, bottom: 500 }),
  };
  const s = setup({
    nodes: [node],
    saved: { text: "The passage", offset: 30, ratio: 0.2 },
  });
  await flush();
  assert.equal(s.calls.find(c => typeof c === "object").top, 870);
  assert.equal(s.storage.size, 0);
});
test("removed passage falls back to heading, then reading percentage", async () => {
  const heading = {
    id: "section",
    tagName: "H2",
    textContent: "Section",
    getBoundingClientRect: () => ({ top: 200, bottom: 230 }),
  };
  const s = setup({
    nodes: [heading],
    saved: { text: "Removed", heading: "section", offset: 10, ratio: 0.25 },
  });
  await flush();
  assert.equal(s.calls.find(c => typeof c === "object").top, 676);
  const fallback = setup({ saved: { text: "Removed", ratio: 0.25 } });
  await flush();
  assert.equal(fallback.calls.find(c => typeof c === "object").top, 300);
});
