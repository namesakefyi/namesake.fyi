import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    authors: collection({
      label: "Authors",
      slugField: "name",
      columns: ["name", "role", "bio"],
      path: "src/content/authors/*",
      schema: {
        name: fields.slug({
          name: { label: "Name", validation: { isRequired: true } },
        }),
        role: fields.text({
          label: "Role",
          validation: { isRequired: true },
        }),
        bio: fields.text({
          label: "Bio",
          multiline: true,
          validation: { isRequired: true },
        }),
        avatar: fields.image({
          label: "Avatar",
          directory: "src/assets/images/authors",
        }),
        socialLinks: fields.array(
          fields.object({
            name: fields.select({
              label: "Name",
              options: [
                { label: "Bluesky", value: "Bluesky" },
                { label: "GitHub", value: "GitHub" },
                { label: "Instagram", value: "Instagram" },
                { label: "LinkedIn", value: "LinkedIn" },
                { label: "Website", value: "Website" },
              ],
              defaultValue: "Website",
            }),
            url: fields.url({ label: "URL" }),
          }),
          {
            label: "Social Links",
            itemLabel: (props) =>
              `${props.fields.name.value} (${props.fields.url.value})`,
          },
        ),
      },
    }),
    posts: collection({
      label: "Posts",
      slugField: "title",
      columns: ["title", "description", "publishDate"],
      path: "src/content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
        }),
        description: fields.text({
          label: "Description",
          multiline: true,
          validation: { isRequired: true, length: { min: 70, max: 160 } },
        }),
        publishDate: fields.date({
          label: "Publish Date",
          validation: { isRequired: true },
        }),
        authors: fields.array(
          fields.relationship({ label: "Authors", collection: "authors" }),
          {
            label: "Authors",
            itemLabel: (props) => props.value ?? "Unknown",
          },
        ),
        image: fields.object({
          src: fields.image({
            label: "Image",
            directory: "src/assets/images/posts",
          }),
          alt: fields.text({
            label: "Alt Text",
          }),
        }),
        content: fields.markdoc({ label: "Content" }),
      },
    }),
    press: collection({
      label: "Press",
      slugField: "title",
      columns: ["title", "date", "outlet"],
      path: "src/content/press/*",
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
        }),
        date: fields.date({
          label: "Date",
          validation: { isRequired: true },
        }),
        url: fields.url({
          label: "URL",
          validation: { isRequired: true },
        }),
        outlet: fields.text({
          label: "Outlet",
          validation: { isRequired: true },
        }),
        image: fields.object({
          src: fields.image({
            label: "Image",
            directory: "src/assets/images/press",
          }),
          alt: fields.text({
            label: "Alt Text",
          }),
        }),
      },
    }),
  },
  ui: {
    brand: { name: "Namesake" },
  },
});
