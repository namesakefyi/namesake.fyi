import { definePdf } from "../definePdf";

/**
 * Shared test PDF definition used across multiple test files
 */
export const testPdfDefinition = definePdf({
  id: "test-form" as any,
  title: "Test Form",
  jurisdiction: "MA",
  pdfPath: "public/forms/test-form.pdf",
  fields: (data) => ({
    newFirstName: data.newFirstName,
    oldFirstName: data.oldFirstName,
    shouldReturnOriginalDocuments: data.shouldReturnOriginalDocuments,
  }),
});
