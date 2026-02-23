import type { StepConfig } from "@/components/react/forms/FormContainer";
import { courtOrderMaConfig } from "@/pages/forms/court-order-ma/config";
import { socialSecurityConfig } from "@/pages/forms/social-security/config";
import type { FieldName, FormData } from "./fields";
import type { PDFId } from "./pdf";

/**
 * Type representing all valid form slugs.
 * Update this union whenever a new form is added to FORM_CONFIGS.
 */
export type FormSlug = "court-order-ma" | "social-security";

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
  slug: FormSlug;
  /** Form steps configuration */
  steps: readonly StepConfig[];
  /** Flattened array of all field names from steps */
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
export const FORM_CONFIGS: Record<FormSlug, FormConfig> = {
  "court-order-ma": courtOrderMaConfig,
  "social-security": socialSecurityConfig,
};

/**
 * Get a form configuration by slug.
 */
export function getFormConfig(slug: FormSlug): FormConfig | undefined {
  return FORM_CONFIGS[slug];
}

/**
 * Array of all form slugs.
 */
export const FORM_SLUGS = Object.keys(FORM_CONFIGS) as FormSlug[];

/**
 * Sentiment rating options for form feedback.
 */
export const FORM_FEEDBACK_SENTIMENT = {
  positive: "Positive",
  negative: "Negative",
} as const;

export type FormFeedbackSentiment = keyof typeof FORM_FEEDBACK_SENTIMENT;

/**
 * Returns the URL path for the post-completion feedback page for a given form.
 */
export function getFormDonePath(slug: FormSlug): string {
  return `/forms/${slug}/done`;
}
