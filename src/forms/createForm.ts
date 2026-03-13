import type { Form } from "@/constants/forms";
import { createFormMachine } from "./createFormMachine";

/**
 * Creates a complete Form from the unique per-form properties.
 * Derives `machine` from `slug` and `steps`. Use `getFormFields(config.steps)` for fields.
 *
 * @example
 * export const myForm = createForm({
 *   slug: "my-form",
 *   steps,
 *   pdfs: [...],
 *   downloadTitle: "My Form",
 *   instructions: [],
 * });
 */
export function createForm(input: Omit<Form, "machine">): Form {
  const { slug, steps, ...rest } = input;
  return {
    slug,
    steps,
    machine: createFormMachine({ id: slug, steps }),
    ...rest,
  };
}
