import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";

/**
 * Get full path of a blog post
 * @param id - id of the blog post (aka slug)
 * @param filePath - the blog post full file location
 * @param includeBase - whether to include `/blog` in return value
 * @returns blog post path
 */
export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true,
  pubDatetime?: Date
) {
  const basePath = includeBase ? "/blog" : "";
  const slug = id.split("/").at(-1) ?? id;

  if (pubDatetime) {
    const year = String(pubDatetime.getFullYear());
    const month = String(pubDatetime.getMonth() + 1).padStart(2, "0");
    return [basePath, year, month, slug].join("/");
  }

  const rawSegments =
    filePath
      ?.replace(BLOG_PATH, "")
      .split("/")
      .filter(path => path !== "")
      .filter(path => !path.startsWith("_"))
      .slice(0, -1)
      .map(segment => slugifyStr(segment)) ?? [];

  const year = rawSegments.find(segment => /^\d{4}$/.test(segment));
  const month = rawSegments.find(segment => /^\d{2}$/.test(segment));

  if (year && month) {
    return [basePath, year, month, slug].join("/");
  }

  return [basePath, slug].join("/");
}
