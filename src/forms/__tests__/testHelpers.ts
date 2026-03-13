import type { Form } from "@/constants/forms";
import { createForm } from "@/forms/createForm";
import type { Step } from "@/forms/types";
import type { VisibilityRule } from "@/forms/visibilityRules";

export function makeForm(steps: Step[]): Form {
  return createForm({
    slug: "test-form",
    steps,
    pdfs: [],
    downloadTitle: "Test",
    instructions: [],
  });
}

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
