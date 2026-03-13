import type { PDFId } from "@/constants/pdf";
import { getPdfDefinition } from "@/pdfs";

/**
 * Load multiple PDFs.
 *
 * @param pdfs - Array of PDF configurations. Id alone = include; { id, when: false } = exclude.
 * @returns Promise that resolves to an array of PDF definitions
 *
 * @example
 * ```typescript
 * const pdfs = await loadPdfs([
 *   "always-included-pdf",
 *   { id: "conditional-pdf", when: false },
 * ]);
 * ```
 */
export async function loadPdfs(
  pdfs: readonly (PDFId | { id: PDFId; when?: boolean })[],
) {
  const ids = pdfs
    .filter((entry) =>
      typeof entry === "string" ? true : entry.when !== false,
    )
    .map((entry) => (typeof entry === "string" ? entry : entry.id));

  return await Promise.all(ids.map((id) => getPdfDefinition(id)));
}
