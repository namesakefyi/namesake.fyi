import { RiArticleLine } from "@remixicon/react";
import { defineArrayMember, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: RiArticleLine,
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(70).max(160),
    },
    {
      name: "publishDate",
      title: "Publish Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "annotation",
      title: "Annotation",
      type: "string",
      description: "Rough annotation type for highlighting the title",
      options: {
        list: [
          { title: "Highlight", value: "highlight" },
          { title: "Underline", value: "underline" },
          { title: "Strike-through", value: "strike-through" },
          { title: "Bracket", value: "bracket" },
          { title: "Circle", value: "circle" },
          { title: "Box", value: "box" },
          { title: "Crossed-off", value: "crossed-off" },
        ],
      },
    },
    {
      name: "authors",
      title: "Authors",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "author" }],
        }),
      ],
    },
    {
      name: "image",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
        },
      ],
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [{ title: "Bold", value: "strong" }],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
            },
          ],
        }),
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "authors.0.name",
      media: "image",
      date: "publishDate",
    },
    prepare(selection) {
      const { title, author, date } = selection;
      const formattedDate = date
        ? new Date(date).toLocaleDateString()
        : "No date";
      const authorName = author || "No author";

      return {
        title: title,
        subtitle: `${authorName} · ${formattedDate}`,
        media: selection.media,
      };
    },
  },
  orderings: [
    {
      title: "Publish Date, New",
      name: "publishDateDesc",
      by: [{ field: "publishDate", direction: "desc" }],
    },
    {
      title: "Publish Date, Old",
      name: "publishDateAsc",
      by: [{ field: "publishDate", direction: "asc" }],
    },
    {
      title: "Title, A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
