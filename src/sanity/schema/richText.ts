import type { TitledListValue } from "@sanity/types";
import { externalLink } from "./richText/externalLink";
import { internalLink } from "./richText/internalLink";

// Basic block configuration for simple rich text
export const richTextBlock = {
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "H1", value: "h1" },
    { title: "H2", value: "h2" },
    { title: "H3", value: "h3" },
    { title: "H4", value: "h4" },
  ],
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Numbered", value: "number" },
  ],
  marks: {
    decorators: [{ title: "Bold", value: "strong" }],
    annotations: [externalLink, internalLink],
  },
};

export const annotationOptions: TitledListValue<string>[] = [
  { title: "Highlight", value: "highlight" },
  { title: "Underline", value: "underline" },
  { title: "Strike-through", value: "strike-through" },
  { title: "Bracket", value: "bracket" },
  { title: "Circle", value: "circle" },
  { title: "Box", value: "box" },
  { title: "Crossed-off", value: "crossed-off" },
];

export const colorOptions: TitledListValue<string>[] = [
  { title: "Purple", value: "purple" },
  { title: "Blue", value: "blue" },
  { title: "Green", value: "green" },
  { title: "Yellow", value: "yellow" },
  { title: "Pink", value: "pink" },
  { title: "Brown", value: "brown" },
];
