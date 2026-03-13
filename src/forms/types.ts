import type { FieldName } from "@/constants/fields";
import type { VisibilityRule } from "./formVisibility";

/** A field which is visible when the `when` rule evaluates to true */
type ConditionalField = { name: FieldName; when: VisibilityRule };

/** Multiple fields which are visible when the `when` rule evaluates to true */
type ConditionalFieldGroup = {
  names: readonly FieldName[];
  when: VisibilityRule;
};

/** A field within a step */
export type Field = FieldName | ConditionalField | ConditionalFieldGroup;

/**
 * Configuration for a single step in a form flow.
 *
 * @example
 * const myStep: Step = {
 *   id: "legal-name",
 *   title: "What is your legal name?",
 *   fields: ["firstName", "lastName"],
 *   render: ({ stepConfig }) => ...,
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
   * All fields this step writes to. Shorthand: "fieldName" = always visible.
   * Object form: { name, when } = single conditional field.
   * Object form: { names, when } = multiple fields sharing one when rule.
   */
  fields: readonly Field[];

  /**
   * When provided, the step is only included in the flow if the rule evaluates
   * to true. Evaluated with live form data on every navigation.
   */
  when?: VisibilityRule;

  /** The React component rendered when this step is active. */
  render: React.ComponentType<{ stepConfig: Step }>;
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
