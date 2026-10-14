import { fileURLToPath } from "node:url";
import { resolve, sep } from "node:path";
import { syncPreviewIds } from "../../scripts/draft-preview-ids.mjs";

/** @returns {import('astro').AstroIntegration} */
export default function draftPreviewIds() {
  let directory;
  return {
    name: "sticky-draft-preview-ids",
    hooks: {
      "astro:config:setup": async ({ config, logger }) => {
        directory = resolve(fileURLToPath(config.root), "src/data/writing");
        const count = await syncPreviewIds(directory, {
          readonly: !!process.env.CI || !!process.env.NETLIFY,
        });
        if (count)
          logger.info(
            `Saved ${count} draft preview ID(s) to front matter. Include them in your commit.`
          );
      },
      "astro:server:setup": ({ server, logger }) => {
        let pending = Promise.resolve();
        const update = path => {
          if (
            !resolve(path).startsWith(directory + sep) ||
            !path.endsWith(".md")
          )
            return;
          pending = pending
            .then(() => syncPreviewIds(directory))
            .catch(error => logger.error(String(error)));
        };
        server.watcher.on("add", update);
        server.watcher.on("change", update);
        server.httpServer?.once("close", () => {
          server.watcher.off("add", update);
          server.watcher.off("change", update);
        });
      },
    },
  };
}
