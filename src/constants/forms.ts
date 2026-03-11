import type { FormMachine } from "@/forms/createFormMachine";
import type { Step } from "@/forms/types";
import { courtOrderMaConfig } from "@/pages/forms/court-order-ma/config";
import { courtOrderMinorMaConfig } from "@/pages/forms/court-order-ma-minor/config";
import { socialSecurityConfig } from "@/pages/forms/social-security/config";
import type { FieldName, FormData } from "./fields";
import type { PDFId } from "./pdf";

/**
 * Type representing all valid form slugs.
 * Update this union whenever a new form is added to FORM_CONFIGS.
 */

/**
 * Configuration for a PDF within a form.
 */
export interface FormPdfConfig {
  /** The PDF identifier */
  pdfId: PDFId;
  /** Optional predicate to determine if this PDF should be included based on form data */
  include?: (data: Partial<FormData>) => boolean;
}

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
  /** Ordered steps, including optional guards for conditional inclusion. */
  steps: readonly Step[];
  /** The XState machine for this form, created from steps. */
  machine: FormMachine;
  /** Flattened array of all field names, derived from steps. */
  fields: readonly FieldName[];
  /** PDFs included in this form */
  pdfs: readonly FormPdfConfig[];
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
  "court-order-ma-minor": courtOrderMinorMaConfig,
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
