import { readdir, readFile, writeFile } from "node:fs/promises";
const directory = new URL("../dist/drafts/", import.meta.url);
const folders = await readdir(directory, { withFileTypes: true }).catch(
  error => {
    if (error.code === "ENOENT") return [];
    throw error;
  }
);
const redirects = [];
for (const folder of folders) {
  if (!folder.isDirectory()) continue;
  const state = JSON.parse(
    await readFile(new URL(`${folder.name}/version.json`, directory), "utf8")
  );
  if (state.published) {
    redirects.push(
      `/drafts/${folder.name}  ${state.url}  301!`,
      `/drafts/${folder.name}/  ${state.url}  301!`
    );
  }
}
if (redirects.length) {
  const output = new URL("../dist/_redirects", import.meta.url);
  const existing = await readFile(output, "utf8");
  await writeFile(output, redirects.join("\n") + "\n" + existing);
}
