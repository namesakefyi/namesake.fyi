import type { FormConfig } from "@/constants/forms";
import { createFormMachine } from "./createFormMachine";
import { getFieldNames } from "./formVisibility";
import type { Step } from "./types";

/**
 * DSL helper: marks a step for inclusion in a form flow.
 * Acts as an identity function; primarily aids readability and enables
 * type-checking at the point of step definition.
 *
 * @example
 * const steps = [
 *   step({ id: "legal-name", title: "Legal name", fields: [...], component: LegalNameStep }),
 *   step({ id: "address",    title: "Address",    fields: [...], component: AddressStep }),
 * ];
 */
export function step(config: Step): Step {
  return config;
}

/**
 * Extracts and flattens all field names from a steps array.
 */
export function fieldsFromSteps(steps: readonly Step[]) {
  return steps.flatMap((s) => getFieldNames(s.fields));
}

/**
 * Creates a complete FormConfig from the unique per-form properties.
 * Derives `machine` and `fields` from `slug` and `steps`.
 *
 * @example
 * export const myFormConfig = defineFormConfig({
 *   slug: "my-form",
 *   steps,
 *   pdfs: [...],
 *   downloadTitle: "My Form",
 *   instructions: [],
 * });
 */
export function defineFormConfig(
  input: Omit<FormConfig, "machine" | "fields">,
): FormConfig {
  const { slug, steps, ...rest } = input;
  return {
    slug,
    steps,
    machine: createFormMachine({ id: slug, steps }),
    fields: fieldsFromSteps(steps),
    ...rest,
  };
}
