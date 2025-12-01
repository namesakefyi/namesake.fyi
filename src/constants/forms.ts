import type { StepConfig } from "@/components/react/forms/FormContainer";
import { courtOrderMaConfig } from "@/pages/forms/court-order-ma/config";
import { socialSecurityConfig } from "@/pages/forms/social-security/config";
import type { FieldName, FormData } from "./fields";
import type { PDFId } from "./pdf";

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
export const FORM_CONFIGS = {
  "court-order-ma": courtOrderMaConfig,
  "social-security": socialSecurityConfig,
} as const;

/**
 * Get a form configuration by slug.
 */
export function getFormConfig(slug: string): FormConfig | undefined {
  return FORM_CONFIGS[slug as FormSlug];
}

/**
 * Type representing all valid form slugs.
 */
export type FormSlug = keyof typeof FORM_CONFIGS;

/**
 * Array of all form slugs.
 */
export const FORM_SLUGS = Object.keys(FORM_CONFIGS) as FormSlug[];
