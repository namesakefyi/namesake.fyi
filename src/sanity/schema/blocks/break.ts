import { RemoveIcon } from "@sanity/icons";
import type { ObjectDefinition } from "sanity";

export const breakBlock: ObjectDefinition = {
  type: "object",
  name: "break",
  title: "Break",
  icon: RemoveIcon,
  fields: [
    {
      name: "placeholder",
      type: "string",
      title: "Placeholder",
      hidden: true,
      initialValue: "lineBreak",
    },
  ],
  preview: {
    prepare() {
      return {
        title: "---",
        subtitle: "Line Break",
      };
    },
  },
};
