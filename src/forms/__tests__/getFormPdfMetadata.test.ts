import { describe, expect, it, vi } from "vitest";
import * as forms from "@/constants/forms";
import * as pdfs from "@/pdfs";
import { getFormPdfMetadata } from "../getFormPdfMetadata";

vi.mock("@/constants/forms", () => ({
  getFormConfig: vi.fn(),
}));

vi.mock("@/pdfs", () => ({
  getPdfDefinition: vi.fn(),
}));

describe("getFormPdfMetadata", () => {
  it("returns an empty array when the form slug has no config", async () => {
    vi.mocked(forms.getFormConfig).mockReturnValue(undefined);

    const result = await getFormPdfMetadata("unknown-form" as never);

    expect(result).toEqual([]);
  });

  it("returns metadata for each PDF in the form config", async () => {
    vi.mocked(forms.getFormConfig).mockReturnValue({
      pdfs: ["cjp27-petition-to-change-name-of-adult"],
    } as never);

    vi.mocked(pdfs.getPdfDefinition).mockResolvedValue({
      id: "cjp27-petition-to-change-name-of-adult",
      title: "Petition to Change Name of Adult",
      code: "CJP-27",
    } as never);

    const result = await getFormPdfMetadata("court-order-ma");

    expect(result).toEqual([
      {
        id: "cjp27-petition-to-change-name-of-adult",
        title: "Petition to Change Name of Adult",
        code: "CJP-27",
        when: false,
      },
    ]);
  });

  it("sets when to false when a PDF has no when rule", async () => {
    vi.mocked(forms.getFormConfig).mockReturnValue({
      pdfs: ["affidavit-of-indigency"],
    } as never);

    vi.mocked(pdfs.getPdfDefinition).mockResolvedValue({
      id: "affidavit-of-indigency",
      title: "Affidavit of Indigency",
    } as never);

    const [metadata] = await getFormPdfMetadata("court-order-ma");

    expect(metadata.when).toBe(false);
  });

  it("sets when to true when a PDF has a when rule", async () => {
    vi.mocked(forms.getFormConfig).mockReturnValue({
      pdfs: [
        {
          id: "cjp25-petition-to-change-name-of-minor",
          when: { field: "shouldApplyForFeeWaiver", equals: true },
        },
      ],
    } as never);

    vi.mocked(pdfs.getPdfDefinition).mockResolvedValue({
      id: "cjp25-petition-to-change-name-of-minor",
      title: "Petition to Change Name of Minor",
      code: "CJP-25",
    } as never);

    const [metadata] = await getFormPdfMetadata("court-order-ma");

    expect(metadata.when).toBe(true);
  });

  it("omits code when the PDF definition has none", async () => {
    vi.mocked(forms.getFormConfig).mockReturnValue({
      pdfs: ["ss5-application-for-social-security-card"],
    } as never);

    vi.mocked(pdfs.getPdfDefinition).mockResolvedValue({
      id: "ss5-application-for-social-security-card",
      title: "Application for a Social Security Card",
    } as never);

    const [metadata] = await getFormPdfMetadata("social-security");

    expect(metadata.code).toBeUndefined();
  });

  it("returns metadata for all PDFs when a form has multiple", async () => {
    vi.mocked(forms.getFormConfig).mockReturnValue({
      pdfs: [
        "cjp27-petition-to-change-name-of-adult",
        {
          id: "affidavit-of-indigency",
          when: { field: "shouldApplyForFeeWaiver", equals: true },
        },
      ],
    } as never);

    vi.mocked(pdfs.getPdfDefinition)
      .mockResolvedValueOnce({
        id: "cjp27-petition-to-change-name-of-adult",
        title: "Petition to Change Name of Adult",
        code: "CJP-27",
      } as never)
      .mockResolvedValueOnce({
        id: "affidavit-of-indigency",
        title: "Affidavit of Indigency",
      } as never);

    const result = await getFormPdfMetadata("court-order-ma");

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("cjp27-petition-to-change-name-of-adult");
    expect(result[1].id).toBe("affidavit-of-indigency");
    expect(result[1].when).toBe(true);
  });
});
