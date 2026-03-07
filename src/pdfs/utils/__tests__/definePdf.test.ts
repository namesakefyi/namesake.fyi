import { describe, expect, it } from "vitest";
import { definePdf } from "../definePdf";

describe("definePdf", () => {
  it("should create valid PDF definition", () => {
    const definition = definePdf({
      id: "test-form" as any,
      title: "Test Form",
      jurisdiction: "MA",
      pdfPath: "public/forms/test-form.pdf",
      fieldValueResolvers: {
        newFirstName: (data) => data.newFirstName,
        oldFirstName: (data) => data.oldFirstName,
        shouldReturnOriginalDocuments: (data) =>
          data.shouldReturnOriginalDocuments,
      },
    });

    expect(definition).toMatchObject({
      id: "test-form",
      pdfPath: "public/forms/test-form.pdf",
      fieldValueResolvers: expect.any(Object),
    });
    expect(definition.fieldValueResolvers).toHaveProperty("newFirstName");
    expect(typeof definition.fieldValueResolvers.newFirstName).toBe("function");
  });
});
