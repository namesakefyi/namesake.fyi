import { ImageIcon } from "@sanity/icons";

export const imageBlock = {
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    {
      name: "alt",
      type: "string",
      title: "Alt Text",
    },
  ],
};
