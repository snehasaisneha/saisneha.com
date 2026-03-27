import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/writing";
export const SERIES_PATH = "src/data/series";

const referenceId = z.union([z.string(), z.number()]).transform(value =>
  String(value)
);

const referenceSchema = z.object({
  id: referenceId,
  text: z.string(),
  href: z.string().url().optional(),
  linkText: z.string().optional(),
  archiveHref: z.string().url().optional(),
  archiveLinkText: z.string().optional(),
  doi: z.string().optional(),
  isbn: z.string().optional(),
  pp: z.string().optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      series: z.array(z.string()).optional(),
      citations: z.array(referenceSchema).optional(),
      footnotes: z.array(referenceSchema).optional(),
      timezone: z.string().optional(),
    }),
});

const series = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${SERIES_PATH}` }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { blog, series };
