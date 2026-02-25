import type { FormData } from "@/constants/fields";
import type { Step } from "./types";

/**
 * Finds the next step index (forward) whose guard passes, starting after `fromIndex`.
 * Returns -1 if no eligible step exists (meaning we should advance to review).
 */
export function findNextStepIndex(
  steps: readonly Step[],
  fromIndex: number,
  formData: Partial<FormData>,
): number {
  for (let i = fromIndex + 1; i < steps.length; i++) {
    const s = steps[i];
    if (!s.guard || s.guard(formData)) return i;
  }
  return -1;
}

/**
 * Finds the previous step index (backward) whose guard passes, starting before `fromIndex`.
 * Returns -1 if no eligible step exists (meaning we should go back to title).
 */
export function findPrevStepIndex(
  steps: readonly Step[],
  fromIndex: number,
  formData: Partial<FormData>,
): number {
  for (let i = fromIndex - 1; i >= 0; i--) {
    const s = steps[i];
    if (!s.guard || s.guard(formData)) return i;
  }
  return -1;
}

/**
 * Returns the ordered list of visible step IDs given the current form data.
 * Steps whose guard returns false are excluded.
 */
export function getVisibleStepIds(
  steps: readonly Step[],
  formData: Partial<FormData>,
): string[] {
  return steps.filter((s) => !s.guard || s.guard(formData)).map((s) => s.id);
}
