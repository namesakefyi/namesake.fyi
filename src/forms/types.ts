import type { FieldName, FormData } from "@/constants/fields";

/**
 * Configuration for a single step in a form flow.
 *
 * @example
 * const myStep: Step = {
 *   id: "legal-name",
 *   title: "What is your legal name?",
 *   fields: ["firstName", "lastName"],
 *   component: LegalNameStep,
 * };
 */
export interface Step {
  /** Unique identifier used for navigation and persistence. */
  id: string;

  /** Displayed in the navigation bar and review table. */
  title: string;

  /** Optional subtitle shown beneath the title on the step. */
  description?: string;

  /**
   * All fields this step writes to. Used to populate the review table
   * and resolve values for PDF generation.
   */
  fields: readonly FieldName[];

  /**
   * When provided, the step is only included in the flow if this returns
   * true. Evaluated with live form data on every navigation.
   *
   * @example
   * guard: (data) => data.isFilingForSomeoneElse === true,
   */
  guard?: (data: Partial<FormData>) => boolean;

  /**
   * When provided, controls whether individual fields within this step
   * are shown in the UI, the review table, and the generated PDF.
   * Fields not listed in `fields` are always excluded regardless.
   * To access isFieldVisible in the step component, use the useFieldVisible hook.
   *
   * @example
   * isFieldVisible: (field, data) => {
   *   if (field === "middleName") return data.hasMiddleName === true;
   *   return true;
   * },
   */
  isFieldVisible?: (fieldName: FieldName, data: FormData) => boolean;

  /** The React component rendered when this step is active. */
  component: React.ComponentType<{ stepConfig: Step }>;
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
