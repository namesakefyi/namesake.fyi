import { config, fields, collection } from "@keystatic/core";

export default config({
  ui: {
    brand: { name: "Namesake" },
  },
  storage: {
    kind: "local",
  },
  collections: {
    authors: collection({
      label: "Authors",
      slugField: "name",
      path: "src/content/authors/*",
      columns: ["name", "title"],
      format: { contentField: "content" },
      schema: {
        name: fields.slug({
          name: { label: "Name", validation: { isRequired: true } },
        }),
        title: fields.text({ label: "Title" }),
        avatar: fields.image({
          label: "Avatar",
          directory: "src/content/authors/_images",
        }),
        content: fields.markdoc({ label: "Content" }),
      },
    }),
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "src/content/posts/*",
      columns: ["title", "publishDate", "isDraft"],
      entryLayout: "content",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        isDraft: fields.checkbox({
          label: "Is draft?",
          description: "Prevent this post from being published publicly.",
        }),
        publishDate: fields.date({
          label: "Publish Date",
          validation: { isRequired: true },
        }),
        authors: fields.array(
          fields.relationship({
            label: "Authors",
            collection: "authors",
            validation: { isRequired: true },
          }),
          {
            label: "Authors",
            itemLabel: (props) => props.value as string,
          }
        ),
        content: fields.markdoc({ label: "Content" }),
      },
    }),
  },
});
