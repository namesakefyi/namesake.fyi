import type { FormMachine } from "@/forms/createFormMachine";
import type { PdfEntry } from "@/forms/formVisibility";
import type { Step } from "@/forms/types";
import { courtOrderMaConfig } from "@/pages/forms/court-order-ma/config";
import { socialSecurityConfig } from "@/pages/forms/social-security/config";
import type { FieldName, FormData } from "./fields";

/**
 * Function that generates instructions based on form data.
 */
export type FormInstructionsFn = (data: Partial<FormData>) => string[];

/**
 * Complete configuration for a form.
 */
export interface FormConfig {
  /** Form identifier matching the URL slug */
  slug: string;
  /** Ordered steps, including optional when rules for conditional inclusion. */
  steps: readonly Step[];
  /** The XState machine for this form, created from steps. */
  machine: FormMachine;
  /** Flattened array of all field names, derived from steps. */
  fields: readonly FieldName[];
  /** PDFs included in this form. Shorthand: id = always included. Object: { id, when? } = conditional. */
  pdfs: readonly PdfEntry[];
  /** Title for the downloaded PDF package */
  downloadTitle: string;
  /** Static instructions or function that generates instructions from form data */
  instructions: string[] | FormInstructionsFn;
}

/**
 * Registry of all form configurations.
 */
export const FORM_CONFIGS: Record<string, FormConfig> = {
  "court-order-ma": courtOrderMaConfig,
  "social-security": socialSecurityConfig,
};

/**
 * Get a form configuration by slug.
 */
export function getFormConfig(slug: string): FormConfig | undefined {
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
