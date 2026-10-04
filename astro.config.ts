import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeReferences from "./src/plugins/rehype-references.js";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  output: "static",
  redirects: { "/about": "/" },
  prefetch: { defaultStrategy: "hover" },
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [rehypeReferences],
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    // Allow the FastComments iframe to load our self-hosted fonts in previews.
    server: { cors: { origin: "https://fastcomments.com" } },
    preview: { cors: { origin: "https://fastcomments.com" } },
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  experimental: {
    preserveScriptOrder: true,
  },
});
