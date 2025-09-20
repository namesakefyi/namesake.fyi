import { RiAccountCircleLine } from "@remixicon/react";
import { defineField, defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: RiAccountCircleLine,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "First and last name.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "E.g. 'Co-Founder, Namesake' or 'Designer, Acme Co.'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      description: "A short bio for the author.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      description: "A square profile picture of the author.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      description: "A list of social links for the author.",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Name", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
        },
      ],
    }),
  ],
});
