import { glob } from "astro/loaders";
import { z, defineCollection, reference } from "astro:content";
import type { Loader, LoaderContext } from "astro/loaders";
import type { RoughAnnotationType } from "rough-notation/lib/model";
import type { NamesakeColor } from "~/data/colors";
import { marked } from "marked";
import type { MarkdownHeading } from "astro";

type GithubTreeLeaf = {
  path: string;
  mode: string;
  type: "tree" | "blob"; // tree is a directory, blob is a file
  sha: string;
  url: string;
};

type GithubTreeData = {
  url: string;
  hash: string;
  tree: GithubTreeLeaf[];
};

function policyLoader(): Loader {
  const gitTreeUrl =
    "https://api.github.com/repos/namesakefyi/policies/git/trees/main?recursive=1";
  const url = "https://raw.githubusercontent.com/namesakefyi/policies/main/";

  const get = async <T>(url: string, type: "json" | "text"): Promise<T> => {
    const result = await fetch(url);
    const json = await result[type]();
    return json;
  };

  const generateHeadingsFromText = (text: string): MarkdownHeading[] => {
    // see...[https://regex101.com/r/n6XQub/4] & https://stackoverflow.com/questions/70801756/regex-extract-all-headers-from-markdown-string
    const regXHeader = /(?<flag>#{1,6})\s+(?<content>.+)/g;

    const headings = Array.from(
      text.matchAll(regXHeader),
      ({ groups }) =>
        groups !== undefined && {
          depth: groups.flag.length,
          slug: groups.content
            .toLowerCase()
            .replaceAll(/\s/g, "_")
            .replaceAll(/\,\.\(\)\[\]\+\?\!\'\"/g, ""),
          text: groups.content,
        },
    ).filter(Boolean) as MarkdownHeading[];

    return headings;
  };

  return {
    name: "policy-loader",
    load: async (context: LoaderContext) => {
      const { tree } = await get<GithubTreeData>(gitTreeUrl, "json");

      for await (const leaf of tree) {
        // Can't do anything with a directory
        if (leaf.type === "tree") continue;
        const text = await get<string>(url + leaf.path, "text");
        const digest = context.generateDigest(text);

        const [id, extension] = leaf.path.split(".");
        context.store.set({
          id,
          // Need to pass an empty object to appease the typescript gods
          data: {},
          body: text,
          rendered: {
            html: await marked.parse(text.replace(/^# .*\n/gm, "")),
            metadata: {
              headings: generateHeadingsFromText(text),
            },
          },
          digest,
        });
      }
    },
  };
}

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
    loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/posts" }),
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
    loader: policyLoader(),
  }),
};
