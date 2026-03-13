import { getFormConfig } from "@/constants/forms";
import type { PDFId } from "@/constants/pdf";
import { getPdfDefinition } from "@/pdfs";
import { getPdfId, getPdfWhen } from "./formVisibility";

/**
 * Metadata for a PDF form that includes display information.
 */
export interface FormPdfMetadata {
  /** The unique PDF identifier */
  id: PDFId;
  /** The display title of the PDF */
  title: string;
  /** The form code, if one exists (e.g., "CJP-27") */
  code?: string;
  /** Whether this PDF has a when rule (conditionally included based on form data) */
  when?: boolean;
}

/**
 * Get PDF metadata for a form to display on the forms index page.
 *
 * @param formSlug - The form slug identifier
 * @returns Array of PDF metadata including title, code, and whether it has a when rule
 */
export async function getFormPdfMetadata(
  formSlug: string,
): Promise<FormPdfMetadata[]> {
  const config = getFormConfig(formSlug);
  if (!config) return [];

  return await Promise.all(
    config.pdfs.map(async (entry) => {
      const id = getPdfId(entry);
      const definition = await getPdfDefinition(id);
      return {
        id,
        title: definition.title,
        code: definition.code,
        when: !!getPdfWhen(entry),
      };
    }),
  );
}
