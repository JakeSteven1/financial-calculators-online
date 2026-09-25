import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Prose imported from the original WordPress site (see scripts/import-wp.mjs).
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    description: z.string(),
    wpId: z.number().optional(),
    wpType: z.string().optional(),
    modified: z.string().optional(),
  }),
});

export const collections = { pages };
