import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({
    pattern: ["**/*.md"],
    base: "./src/content/articles",
  }),
  schema: z.object({
    title: z.string(),
    category: z.string().optional(),
    description: z.string(),
    draft: z.boolean().optional(),
    image: z.string().optional(),
    date: z.date(),
    tools: z.array(z.string()),
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/tools" }),
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    url: z.string(),
  }),
});

export const collections = { articles, tools };
