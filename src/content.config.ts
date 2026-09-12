import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const genres = ["epic-fantasy", "space-opera", "mystery-thriller"] as const;

const guides = defineCollection({
  loader: glob({ base: "./src/content/guides", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    genre: z.enum(genres),
    lastVerified: z.coerce.date(),
    slug: z.string(),
    series: z.string(),
    author: z.string(),
    status: z.enum(["draft", "reviewed"]),
    reviewFlags: z.array(z.string()).default([]),
    sources: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url(),
        }),
      )
      .default([]),
  }),
});

export const collections = { guides };
