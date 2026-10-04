import { getCollection } from "astro:content";
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

/** Archived posts remain public, but do not occupy homepage slots. */
export async function homeWriting() {
  return (await writing()).filter(post => !post.tags.includes("archive"));
}
