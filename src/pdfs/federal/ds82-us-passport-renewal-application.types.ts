/** Auto-generated from ds82-us-passport-renewal-application.pdf — do not edit */
import { PDFCheckBox } from "@cantoo/pdf-lib";

export const pdfSchema = {} as const;

export type PdfFieldName = keyof typeof pdfSchema;

export type PdfFieldValueType<T extends PdfFieldName> =
  (typeof pdfSchema)[T] extends typeof PDFCheckBox ? boolean : string;
