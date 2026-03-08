/** Auto-generated from cjp34-cori-and-wms-release-request.pdf — do not edit */
import { PDFCheckBox, PDFTextField } from "@cantoo/pdf-lib";

export const pdfSchema = {
  county: PDFTextField,
  isChangeOfNameProceeding: PDFCheckBox,
  oldName: PDFTextField,
  dateOfBirth: PDFTextField,
  mothersMaidenName: PDFTextField,
  otherNamesOrAliases: PDFTextField,
  ssnLastFour: PDFTextField,
  caseName: PDFTextField,
} as const;

export type PdfFieldName = keyof typeof pdfSchema;

export type PdfFieldValueType<T extends PdfFieldName> =
  (typeof pdfSchema)[T] extends typeof PDFCheckBox ? boolean : string;
