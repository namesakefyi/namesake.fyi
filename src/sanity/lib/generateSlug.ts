/**
 * Given text (a heading or title), generate a slug
 * @example
 * generateSlug("What we've accomplished so far") // "what-weve-accomplished-so-far"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
}
