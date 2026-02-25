import type { Step } from "@/forms/types";

export function makeStep(
  id: string,
  fields: string[] = [],
  guard?: (data: any) => boolean,
): Step {
  return {
    id,
    title: `Step ${id}`,
    fields: fields as any,
    component: () => null,
    ...(guard && { guard }),
  };
}
