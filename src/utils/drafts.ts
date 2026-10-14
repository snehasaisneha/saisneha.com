import { getCollection, type CollectionEntry } from "astro:content";
import { createHash } from "node:crypto";
import postFilter from "./postFilter";
import { getPath } from "./getPath";

export async function previewEntries() {
  const entries = await getCollection("blog");
  const seen = new Set<string>();
  for (const post of entries) {
    const id = post.data.previewId;
    if (!id) continue;
    if (seen.has(id)) throw new Error(`Duplicate previewId: ${id}`);
    seen.add(id);
  }
  return entries.filter(
    post =>
      post.data.draftPreview &&
      post.data.previewId &&
      (post.data.draft || postFilter(post))
  );
}
export function previewState(post: CollectionEntry<"blog">) {
  return {
    version: createHash("sha256")
      .update(JSON.stringify(["draft-v1", post.body, post.data]))
      .digest("hex")
      .slice(0, 20),
    url: post.data.draft
      ? `/drafts/${post.data.previewId}/`
      : getPath(post.id, post.filePath, true, post.data.pubDatetime) + "/",
    published: !post.data.draft,
  };
}
