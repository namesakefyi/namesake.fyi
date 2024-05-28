import { z, defineCollection } from "astro:content";

export const collections = {
  posts: defineCollection({
    type: "content",
    schema: z.object({
      isDraft: z.boolean(),
      title: z.string(),
      publishDate: z
        .string()
        .or(z.date())
        .transform((v) => new Date(v)),
      authors: z.array(z.string()),
      image: z.string().optional(),
    }),
  }),

  authors: defineCollection({
    type: "content",
    schema: z.object({
      name: z.string(),
      title: z.string().optional(),
      avatar: z.string().optional(),
    }),
  }),
};
