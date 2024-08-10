import { z, defineCollection, reference } from "astro:content";
import type { RoughAnnotationType } from "rough-notation/lib/model";
import type { NamesakeColor } from "~/data/colors";

export const collections = {
  authors: defineCollection({
    type: "data",
    schema: ({ image }) =>
      z.object({
        name: z.string(),
        role: z.string(),
        bio: z.string(),
        avatar: image(),
        socialLinks: z.object({
          name: z.string(),
          url: z.string().url()
        }).array().optional(),
      }),
  }),

  pages: defineCollection({
    type: "content",
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z.string().optional(),
        ogImage: z
          .object({
            image: image(),
            alt: z.string(),
          })
          .optional(),
        annotation: z.custom<RoughAnnotationType>().optional(),
        color: z.custom<NamesakeColor>().optional(),
      }),
  }),

  posts: defineCollection({
    type: "content",
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z.string().min(70).max(160),
        publishDate: z
          .string()
          .or(z.date())
          .transform((v) => new Date(v)),
        authors: z.array(reference("authors")),
        image: z
          .object({
            src: image(),
            alt: z.string(),
          })
          .optional(),
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

  press: defineCollection({
    type: "data",
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        date: z.date(),
        url: z.string(),
        outlet: z.string(),
        image: z
          .object({
            src: image(),
            alt: z.string(),
          })
          .optional(),
      }),
  }),
};
