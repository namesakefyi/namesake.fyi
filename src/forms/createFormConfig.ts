import type { FormConfig } from "@/constants/forms";
import { createFormMachine } from "./createFormMachine";

/**
 * Creates a complete FormConfig from the unique per-form properties.
 * Derives `machine` from `slug` and `steps`. Use `getFormFields(config.steps)` for fields.
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
  input: Omit<FormConfig, "machine">,
): FormConfig {
  const { slug, steps, ...rest } = input;
  return {
    slug,
    steps,
    machine: createFormMachine({ id: slug, steps }),
    ...rest,
  };
}
