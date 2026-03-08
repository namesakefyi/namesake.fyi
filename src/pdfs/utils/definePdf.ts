import type { PDFDefinition } from "@/constants/pdf";

/**
 * Define a PDF form.
 * Use resolver—an object mapping field names to value functions. Object literal
 * keys are strictly checked, so typos will cause type errors.
 *
 * @example
 * ```ts
 * definePdf<PdfFieldName>({
 *   id: "cjd400-motion-to-waive-publication",
 *   resolver: {
 *     division: (data) => data.residenceCounty,
 *     petitionerName: (data) => joinNames(...),
 *   },
 * })
 * ```
 */
export function definePdf<TPdfFieldName extends string = string>(
  pdf: PDFDefinition<TPdfFieldName>,
): PDFDefinition<TPdfFieldName> {
  return pdf;
}
