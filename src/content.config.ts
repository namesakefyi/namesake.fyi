import { defineCollection } from "astro:content";
import {
  createMarkdownProcessor,
  type MarkdownProcessor,
} from "@astrojs/markdown-remark";
import { githubFileLoader } from "astro-github-file-loader";

/**
 * To not create a processor for each file in the
 * policy repo, we "cache" it here in a let
 */
let processor: MarkdownProcessor;

export const collections = {
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
