/** Auto-generated from ds5505-application-for-us-passport-with-correction.pdf — do not edit */
import type { PDFCheckBox } from "@cantoo/pdf-lib";

export const pdfSchema = {} as const;

export type PdfFieldName = keyof typeof pdfSchema;

export type PdfFieldValueType<T extends PdfFieldName> =
  (typeof pdfSchema)[T] extends typeof PDFCheckBox ? boolean : string;
