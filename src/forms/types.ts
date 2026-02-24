import type { FieldName, FormData } from "@/constants/fields";

export interface Step {
  id: string;
  title: string;
  description?: string;
  fields: readonly FieldName[];
  /** When provided, the step is only shown if this returns true. */
  guard?: (data: Partial<FormData>) => boolean;
  isFieldVisible?: (fieldName: FieldName, data: FormData) => boolean;
  component: React.ComponentType<{
    stepConfig: Step;
  }>;
}

export type FormPhase =
  | "title"
  | "filling"
  | "review"
  | "editing"
  | "submitting"
  | "complete";

export interface FormMachineContext {
  formSlug: string;
  currentStepId: string | null;
  editingStepId: string | null;
}

export type FormMachineEvent =
  | { type: "START" }
  | { type: "GOTO_STEP"; stepId: string }
  | { type: "GOTO_REVIEW" }
  | { type: "GOTO_TITLE" }
  | { type: "EDIT_STEP"; stepId: string }
  | { type: "SAVE_EDIT" }
  | { type: "SUBMIT" }
  | { type: "SUBMIT_DONE" }
  | { type: "SUBMIT_ERROR" };
