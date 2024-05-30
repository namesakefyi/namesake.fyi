import { z, defineCollection, reference } from "astro:content";

export const collections = {
  authors: defineCollection({
    type: "content",
    schema: ({ image }) =>
      z.object({
        name: z.string(),
        title: z.string().optional(),
        avatar: image().optional(),
      }),
  }),

  posts: defineCollection({
    type: "content",
    schema: z.object({
      isDraft: z.boolean(),
      title: z.string(),
      publishDate: z
        .string()
        .or(z.date())
        .transform((v) => new Date(v)),
      authors: z.array(reference("authors")),
      image: z.string().optional(),
    }),
  }),

  partners: defineCollection({
    type: "data",
    schema: ({ image }) =>
      z.object({
        name: z.string(),
        logo: image(),
        url: z.string(),
        height: z.number(),
      }),
  }),
};
