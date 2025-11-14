import { NumberIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import {
  blockquoteBlock,
  breakBlock,
  faqBlock,
  imageBlock,
  richTextBlock,
  youtubeBlock,
} from "./blocks";

export const guideType = defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  icon: NumberIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Title of the guide (e.g. 'Court Order')",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "state",
      title: "State",
      type: "reference",
      to: [{ type: "state" }],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "The URL path for this guide (e.g., 'court-order' for /court-order)",
      validation: (Rule) => Rule.required(),
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        defineArrayMember(blockquoteBlock),
        defineArrayMember(breakBlock),
        defineArrayMember(faqBlock),
        defineArrayMember(richTextBlock),
        defineArrayMember(imageBlock),
        defineArrayMember(youtubeBlock),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
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
