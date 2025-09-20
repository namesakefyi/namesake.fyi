import { RiFileTextLine } from "@remixicon/react";
import { defineField, defineType } from "sanity";

export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: RiFileTextLine,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "The URL path for this page (e.g., 'about' for /about)",
      validation: (Rule) => Rule.required(),
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description:
        "A brief description of the page for SEO and social sharing.",
      rows: 3,
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      description: "The main content of the page.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Number", value: "number" },
          ],
          marks: {
            decorators: [{ title: "Bold", value: "strong" }],
            annotations: [
              {
                title: "URL",
                name: "link",
                type: "object",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt text",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "ogImage",
      title: "Social Media Image",
      type: "image",
      description: "Image used when sharing this page on social media.",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessibility.",
        },
      ],
    }),
    defineField({
      name: "annotation",
      title: "Title Annotation",
      type: "string",
      description: "The type of visual annotation to apply to the page title.",
      options: {
        list: [
          { title: "Highlight", value: "highlight" },
          { title: "Circle", value: "circle" },
          { title: "Box", value: "box" },
          { title: "Underline", value: "underline" },
          { title: "Strike-through", value: "strikethrough" },
          { title: "Crossed-off", value: "crossed-off" },
          { title: "Bracket", value: "bracket" },
        ],
      },
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      description: "The color for this page.",
      options: {
        list: [
          { title: "Purple", value: "purple" },
          { title: "Blue", value: "blue" },
          { title: "Green", value: "green" },
          { title: "Yellow", value: "yellow" },
          { title: "Pink", value: "pink" },
          { title: "Brown", value: "brown" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
      media: "ogImage",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title,
        subtitle: subtitle ? `/${subtitle}` : "No slug",
      };
    },
  },
});
