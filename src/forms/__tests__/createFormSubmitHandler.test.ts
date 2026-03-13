import type { SubmitEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FormData } from "@/constants/fields";
import type { FormConfig } from "@/constants/forms";
import { downloadMergedPdf } from "@/pdfs/utils/downloadMergedPdf";
import { loadPdfs } from "@/pdfs/utils/loadPdfs";
import { createFormSubmitHandler } from "../createFormSubmitHandler";
import { resolveFormVisibility } from "../formVisibility";

vi.mock("../formVisibility", () => ({
  resolveFormVisibility: vi.fn(),
}));
vi.mock("@/pdfs/utils/downloadMergedPdf", () => ({
  downloadMergedPdf: vi.fn(),
}));
vi.mock("@/pdfs/utils/loadPdfs", () => ({ loadPdfs: vi.fn() }));

const mockFormData = { oldFirstName: "Jane" } as unknown as FormData;
const mockPdfs = [{ id: "cjp27-petition-to-change-name-of-adult" }];
const mockVisibleData = { oldFirstName: "Jane" };

function makeForm(data = mockFormData) {
  return {
    getValues: vi.fn().mockReturnValue(data),
  } as unknown as UseFormReturn<FormData>;
}

function makeEvent() {
  return {
    preventDefault: vi.fn(),
  } as unknown as SubmitEvent<HTMLFormElement>;
}

function makeConfig(overrides: Partial<FormConfig> = {}): FormConfig {
  return {
    slug: "court-order-ma",
    steps: [{ fields: ["oldFirstName"] }],
    fields: ["oldFirstName"],
    pdfs: ["cjp27-petition-to-change-name-of-adult"],
    downloadTitle: "Court Order MA",
    instructions: ["Step 1", "Step 2"],
    ...overrides,
  } as unknown as FormConfig;
}

describe("createFormSubmitHandler", () => {
  beforeEach(() => {
    vi.mocked(loadPdfs).mockResolvedValue(mockPdfs as never);
    vi.mocked(resolveFormVisibility).mockReturnValue({
      visibleStepIds: [],
      visibleFields: mockVisibleData,
      sections: [],
      pdfsToInclude: ["cjp27-petition-to-change-name-of-adult"],
    });
    vi.mocked(downloadMergedPdf).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("prevents the default form submission", async () => {
    const event = makeEvent();
    const handler = createFormSubmitHandler(makeConfig(), makeForm());

    await handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("passes pdfsToInclude from resolver to loadPdfs", async () => {
    const config = makeConfig({
      pdfs: [
        "cjp27-petition-to-change-name-of-adult",
        {
          id: "affidavit-of-indigency",
          when: { field: "shouldApplyForFeeWaiver", equals: true },
        },
        { id: "cjp25-petition-to-change-name-of-minor", when: { or: [] } },
      ],
    } as never);

    vi.mocked(resolveFormVisibility).mockReturnValue({
      visibleStepIds: [],
      visibleFields: mockVisibleData,
      sections: [],
      pdfsToInclude: [
        "cjp27-petition-to-change-name-of-adult",
        "affidavit-of-indigency",
        { id: "cjp25-petition-to-change-name-of-minor", when: false },
      ],
    });

    await createFormSubmitHandler(config, makeForm())(makeEvent());

    expect(loadPdfs).toHaveBeenCalledWith([
      "cjp27-petition-to-change-name-of-adult",
      "affidavit-of-indigency",
      { id: "cjp25-petition-to-change-name-of-minor", when: false },
    ]);
  });

  it("calls resolveFormVisibility with config steps, form data, and pdfs", async () => {
    const config = makeConfig();

    await createFormSubmitHandler(config, makeForm())(makeEvent());

    expect(resolveFormVisibility).toHaveBeenCalledWith(
      config.steps,
      mockFormData,
      config.pdfs,
    );
  });

  it("passes static instructions directly to downloadMergedPdf", async () => {
    const config = makeConfig({ instructions: ["Do this", "Do that"] });

    await createFormSubmitHandler(config, makeForm())(makeEvent());

    expect(downloadMergedPdf).toHaveBeenCalledWith(
      expect.objectContaining({ instructions: ["Do this", "Do that"] }),
    );
  });

  it("calls instruction function with form data and passes result to downloadMergedPdf", async () => {
    const instructions = vi.fn().mockReturnValue(["Dynamic step"]);
    const config = makeConfig({ instructions });

    await createFormSubmitHandler(config, makeForm())(makeEvent());

    expect(instructions).toHaveBeenCalledWith(mockFormData);
    expect(downloadMergedPdf).toHaveBeenCalledWith(
      expect.objectContaining({ instructions: ["Dynamic step"] }),
    );
  });

  it("passes the download title, loaded PDFs, and visible data to downloadMergedPdf", async () => {
    const config = makeConfig({ downloadTitle: "My Package" });

    await createFormSubmitHandler(config, makeForm())(makeEvent());

    expect(downloadMergedPdf).toHaveBeenCalledWith({
      title: "My Package",
      instructions: ["Step 1", "Step 2"],
      pdfs: mockPdfs,
      userData: mockVisibleData,
    });
  });
});
