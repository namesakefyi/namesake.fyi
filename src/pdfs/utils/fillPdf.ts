import {
  PDFCheckBox,
  PDFDropdown,
  PDFRadioGroup,
  PDFTextField,
} from "@cantoo/pdf-lib";
import type { FormData } from "@/constants/fields";
import type { PDFDefinition } from "@/constants/pdf";
import { fetchPdf } from "./fetchPdf";
import { loadPdfLib } from "./loadPdfLib";

/**
 * Fill out a PDF form with the given user data.
 * @returns PDF bytes for the filled form.
 */
export async function fillPdf({
  pdf,
  userData,
}: {
  pdf: PDFDefinition;
  userData: Partial<FormData>;
}): Promise<Uint8Array> {
  try {
    const { PDFDocument } = await loadPdfLib();

    // Fetch the PDF with form fields
    const formPdfBytes = await fetchPdf(pdf.pdfPath);

    // Load a PDF with form fields
    const pdfDoc = await PDFDocument.load(formPdfBytes);

    // Set the title
    pdfDoc.setTitle(pdf.title);
    pdfDoc.setAuthor("Filled by Namesake Collaborative");

    // Get the form containing all the fields
    const form = pdfDoc.getForm();

    // Fill out each field from the resolver
    const fields = pdf.resolver(userData);
    for (const [fieldName, value] of Object.entries(fields)) {
      if (value === undefined) continue;

      const field = form.getField(fieldName);

      if (field instanceof PDFCheckBox) {
        const boolValue = typeof value === "boolean" ? value : value === "true";
        boolValue ? field.check() : field.uncheck();
      } else if (field instanceof PDFTextField) {
        field.setText(String(value));
      } else if (field instanceof PDFRadioGroup) {
        field.select(String(value));
      } else if (field instanceof PDFDropdown) {
        field.select(String(value));
      }
    }

    // Serialize the PDFDocument to bytes
    return await pdfDoc.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
