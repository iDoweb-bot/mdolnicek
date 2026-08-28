import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string().max(220),
    stack: z.array(z.string()).min(1),
    role: z.string(),
    link: z.string().url().optional(),
    order: z.number().default(0)
  })
});

const blog = defineCollection({
  loader: glob({ pattern: '[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  })
});

export const collections = { projects, blog };
