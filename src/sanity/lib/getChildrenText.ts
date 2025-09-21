import type { Block } from "astro-portabletext/types";

// Given a Sanity block, extract the text of its children
export function getChildrenText(block: Block): string {
  return (
    block.children
      ?.map((node) => (typeof node === "string" ? node : node.text || ""))
      .join("") || ""
  );
}
