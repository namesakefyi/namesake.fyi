import { assign, setup } from "xstate";
import type { FormConfig } from "@/constants/forms";
import { getFieldNames } from "./formVisibility";
import type {
  FormMachineContext,
  FormMachineEvent,
  FormPhase,
  Step,
} from "./types";

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
    fields: fieldsFromSteps(steps),
    ...rest,
  };
}

interface CreateFormMachineOptions {
  id: string;
  steps: readonly Step[];
}

export type FormMachine = ReturnType<typeof createFormMachine>;

/**
 * Creates a flat state machine for a multi-step form.
 *
 * Navigation between steps is driven externally: the caller computes the
 * target step using `findNextStepIndex` / `findPrevStepIndex` and dispatches
 * `GOTO_STEP`, `GOTO_REVIEW`, or `GOTO_TITLE`. This keeps guard evaluation
 * (which depends on live form data) outside the machine.
 */
export function createFormMachine({ id, steps }: CreateFormMachineOptions) {
  const firstStepId = steps[0].id;

  return setup({
    types: {
      context: {} as FormMachineContext,
      events: {} as FormMachineEvent,
    },
  }).createMachine({
    id,
    initial: "title",
    context: {
      formSlug: id,
      currentStepId: null,
      editingStepId: null,
    },
    states: {
      title: {
        on: {
          START: {
            target: "filling",
            actions: assign({ currentStepId: firstStepId }),
          },
        },
      },
      filling: {
        on: {
          GOTO_STEP: {
            actions: assign({
              currentStepId: ({ event }) => event.stepId,
            }),
          },
          GOTO_REVIEW: "review",
          GOTO_TITLE: "title",
        },
      },
      review: {
        on: {
          EDIT_STEP: {
            target: "editing",
            actions: assign({
              editingStepId: ({ event }) =>
                event.type === "EDIT_STEP" ? event.stepId : null,
            }),
          },
          SUBMIT: "submitting",
          GOTO_STEP: {
            target: "filling",
            actions: assign({
              currentStepId: ({ event }) => event.stepId,
            }),
          },
        },
      },
      editing: {
        on: {
          SAVE_EDIT: {
            target: "review",
            actions: assign({ editingStepId: null }),
          },
        },
      },
      submitting: {
        on: {
          SUBMIT_DONE: "complete",
          SUBMIT_ERROR: "review",
        },
      },
      complete: {
        type: "final",
      },
    },
  });
}

/**
 * Extracts the top-level phase from a machine state value.
 */
export function getPhase(stateValue: unknown): FormPhase {
  if (typeof stateValue === "string") return stateValue as FormPhase;
  if (typeof stateValue === "object" && stateValue !== null) {
    return Object.keys(stateValue)[0] as FormPhase;
  }
  return "title";
}
