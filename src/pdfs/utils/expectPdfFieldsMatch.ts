import {
  PDFCheckBox,
  PDFDropdown,
  PDFRadioGroup,
  PDFTextField,
} from "@cantoo/pdf-lib";
import { expect } from "vitest";
import type { FormData } from "@/constants/fields";
import type { PDFDefinition } from "@/constants/pdf";
import { getPdfForm } from "./getPdfForm";

/**
 * Assert that all form data values are correctly written to the PDF fields.
 */
export async function expectPdfFieldsMatch(
  pdf: PDFDefinition,
  userData: Partial<FormData>,
): Promise<void> {
  const form = await getPdfForm({ pdf, userData });
  const expected = pdf.resolver(userData);

  for (const [fieldName, value] of Object.entries(expected)) {
    if (value === undefined) continue;

    const field = form.getField(fieldName);

    if (field instanceof PDFCheckBox) {
      const boolValue = typeof value === "boolean" ? value : value === "true";
      expect(field.isChecked()).toBe(boolValue);
    } else if (field instanceof PDFTextField) {
      expect(field.getText()).toBe(String(value));
    } else if (field instanceof PDFRadioGroup) {
      expect(field.getSelected()).toBe(String(value));
    } else if (field instanceof PDFDropdown) {
      expect(field.getSelected()).toEqual([String(value)]);
    }
  }
}
