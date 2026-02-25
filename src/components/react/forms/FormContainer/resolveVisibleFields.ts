import type { FormData } from "@/constants/fields";
import type { Step } from "@/forms/types";

/**
 * Resolves which fields should be visible (shown in review and passed to PDF)
 * based on step configurations and form data.
 *
 * This function serves as the single source of truth for determining which
 * fields were actually shown to the user vs. fields that are conditional and
 * were never displayed.
 */
export function resolveVisibleFields(
  steps: readonly Step[],
  formData: FormData,
): Partial<FormData> {
  const visibleFields: Record<string, FormData[keyof FormData]> = {};

  for (const step of steps) {
    // If the step has a guard that excludes it, skip all its fields
    if (step.guard && !step.guard(formData)) {
      continue;
    }

    for (const fieldName of step.fields) {
      const isVisible = step.isFieldVisible
        ? step.isFieldVisible(fieldName, formData)
        : true;

      if (isVisible) {
        visibleFields[fieldName] = formData[fieldName];
      }
    }
  }

  return visibleFields;
}
