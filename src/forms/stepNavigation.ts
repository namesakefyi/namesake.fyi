import type { Step } from "./types";

/**
 * Finds the next step index (forward) that is in visibleStepIds, starting after `fromIndex`.
 * Returns -1 if no eligible step exists (meaning we should advance to review).
 */
export function findNextStepIndex(
  steps: readonly Step[],
  fromIndex: number,
  visibleStepIds: readonly string[],
): number {
  const visibleSet = new Set(visibleStepIds);
  for (let i = fromIndex + 1; i < steps.length; i++) {
    if (visibleSet.has(steps[i].id)) return i;
  }
  return -1;
}

/**
 * Finds the previous step index (backward) that is in visibleStepIds, starting before `fromIndex`.
 * Returns -1 if no eligible step exists (meaning we should go back to title).
 */
export function findPrevStepIndex(
  steps: readonly Step[],
  fromIndex: number,
  visibleStepIds: readonly string[],
): number {
  const visibleSet = new Set(visibleStepIds);
  for (let i = fromIndex - 1; i >= 0; i--) {
    if (visibleSet.has(steps[i].id)) return i;
  }
  return -1;
}
