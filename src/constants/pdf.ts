import type { FormData } from "./fields";
import type { Jurisdiction } from "./jurisdictions";

export type PDFFieldValue = string | boolean | undefined;

export const PDF_IDS = [
  "affidavit-of-indigency",
  "cjp27-petition-to-change-name-of-adult",
  "cjp34-cori-and-wms-release-request",
  "cjd400-motion-to-waive-publication",
  "cjd400-motion-to-impound-records",
  "ss5-application-for-social-security-card",
] as const;

export type PDFId = (typeof PDF_IDS)[number];

export interface PDFDefinition<TPdfFieldName extends string = string> {
  /**
   * The unique identifier for the PDF definition.
   * @example "cjp27-petition-to-change-name-of-adult"
   * @url https://github.com/namesakefyi/namesake/tree/main/src/forms/README.md
   */
  id: PDFId;

  /**
   * The title of the form. Do not include the form code or state.
   * @example "Petition to Change Name of Adult"
   */
  title: string;

  /**
   * The form code, if one exists.
   * @optional
   * @example "CJP-27"
   */
  code?: string;

  /**
   * The jurisdiction of the form.
   * @example "MA"
   */
  jurisdiction?: Jurisdiction;

  /**
   * The path to the PDF file, imported as a module.
   */
  pdfPath: string;

  /**
   * Map of PDF field names to resolver functions return a printed value for the field.
   * @example
   * ```ts
   * resolver: {
   *   division: (data) => data.residenceCounty,
   *   petitionerName: (data) => joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
   * }
   * ```
   */
  resolver: PDFResolver<TPdfFieldName>;
}

export type PDFResolver<
  TPdfFieldName extends string,
  TFormData = Partial<FormData>,
> = Partial<Record<TPdfFieldName, (data: TFormData) => PDFFieldValue>>;
