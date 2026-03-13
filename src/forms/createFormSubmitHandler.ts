import type { SubmitEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "@/constants/fields";
import type { Form } from "@/constants/forms";
import { resolveFormVisibility } from "@/forms/formVisibility";
import { evaluateRule } from "@/forms/visibilityRules";

/**
 * Creates a form submit handler from a form.
 * PDF lib and utilities are loaded on demand when the user clicks download.
 *
 * @param config - The form
 * @param form - The react-hook-form instance
 * @returns A submit handler function
 */
export function createFormSubmitHandler<TFormData extends Partial<FormData>>(
  config: Form,
  form: UseFormReturn<TFormData>,
) {
  return async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = form.getValues();
    const { visibleFields, pdfsToInclude } = resolveFormVisibility(
      config.steps,
      formData,
      config.pdfs,
    );

    const [{ loadPdfs }, { downloadMergedPdf }] = await Promise.all([
      import("@/pdfs/utils/loadPdfs"),
      import("@/pdfs/utils/downloadMergedPdf"),
    ]);

    const pdfs = await loadPdfs(pdfsToInclude);

    const instructions = config.instructions
      .filter((entry) =>
        typeof entry === "string" ? true : evaluateRule(entry.when, formData),
      )
      .map((entry) => (typeof entry === "string" ? entry : entry.text));

    await downloadMergedPdf({
      title: config.downloadTitle,
      instructions,
      pdfs,
      userData: visibleFields,
    });
  };
}
