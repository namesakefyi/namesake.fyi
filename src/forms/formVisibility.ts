import type { FieldName, FormData } from "@/constants/fields";
import type { Instruction } from "@/constants/forms";
import type { PDFId } from "@/constants/pdf";
import type { Field, Step } from "./types";
import type { VisibilityRule } from "./visibilityRules";
import { evaluateRule } from "./visibilityRules";

/** Expanded field entry for iteration: id + optional when */
type ExpandedField = { id: FieldName; when?: VisibilityRule };

/** Expands fields to a flat list of { id, when } for iteration. */
function expandFields(fields: readonly Field[]): ExpandedField[] {
  const result: ExpandedField[] = [];
  for (const f of fields) {
    if (typeof f === "string") {
      result.push({ id: f });
    } else if ("id" in f) {
      result.push({ id: f.id, when: f.when });
    } else {
      for (const id of f.ids) {
        result.push({ id, when: f.when });
      }
    }
  }
  return result;
}

/** Extracts all field names from a step's fields array. */
export function getFieldNames(fields: Step["fields"]): FieldName[] {
  return expandFields(fields).map((e) => e.id);
}

/** Extracts all field names from form steps. */
export function getFormFields(steps: readonly Step[]): FieldName[] {
  return steps.flatMap((s) => getFieldNames(s.fields));
}

/** Returns the `when` rule for a field name, or undefined if always visible. */
export function getFieldWhen(
  fields: readonly Field[],
  fieldName: FieldName,
): VisibilityRule | undefined {
  const expanded = expandFields(fields);
  const entry = expanded.find((e) => e.id === fieldName);
  return entry?.when;
}

/** PDF entry: shorthand (id alone) or object with optional `when` rule */
export type PdfEntry = PDFId | { id: PDFId; when?: VisibilityRule };

/** Resolved PDF entry: id alone = include; object with when: false = exclude */
export type ResolvedPdfEntry = PDFId | { id: PDFId; when: false };

/** Extracts id from a pdf entry. */
export function getPdfId(entry: PdfEntry): PDFId {
  return typeof entry === "string" ? entry : entry.id;
}

/** Returns the `when` rule for a pdf entry, or undefined if always included. */
export function getPdfWhen(entry: PdfEntry): VisibilityRule | undefined {
  return typeof entry === "object" ? entry.when : undefined;
}

/** Section of visible fields for the review table, grouped by step. */
export interface VisibilitySection {
  stepId: string;
  fields: readonly FieldName[];
}

/**
 * Resolved visibility for a form: which steps, fields, and PDFs are visible
 * given the current form data.
 */
export interface FormVisibility {
  /** Ordered IDs of steps whose `when` rule passes (or no rule) */
  visibleStepIds: string[];
  /** Field values that were shown (for review table and PDF generation) */
  visibleFields: Partial<FormData>;
  /** Sections for review table: step ID and visible field names, in step order */
  sections: readonly VisibilitySection[];
  /** PDF configs for loadPdfs: id alone = include; { id, when: false } = exclude */
  pdfsToInclude: readonly ResolvedPdfEntry[];
}

/**
 * Resolves all form visibility in one pass: which steps are visible, which
 * fields are visible, and which PDFs to include.
 *
 * This is the single source of truth for visibility. All consumers (navigation,
 * review table, submit handler) should use this function instead of evaluating
 * `when` rules directly.
 *
 * @param steps - Form steps from config
 * @param formData - Current form values
 * @param pdfs - Optional PDF configs from form config
 */
export function resolveFormVisibility(
  steps: readonly Step[],
  formData: Partial<FormData>,
  pdfs: readonly PdfEntry[] = [],
): FormVisibility {
  const visibleStepIds: string[] = [];
  const visibleFields: Partial<FormData> = {};
  const sections: VisibilitySection[] = [];

  for (const step of steps) {
    if (!evaluateRule(step.when, formData)) continue;

    visibleStepIds.push(step.id);

    const visibleFieldNames: FieldName[] = [];
    const expanded = expandFields(step.fields);
    for (const { id: fieldId, when: fieldWhen } of expanded) {
      if (evaluateRule(fieldWhen, formData)) {
        (visibleFields as Record<string, unknown>)[fieldId] = formData[fieldId];
        visibleFieldNames.push(fieldId);
      }
    }
    sections.push({ stepId: step.id, fields: visibleFieldNames });
  }

  const pdfsToInclude = pdfs.map((entry) => {
    const id = getPdfId(entry);
    const include = evaluateRule(getPdfWhen(entry), formData);
    return include ? id : { id, when: false as const };
  });

  return {
    visibleStepIds,
    visibleFields,
    sections,
    pdfsToInclude,
  };
}

/**
 * Resolves instructions for the cover page based on form data.
 * String entries are always included. Object entries with `when` are included
 * only when the rule passes. `when: undefined` means always include.
 *
 * @param instructions - Form instructions (strings or { text, when? })
 * @param formData - Current form values
 * @returns Filtered array of instruction strings
 */
export function resolveInstructions(
  instructions: readonly Instruction[],
  formData: Partial<FormData>,
): string[] {
  return instructions
    .filter((entry) => {
      if (typeof entry === "string") return true;
      // when: false is not a valid VisibilityRule; guard for untyped config
      if ((entry as { when?: unknown }).when === false) return false;
      return evaluateRule(entry.when, formData);
    })
    .map((entry) => (typeof entry === "string" ? entry : entry.text));
}
