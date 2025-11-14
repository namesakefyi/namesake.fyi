import { HelpCircleIcon } from "@sanity/icons";
import { defineArrayMember, type ObjectDefinition } from "sanity";
import { externalLink } from "../annotations/externalLink";
import { internalLink } from "../annotations/internalLink";

export const faqBlock: ObjectDefinition = {
  type: "object",
  name: "faq",
  title: "FAQ",
  icon: HelpCircleIcon,
  fields: [
    {
      name: "question",
      type: "string",
    },
    {
      name: "answer",
      title: "Quote",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [{ title: "Bold", value: "strong" }],
            annotations: [
              defineArrayMember(externalLink),
              defineArrayMember(internalLink),
            ],
          },
        }),
      ],
    },
  ],
};
