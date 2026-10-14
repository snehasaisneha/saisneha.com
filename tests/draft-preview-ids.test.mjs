import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rename, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  assignPreviewId,
  syncPreviewIds,
} from "../scripts/draft-preview-ids.mjs";
const id = "1a573f30-8a9c-4ba4-a693-72e88158a306";
const source =
  '---\ntitle: "Keep my words" # comment\ndraft: true\ndraftPreview: true\n---\n\nUnchanged prose.\n';
test("generates once, preserves all original bytes, and keeps its ID through toggles", () => {
  const result = assignPreviewId(source, { uuid: () => id });
  assert.equal(result.replace(`previewId: "${id}"\n`, ""), source);
  const noNewId = () => {
    throw new Error("must not generate again");
  };
  assert.equal(assignPreviewId(result, { uuid: noNewId }), result);
  const disabled = result.replace("draftPreview: true", "draftPreview: false");
  assert.equal(assignPreviewId(disabled, { uuid: noNewId }), disabled);
  assert.equal(
    assignPreviewId(
      disabled.replace("draftPreview: false", "draftPreview: true"),
      { uuid: noNewId }
    ),
    result
  );
});
test("requires an actual boolean opt-in, and ignores markers in prose or block strings", () => {
  for (const value of ["false", '"true"'])
    assert.equal(
      assignPreviewId(
        source.replace("draftPreview: true", `draftPreview: ${value}`)
      ),
      source.replace("draftPreview: true", `draftPreview: ${value}`)
    );
  const absent =
    "---\ntitle: Test\nsubtitle: |\n  draftPreview: true\n---\ndraftPreview: true\n";
  assert.equal(assignPreviewId(absent), absent);
});
test("retains CRLF and refuses ambiguous YAML instead of editing it", () => {
  const windows = source.replaceAll("\n", "\r\n");
  assert.equal(
    assignPreviewId(windows, { uuid: () => id }).replace(
      `previewId: "${id}"\r\n`,
      ""
    ),
    windows
  );
  assert.throws(
    () => assignPreviewId(source.replace("draft: true", "draftPreview: false")),
    /Map keys must be unique/
  );
});
test("CI rejects ephemeral IDs but accepts a saved ID, or a disabled preview", () => {
  assert.throws(
    () => assignPreviewId(source, { readonly: true }),
    /commit the generated ID/
  );
  const saved = assignPreviewId(source, { uuid: () => id });
  assert.equal(assignPreviewId(saved, { readonly: true }), saved);
  assert.equal(
    assignPreviewId(
      source.replace("draftPreview: true", "draftPreview: false"),
      { readonly: true }
    ).includes("previewId"),
    false
  );
});
test("persisted ID survives subsequent scans and file renaming", async () => {
  const dir = await mkdtemp(join(tmpdir(), "sticky-drafts-"));
  try {
    await writeFile(join(dir, "post.md"), source);
    assert.equal(await syncPreviewIds(dir), 1);
    const saved = await readFile(join(dir, "post.md"), "utf8");
    assert.match(saved, /previewId: "[0-9a-f-]{36}"/);
    await rename(join(dir, "post.md"), join(dir, "renamed.md"));
    assert.equal(await syncPreviewIds(dir), 0);
    assert.equal(await readFile(join(dir, "renamed.md"), "utf8"), saved);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("dev watcher persists IDs when an existing file enables its preview", async () => {
  const { default: integration } =
    await import("../src/integrations/draft-preview-ids.mjs");
  const { EventEmitter } = await import("node:events");
  const { mkdir } = await import("node:fs/promises");
  const { pathToFileURL } = await import("node:url");
  const dir = await mkdtemp(join(tmpdir(), "draft-watch-"));
  const watcher = new EventEmitter();
  const httpServer = new EventEmitter();
  const errors = [];
  const logger = { info() {}, error: error => errors.push(error) };
  try {
    const writing = join(dir, "src/data/writing");
    await mkdir(writing, { recursive: true });
    const file = join(writing, "post.md");
    await writeFile(
      file,
      source.replace("draftPreview: true", "draftPreview: false")
    );
    const hooks = integration().hooks;
    await hooks["astro:config:setup"]({
      config: { root: pathToFileURL(dir + "/") },
      logger,
    });
    hooks["astro:server:setup"]({ server: { watcher, httpServer }, logger });
    await writeFile(file, source);
    watcher.emit("change", file);
    let saved;
    for (let i = 0; i < 100; i++) {
      saved = await readFile(file, "utf8");
      if (saved.includes("previewId:")) break;
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    assert.match(saved, /previewId: "[0-9a-f-]{36}"/);
    assert.deepEqual(errors, []);
    httpServer.emit("close");
    assert.equal(watcher.listenerCount("change"), 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
