import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const genres = ["epic-fantasy", "space-opera", "mystery-thriller", "romance"] as const;

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
    coverId: z.number().int().positive().optional(),
    isbn: z.string().optional(),
    olid: z.string().optional(),
    gbid: z.string().optional(),
    status: z.enum(["draft", "published", "reviewed"]).default("published"),
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

/** Optional book-1 Amazon control on buy-intent question hubs. Never invent ASINs. */
const questionBuy = z.object({
  title: z.string(),
  author: z.string(),
  year: z.number().int().optional(),
  query: z.string().optional(),
  asin: z
    .string()
    .regex(/^[A-Z0-9]{10}$/i, "ASIN must be 10 alphanumeric characters")
    .optional(),
});

/** Short intent pages that answer one question and send people to a full guide. */
const questions = defineCollection({
  loader: glob({ base: "./src/content/questions", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    shortAnswerTitle: z.string(),
    shortAnswer: z.string(),
    genre: z.enum(genres),
    lastVerified: z.coerce.date(),
    slug: z.string(),
    guides: z.array(z.string()).min(1),
    buy: questionBuy.optional(),
    status: z.enum(["draft", "published", "reviewed"]).default("published"),
  }),
});

export const collections = { guides, questions };
