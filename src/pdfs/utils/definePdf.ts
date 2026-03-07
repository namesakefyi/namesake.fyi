import type { FormData } from "@/constants/fields";
import type { PDFDefinition, PDFFieldValueResolvers } from "@/constants/pdf";

/**
 * Define a PDF form.
 * Use fieldValueResolvers—an object mapping field names to value functions. Object literal
 * keys are strictly checked, so typos cause type errors.
 *
 * @example
 * ```ts
 * definePdf<PdfFieldName>({
 *   id: "cjd400-motion-to-waive-publication",
 *   fieldValueResolvers: {
 *     division: (data) => data.residenceCounty,
 *     petitionerName: (data) => joinNames(...),
 *   },
 * })
 * ```
 */
export function definePdf<TPdfFieldName extends string = string>(
  pdf: Omit<PDFDefinition<TPdfFieldName>, "fields"> & {
    fieldValueResolvers: PDFFieldValueResolvers<TPdfFieldName>;
  },
): PDFDefinition<TPdfFieldName> {
  const { fieldValueResolvers, ...rest } = pdf;
  return {
    ...rest,
    fields: (data) => {
      const result: Partial<Record<TPdfFieldName, string | boolean | undefined>> =
        {};
      for (const [key, fn] of Object.entries(fieldValueResolvers)) {
        if (typeof fn === "function") {
          const value = fn(data);
          if (value !== undefined) result[key as TPdfFieldName] = value;
        }
      }
      return result;
    },
  };
}
