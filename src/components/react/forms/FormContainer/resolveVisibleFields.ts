import type { FormData } from "@/constants/fields";
import type { StepConfig } from "./FormContainer";

/**
 * Resolves which fields should be visible (shown in review and passed to PDF)
 * based on step configurations and form data.
 *
 * This function serves as the single source of truth for determining which
 * fields were actually shown to the user vs. fields that are conditional and
 * were never displayed.
 */
export function resolveVisibleFields(
  steps: readonly StepConfig[],
  formData: FormData,
): Partial<FormData> {
  const visibleFields: Record<string, FormData[keyof FormData]> = {};

  for (const step of steps) {
    for (const fieldName of step.fields) {
      // Check if the field should be visible
      const isVisible = step.isFieldVisible
        ? step.isFieldVisible(fieldName, formData)
        : true;

      if (isVisible) {
        // Add the field to the visible fields object
        visibleFields[fieldName] = formData[fieldName];
      }
    }
  }

  return visibleFields;
}
