import type { VisibilityRule } from "@/forms/formVisibility";
import type { Step } from "@/forms/types";

export function makeStep(
  id: string,
  fields: (string | { name: string; when?: VisibilityRule })[] = [],
  when?: VisibilityRule,
): Step {
  return {
    id,
    title: `Step ${id}`,
    fields: fields as Step["fields"],
    component: () => null,
    ...(when !== undefined && { when }),
  };
}
