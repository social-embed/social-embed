import { defineCollection, z } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { glob } from "astro/loaders";

// Starlight's docs collection (kept during migration)
const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema(),
});

// Pure Astro docs collection using glob() loader
// This will replace Starlight's collection after migration
const pureDocs = defineCollection({
  loader: glob({
    base: "./src/content/docs",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    description: z.string().optional(),

    // Custom head elements (for page-specific styles)
    head: z
      .array(
        z.object({
          attrs: z.record(z.string()).optional(),
          content: z.string().optional(),
          tag: z.string(),
        }),
      )
      .optional(),

    // URL control
    id: z.string().optional(),

    // Sidebar configuration
    sidebar: z
      .object({
        badge: z
          .object({
            text: z.string(),
            variant: z
              .enum(["note", "tip", "caution", "danger", "success"])
              .optional(),
          })
          .optional(),
        label: z.string().optional(),
        order: z.number().optional(),
      })
      .optional(),
    sidebar_label: z.string().optional(),
    slug: z.string().optional(),

    // Table of contents
    tableOfContents: z.boolean().default(true),
    // Core fields
    title: z.string(),
  }),
});

export const collections = {
  docs,
  "pure-docs": pureDocs,
};
