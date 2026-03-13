import type { FormConfig } from "@/constants/forms";
import { createFormMachine } from "./createFormMachine";
import { getFieldNames } from "./formVisibility";

/**
 * Creates a complete FormConfig from the unique per-form properties.
 * Derives `machine` and `fields` from `slug` and `steps`.
 *
 * @example
 * export const myFormConfig = createFormConfig({
 *   slug: "my-form",
 *   steps,
 *   pdfs: [...],
 *   downloadTitle: "My Form",
 *   instructions: [],
 * });
 */
export function createFormConfig(
  input: Omit<FormConfig, "machine" | "fields">,
): FormConfig {
  const { slug, steps, ...rest } = input;
  return {
    slug,
    steps,
    machine: createFormMachine({ id: slug, steps }),
    fields: steps.flatMap((s) => getFieldNames(s.fields)),
    ...rest,
  };
}
