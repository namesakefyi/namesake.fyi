import { assign, setup } from "xstate";
import type { FormData } from "@/constants/fields";
import type { FormConfig } from "@/constants/forms";
import type {
  FormMachineContext,
  FormMachineEvent,
  FormPhase,
  Step,
} from "./types";

/**
 * DSL helper: marks a step for inclusion in a form flow.
 */
export function step(config: Step): Step {
  return config;
}

/**
 * Finds the next step index (forward) whose guard passes, starting after `fromIndex`.
 * Returns -1 if no eligible step exists (meaning we should advance to review).
 */
export function findNextStepIndex(
  steps: readonly Step[],
  fromIndex: number,
  formData: Partial<FormData>,
): number {
  for (let i = fromIndex + 1; i < steps.length; i++) {
    const s = steps[i];
    if (!s.guard || s.guard(formData)) {
      return i;
    }
  }
  return -1;
}

/**
 * Finds the previous step index (backward) whose guard passes, starting before `fromIndex`.
 * Returns -1 if no eligible step exists (meaning we should go back to title).
 */
export function findPrevStepIndex(
  steps: readonly Step[],
  fromIndex: number,
  formData: Partial<FormData>,
): number {
  for (let i = fromIndex - 1; i >= 0; i--) {
    const s = steps[i];
    if (!s.guard || s.guard(formData)) {
      return i;
    }
  }
  return -1;
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

/**
 * Gets the ordered list of visible step IDs given the current form data and steps.
 */
export function getVisibleStepIds(
  steps: readonly Step[],
  formData: Partial<FormData>,
): string[] {
  return steps.filter((s) => !s.guard || s.guard(formData)).map((s) => s.id);
}

/**
 * Extracts and flattens all field names from a steps array.
 */
export function fieldsFromSteps(steps: readonly Step[]) {
  return steps.flatMap((s) => s.fields);
}

/**
 * Creates a complete FormConfig from the unique per-form properties.
 * Derives `machine` and `fields` from `slug` and `steps`.
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
