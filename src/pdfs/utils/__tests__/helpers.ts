import { definePdf } from "../definePdf";

/**
 * Shared test PDF definition used across multiple test files
 */
export const testPdfDefinition = definePdf({
  id: "test-form" as any,
  title: "Test Form",
  jurisdiction: "MA",
  pdfPath: "public/forms/test-form.pdf",
  resolver: {
    newFirstName: (data) => data.newFirstName,
    oldFirstName: (data) => data.oldFirstName,
    shouldReturnOriginalDocuments: (data) => data.shouldReturnOriginalDocuments,
  },
});
