import { randomUUID } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseDocument } from "yaml";

/** Insert only the generated line; preserve all existing prose/YAML formatting. */
export function assignPreviewId(
  source,
  { readonly = false, filename = "post", uuid = randomUUID } = {}
) {
  const match =
    /^(\uFEFF?---[ \t]*\r?\n)([\s\S]*?)(^---[ \t]*(?:\r?\n|$))/m.exec(source);
  if (!match || match.index !== 0) return source;
  const doc = parseDocument(match[2]);
  if (doc.errors.length)
    throw new Error(`${filename}: ${doc.errors[0].message}`);
  if (doc.get("draftPreview") !== true || doc.has("previewId")) return source;
  if (readonly)
    throw new Error(
      `${filename}: draftPreview is enabled without a saved previewId. Run pnpm drafts:sync locally and commit the generated ID before deploying.`
    );
  const newline = match[1].endsWith("\r\n") ? "\r\n" : "\n";
  const offset = match[1].length + match[2].length;
  return (
    source.slice(0, offset) +
    `previewId: "${uuid()}"${newline}` +
    source.slice(offset)
  );
}

export async function syncPreviewIds(directory, options = {}) {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) count += await syncPreviewIds(path, options);
    else if (
      entry.isFile() &&
      entry.name.endsWith(".md") &&
      !basename(path).startsWith("_")
    ) {
      const source = await readFile(path, "utf8");
      const updated = assignPreviewId(source, { ...options, filename: path });
      if (updated !== source) {
        // Don't overwrite an edit made while this scan was in progress.
        if ((await readFile(path, "utf8")) !== source) continue;
        await writeFile(path, updated);
        count++;
      }
    }
  }
  return count;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const count = await syncPreviewIds(resolve("src/data/writing"), {
    readonly: !!process.env.CI || !!process.env.NETLIFY,
  });
  process.stdout.write(`Saved ${count} new draft preview ID(s).\n`);
}
