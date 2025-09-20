import { defineCollection, reference, z } from "astro:content";
import {
  createMarkdownProcessor,
  type MarkdownProcessor,
} from "@astrojs/markdown-remark";
import { glob } from "astro/loaders";
import { githubFileLoader } from "astro-github-file-loader";
import type { RoughAnnotationType } from "rough-notation/lib/model";

/**
 * To not create a processor for each file in the
 * policy repo, we "cache" it here in a let
 */
let processor: MarkdownProcessor;

export const collections = {
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
        authors: z.array(reference("authors")).optional(),
        image: image().optional(),
        imageAlt: z.string().optional(),
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
