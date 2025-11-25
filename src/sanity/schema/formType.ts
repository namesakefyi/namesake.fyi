import { OlistIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { FORM_REGISTRY_METADATA } from "../../forms/formRegistry";

export const formType = defineType({
  name: "form",
  title: "Form",
  type: "document",
  icon: OlistIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Title of the form (e.g. 'Court Order: Massachusetts')",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description:
        "A brief, high-level summary of what role this form serves within the name change process.",
      type: "string",
    }),
    defineField({
      name: "componentId",
      title: "Form Component",
      description:
        "The React component that powers this form's interactive functionality",
      type: "string",
      options: {
        list: FORM_REGISTRY_METADATA.map(({ id, title }) => ({
          title,
          value: id,
        })),
      },
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
        "The URL path for this form (e.g., 'court-order-ma' for /forms/court-order-ma)",
      validation: (Rule) => Rule.required(),
      options: {
        source: "title",
        maxLength: 96,
      },
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
