import { EarthAmericasIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const stateType = defineType({
  name: "state",
  title: "State",
  type: "document",
  icon: EarthAmericasIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "The two-letter code for the state, lowercase.",
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          if (!slug?.current) return true;
          const current = slug.current;
          if (current !== current.toLowerCase()) {
            return "Slug must be lowercase";
          }
          return true;
        }),
      options: {
        source: "name",
        maxLength: 2,
      },
    }),
    defineField({
      name: "namesakeSupport",
      title: "Namesake support?",
      type: "string",
      options: {
        list: [
          { title: "Full", value: "full" },
          { title: "Prioritized", value: "prioritized" },
          { title: "None", value: "none" },
        ],
      },
      initialValue: "none",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "slug.current",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title,
        subtitle: subtitle ? `${subtitle.toUpperCase()}` : "No slug",
      };
    },
  },
});
