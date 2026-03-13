import type { FormMachine } from "@/forms/createFormMachine";
import type { PdfEntry } from "@/forms/formVisibility";
import type { FieldsOf, Step } from "@/forms/types";
import type { VisibilityRule } from "@/forms/visibilityRules";
import { courtOrderMaForm } from "@/pages/forms/court-order-ma/form";
import { socialSecurityForm } from "@/pages/forms/social-security/form";
import type { FieldType } from "./fields";

/** Instruction: string = always include; object with when = conditional. */
export type Instruction = string | { text: string; when?: VisibilityRule };

/**
 * Complete configuration for a form.
 */
export interface Form {
  /** Form identifier matching the URL slug */
  slug: string;
  /** Ordered steps, including optional `when` rules for conditional inclusion. */
  steps: readonly Step[];
  /** The XState machine for this form. */
  machine: FormMachine;
  /** PDFs included in this form. Shorthand: id = always included. Object: { id, when? } = conditional. */
  pdfs: readonly PdfEntry[];
  /** Title for the downloaded PDF package */
  downloadTitle: string;
  /** Instructions for the cover page. String = always include; { text, when? } = conditional. */
  instructions: readonly Instruction[];
}

/** Form data type for a specific form (only fields from its steps). */
export type FormDataOf<F extends Form> = {
  [K in FieldsOf<F["steps"]>]: FieldType<K>;
};

/**
 * Registry of all form configurations.
 */
const FORM_CONFIGS: Record<string, Form> = {
  "court-order-ma": courtOrderMaForm,
  "social-security": socialSecurityForm,
};

/**
 * Get a form configuration by slug.
 */
export function getFormConfig(slug: string): Form | undefined {
  return FORM_CONFIGS[slug];
}

/**
 * Array of all form slugs.
 */
export const FORM_SLUGS = Object.keys(FORM_CONFIGS);

/**
 * Sentiment rating options for form feedback.
 */
export const FORM_FEEDBACK_SENTIMENT = {
  positive: "Positive",
  negative: "Negative",
} as const;

export type FormFeedbackSentiment = keyof typeof FORM_FEEDBACK_SENTIMENT;
