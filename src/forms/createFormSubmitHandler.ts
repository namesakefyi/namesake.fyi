import type { SubmitEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { resolveVisibleFields } from "@/components/react/forms/FormContainer/resolveVisibleFields";
import type { FormData } from "@/constants/fields";
import type { FormConfig } from "@/constants/forms";

/**
 * Creates a form submit handler from a form configuration.
 * PDF lib and utilities are loaded on demand when the user clicks download.
 *
 * @param config - The form configuration
 * @param form - The react-hook-form instance
 * @returns A submit handler function
 */
export function createFormSubmitHandler<TFormData extends FormData>(
  config: FormConfig,
  form: UseFormReturn<TFormData>,
) {
  return async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = form.getValues();

    const pdfConfigs = config.pdfs.map((pdf) => ({
      pdfId: pdf.pdfId,
      include: pdf.include ? pdf.include(formData) : true,
    }));

    const [{ loadPdfs }, { downloadMergedPdf }] = await Promise.all([
      import("@/pdfs/utils/loadPdfs"),
      import("@/pdfs/utils/downloadMergedPdf"),
    ]);

    const pdfs = await loadPdfs(pdfConfigs);
    const visibleData = resolveVisibleFields(config.steps, formData);

    const instructions =
      typeof config.instructions === "function"
        ? config.instructions(formData)
        : config.instructions;

    await downloadMergedPdf({
      title: config.downloadTitle,
      instructions,
      pdfs,
      userData: visibleData,
    });
  };
}
