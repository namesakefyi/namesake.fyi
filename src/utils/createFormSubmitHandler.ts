import type { FormEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { resolveVisibleFields } from "@/components/react/forms/FormContainer/resolveVisibleFields";
import type { FormData } from "@/constants/fields";
import type { FormConfig } from "@/constants/forms";
import { downloadMergedPdf } from "@/pdfs/utils/downloadMergedPdf";
import { loadPdfs } from "@/pdfs/utils/loadPdfs";

/**
 * Creates a form submit handler from a form configuration.
 *
 * @param config - The form configuration
 * @param form - The react-hook-form instance
 * @param onSubmit - Optional callback to run after successful PDF generation
 * @returns A submit handler function
 */
export function createFormSubmitHandler<TFormData extends FormData>(
  config: FormConfig,
  form: UseFormReturn<TFormData>,
  onSubmit?: () => Promise<void>,
) {
  return async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = form.getValues();

    // Resolve conditional PDFs using include predicates
    const pdfConfigs = config.pdfs.map((pdf) => ({
      pdfId: pdf.pdfId,
      include: pdf.include ? pdf.include(formData) : true,
    }));

    const pdfs = await loadPdfs(pdfConfigs);
    const visibleData = resolveVisibleFields(config.steps, formData);

    // Resolve instructions (static or dynamic)
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

    await onSubmit?.();
  };
}
