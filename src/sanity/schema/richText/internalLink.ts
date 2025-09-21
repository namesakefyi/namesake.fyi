import { DocumentTextIcon } from "@sanity/icons";
import type { BlockAnnotationDefinition } from "@sanity/types";

export const internalLink: BlockAnnotationDefinition = {
  name: "internalLink",
  type: "object",
  title: "Internal link",
  icon: DocumentTextIcon,
  fields: [
    {
      name: "reference",
      type: "reference",
      title: "Reference",
      to: [{ type: "post" }, { type: "page" }],
      validation: (Rule) => Rule.required(),
    },
  ],
};
