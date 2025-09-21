import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import {
  annotationOptions,
  colorOptions,
  imageBlock,
  richTextBlock,
  youtubeBlock,
} from "./blocks";

export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentTextIcon,
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
        defineArrayMember(richTextBlock),
        defineArrayMember(imageBlock),
        defineArrayMember(youtubeBlock),
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
        list: annotationOptions,
      },
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      description: "The color for this page.",
      options: {
        list: colorOptions,
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
