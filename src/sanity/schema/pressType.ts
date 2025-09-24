import { RiNewspaperLine } from "@remixicon/react";
import { defineField, defineType } from "sanity";

export const pressType = defineType({
  name: "press",
  title: "Press",
  type: "document",
  icon: RiNewspaperLine,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Headline of the news article or press release",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "outlet",
      title: "Media Outlet",
      type: "string",
      description: "The name of the publication or media outlet",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Article URL",
      type: "url",
      description: "The direct link to the article",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Publication Date",
      type: "date",
      description: "The date when the article was published",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Featured Image",
      type: "image",
      description: "Optional image to accompany the press article",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      outlet: "outlet",
      date: "date",
      media: "image",
    },
    prepare(selection) {
      const { title, outlet, date } = selection;
      const formattedDate = date
        ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "No date";

      return {
        title: title,
        subtitle: `${outlet} · ${formattedDate}`,
        media: selection.media,
      };
    },
  },
  orderings: [
    {
      title: "Publication Date, New",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Publication Date, Old",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
    {
      title: "Outlet, A-Z",
      name: "outletAsc",
      by: [{ field: "outlet", direction: "asc" }],
    },
    {
      title: "Title, A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
