import type { PDFDefinition } from "@/constants/pdf";

/**
 * Define a PDF form.
 *
 * @example
 * ```ts
 * definePdf<PdfFieldName>({
 *   id: "cjd400-motion-to-waive-publication",
 *   title: "Motion to Waive Publication",
 *   jurisdiction: "MA",
 *   pdfPath: pdf,
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
