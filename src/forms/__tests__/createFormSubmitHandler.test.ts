import type { SubmitEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveVisibleFields } from "@/components/react/forms/FormContainer/resolveVisibleFields";
import type { FormData } from "@/constants/fields";
import type { FormConfig } from "@/constants/forms";
import { downloadMergedPdf } from "@/pdfs/utils/downloadMergedPdf";
import { loadPdfs } from "@/pdfs/utils/loadPdfs";
import { createFormSubmitHandler } from "../createFormSubmitHandler";

vi.mock("@/components/react/forms/FormContainer/resolveVisibleFields", () => ({
  resolveVisibleFields: vi.fn(),
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
    pdfs: [{ pdfId: "cjp27-petition-to-change-name-of-adult" }],
    downloadTitle: "Court Order MA",
    instructions: ["Step 1", "Step 2"],
    ...overrides,
  } as unknown as FormConfig;
}

describe("createFormSubmitHandler", () => {
  beforeEach(() => {
    vi.mocked(loadPdfs).mockResolvedValue(mockPdfs as never);
    vi.mocked(resolveVisibleFields).mockReturnValue(mockVisibleData);
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

  it("passes PDF configs with resolved include predicates to loadPdfs", async () => {
    const config = makeConfig({
      pdfs: [
        { pdfId: "cjp27-petition-to-change-name-of-adult" },
        { pdfId: "affidavit-of-indigency", include: () => true },
        { pdfId: "cjd400-motion-to-waive-publication", include: () => false },
      ],
    } as never);

    await createFormSubmitHandler(config, makeForm())(makeEvent());

    expect(loadPdfs).toHaveBeenCalledWith([
      { pdfId: "cjp27-petition-to-change-name-of-adult", include: true },
      { pdfId: "affidavit-of-indigency", include: true },
      { pdfId: "cjd400-motion-to-waive-publication", include: false },
    ]);
  });

  it("evaluates include predicates with the current form data", async () => {
    const include = vi.fn().mockReturnValue(true);
    const config = makeConfig({
      pdfs: [{ pdfId: "affidavit-of-indigency", include }],
    } as never);

    await createFormSubmitHandler(config, makeForm())(makeEvent());

    expect(include).toHaveBeenCalledWith(mockFormData);
  });

  it("calls resolveVisibleFields with config steps and form data", async () => {
    const config = makeConfig();

    await createFormSubmitHandler(config, makeForm())(makeEvent());

    expect(resolveVisibleFields).toHaveBeenCalledWith(
      config.steps,
      mockFormData,
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
