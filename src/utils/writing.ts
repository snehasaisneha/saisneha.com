import { getCollection, render } from "astro:content";
import getSortedPosts from "./getSortedPosts";
import { slugifyStr } from "./slugify";
import { getPath } from "./getPath";
export const HOME_SIZE = 20;
export const ARCHIVE_SIZE = 100;
export async function writing() {
  const [posts, series] = await Promise.all([
    getCollection("blog"),
    getCollection("series"),
  ]);
  const names = Object.fromEntries(series.map(s => [s.id, s.data.title]));
  return getSortedPosts(posts).map(p => ({
    id: p.id,
    title: p.data.title,
    subtitle: p.data.subtitle ?? "",
    url: getPath(p.id, p.filePath, true, p.data.pubDatetime) + "/",
    date: p.data.pubDatetime.toISOString(),
    year: new Intl.DateTimeFormat("en", {
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(p.data.pubDatetime),
    dateLabel: new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(p.data.pubDatetime),
    tags: p.data.tags,
    series: (p.data.series ?? []).map(name => {
      const id = slugifyStr(name);
      return { id, title: names[id] ?? name };
    }),
  }));
}
export type Writing = Awaited<ReturnType<typeof writing>>[number];

/** Full text is shipped only on archive pages, regenerated with each build. */
export async function archiveWriting() {
  const [entries, posts] = await Promise.all([
    getCollection("blog"),
    writing(),
  ]);
  const byId = new Map(entries.map(entry => [entry.id, entry]));
  return Promise.all(
    posts.map(async post => {
      const entry = byId.get(post.id)!;
      const { remarkPluginFrontmatter } = await render(entry);
      const references = [
        ...(entry.data.notes ?? []),
        ...(entry.data.citations ?? []),
      ];
      return {
        ...post,
        searchText: [
          post.title,
          post.subtitle,
          remarkPluginFrontmatter.searchText ?? "",
          ...references.map(ref =>
            [
              ref.text,
              ref.linkText,
              ref.archiveLinkText,
              ref.doi,
              ref.isbn,
              ref.pp,
            ]
              .filter(Boolean)
              .join(" ")
          ),
        ]
          .join(" ")
          .replace(/\s+/gu, " ")
          .toLowerCase(),
      };
    })
  );
}
export type ArchiveWriting = Awaited<ReturnType<typeof archiveWriting>>[number];

/** Archived posts remain public, but do not occupy homepage slots. */
export async function homeWriting() {
  return (await writing()).filter(post => !post.tags.includes("archive"));
}
