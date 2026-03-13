import type { VisibilityRule } from "@/forms/visibilityRules";
import type { Step } from "@/forms/types";

export function makeStep(
  id: string,
  fields: (
    | string
    | { id: string; when: VisibilityRule }
    | { ids: readonly string[]; when: VisibilityRule }
  )[] = [],
  when?: VisibilityRule,
): Step {
  return {
    id,
    title: `Step ${id}`,
    fields: fields as Step["fields"],
    render: () => null,
    ...(when !== undefined && { when }),
  };
}
