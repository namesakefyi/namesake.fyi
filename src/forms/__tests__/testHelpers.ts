import type { Field, Step } from "@/forms/types";

export function makeStep(
  id: string,
  fields: (
    | string
    | { id: string; when: (data: any) => boolean }
    | { ids: readonly string[]; when: (data: any) => boolean }
  )[] = [],
  guard?: (data: any) => boolean,
): Step {
  return {
    id,
    title: `Step ${id}`,
    fields: fields as Field[],
    component: () => null,
    ...(guard && { guard }),
  };
}
