import { defineCollection, reference, z } from "astro:content";
import {
  createMarkdownProcessor,
  type MarkdownProcessor,
} from "@astrojs/markdown-remark";
import { glob } from "astro/loaders";
import { githubFileLoader } from "astro-github-file-loader";
import type { RoughAnnotationType } from "rough-notation/lib/model";
import type { NamesakeColor } from "~/data/colors";

/**
 * To not create a processor for each file in the
 * policy repo, we "cache" it here in a let
 */
let processor: MarkdownProcessor;

export const collections = {
  authors: defineCollection({
    loader: glob({ pattern: "**/[^_]*.yaml", base: "./src/content/authors" }),
    schema: ({ image }) =>
      z.object({
        name: z.string(),
        role: z.string(),
        bio: z.string(),
        avatar: image(),
        socialLinks: z
          .object({
            name: z.string(),
            url: z.string().url(),
          })
          .array()
          .optional(),
      }),
  }),

  pages: defineCollection({
    loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/pages" }),
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
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" }),
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z.string().min(70).max(160),
        publishDate: z
          .string()
          .or(z.date())
          .transform((v) => new Date(v)),
        annotation: z.custom<RoughAnnotationType>().optional(),
        authors: z.array(reference("authors")),
        image: image().optional(),
        imageAlt: z.string().optional(),
      }),
  }),

  partners: defineCollection({
    loader: glob({ pattern: "**/[^_]*.yaml", base: "./src/content/partners" }),
    schema: ({ image }) =>
      z.object({
        name: z.string(),
        logo: image(),
        url: z.string(),
        height: z.number(),
      }),
  }),

  press: defineCollection({
    loader: glob({ pattern: "**/[^_]*.yaml", base: "./src/content/press" }),
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

  policy: defineCollection({
    loader: githubFileLoader({
      username: "namesakefyi",
      repo: "policies",
      processors: {
        md: async (text, config) => {
          processor ??= await createMarkdownProcessor(config.markdown);
          const textWithoutH1 = text.replace(/^# .*\n/gm, "");
          const { code: html, metadata } =
            await processor.render(textWithoutH1);
          return {
            html,
            metadata,
          };
        },
      },
    }),
  }),
};
