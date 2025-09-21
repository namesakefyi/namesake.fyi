import { LinkIcon } from "@sanity/icons";
import type { BlockAnnotationDefinition } from "@sanity/types";

export const externalLink: BlockAnnotationDefinition = {
  name: "link",
  type: "object",
  title: "External link",
  icon: LinkIcon,
  fields: [
    {
      name: "href",
      type: "url",
      title: "URL",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https", "mailto", "tel"],
        }).required(),
    },
    {
      title: "Open in new tab",
      name: "blank",
      type: "boolean",
      initialValue: false,
    },
  ],
};
