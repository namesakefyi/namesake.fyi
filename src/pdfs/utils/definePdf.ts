import type { PDFDefinition } from "@/constants/pdf";

/**
 * Define a PDF form.
 * @param pdf - The PDF definition. Pass a type parameter for typed field names, e.g. definePdf<PdfFieldName>({...})
 * @returns A PDF definition.
 */
export function definePdf<TPdfFieldName extends string = string>(
  pdf: PDFDefinition<TPdfFieldName>,
): PDFDefinition<TPdfFieldName> {
  return pdf;
}
