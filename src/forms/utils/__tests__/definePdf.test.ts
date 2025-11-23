import { describe, expect, it } from "vitest";
import { definePdf } from "../definePdf";

describe("definePdf", () => {
  it("should create valid PDF definition", () => {
    const definition = definePdf({
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

    expect(definition).toMatchObject({
      id: "test-form",
      pdfPath: "public/forms/test-form.pdf",
      fields: expect.any(Function),
    });
    expect(typeof definition.fields).toBe("function");
  });
});

