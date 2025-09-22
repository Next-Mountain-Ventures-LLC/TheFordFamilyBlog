// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';

// 2. Define blog collection schema
const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string(),
    category: z.string(),
    imageUrl: z.string(),
    slug: z.string().optional(),
  }),
});

// 3. Export collections
export const collections = {
  'blog': blogCollection,
};