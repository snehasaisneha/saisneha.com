import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/writing";
export const SERIES_PATH = "src/data/series";

const referenceId = z
  .union([z.string(), z.number()])
  .transform(value => String(value))
  .pipe(
    z
      .string()
      .regex(
        /^[A-Za-z0-9_-]+$/,
        "Reference IDs must use letters, digits, underscores, or hyphens."
      )
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

const referenceList = z
  .array(referenceSchema)
  .refine(
    refs => new Set(refs.map(ref => ref.id)).size === refs.length,
    "Reference IDs must be unique within each list."
  );

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z
      .object({
        author: z.string().default(SITE.author),
        pubDatetime: z.date(),
        modDatetime: z.date().optional().nullable(),
        title: z.string(),
        featured: z.boolean().optional(),
        draft: z.boolean().optional(),
        comments: z.boolean().default(true),
        tags: z.array(z.string()).default([]),
        ogImage: image().or(z.string()).optional(),
        subtitle: z.string().optional(),
        canonicalURL: z.string().optional(),
        hideEditPost: z.boolean().optional(),
        series: z.array(z.string()).optional(),
        citations: referenceList.optional(),
        notes: referenceList.optional(),
        // Legacy alias; new posts should use notes.
        footnotes: referenceList.optional(),
        timezone: z.string().optional(),
      })
      .refine(
        data => !(data.notes !== undefined && data.footnotes !== undefined),
        {
          message: "Use notes or legacy footnotes, not both.",
          path: ["notes"],
        }
      )
      .transform(({ footnotes, ...data }) => ({
        ...data,
        notes: data.notes ?? footnotes,
      })),
});

const series = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${SERIES_PATH}` }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { blog, series };
