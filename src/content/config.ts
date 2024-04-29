import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    schema: z.object({
        title: z.string(),
        // .coerce (tries to) transform a string (or other type) into a Date object
        publication: z.coerce.date(),
    }),
});

export const collections = { blog };
