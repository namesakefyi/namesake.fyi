import type { FieldName, FormData } from "@/constants/fields";
import type { PDFId } from "@/constants/pdf";
import type { Field, Step } from "./types";

type EqualsRule = {
  [K in FieldName]: { field: K; equals: FormData[K] };
}[FieldName];

type NotEqualsRule = {
  [K in FieldName]: { field: K; notEquals: FormData[K] };
}[FieldName];

type FieldWithIncludes = {
  [K in FieldName]: FormData[K] extends string | readonly string[] ? K : never;
}[FieldName];

type IncludesRule = { field: FieldWithIncludes; includes: string };

export type VisibilityRule =
  | EqualsRule
  | NotEqualsRule
  | IncludesRule
  | { and: readonly VisibilityRule[] }
  | { or: readonly VisibilityRule[] };

/**
 * Evaluates a `VisibilityRule` against form data.
 */
export function evaluateRule(
  rule: VisibilityRule,
  data: Partial<FormData>,
): boolean {
  if ("and" in rule) {
    return rule.and.every((r) => evaluateRule(r, data));
  }
  if ("or" in rule) {
    return rule.or.some((r) => evaluateRule(r, data));
  }
  if ("equals" in rule) {
    const value = data[rule.field as FieldName];
    return value === rule.equals;
  }
  if ("notEquals" in rule) {
    const value = data[rule.field as FieldName];
    return value !== rule.notEquals;
  }
  if ("includes" in rule) {
    const value = data[rule.field as FieldName];
    if (typeof value === "string") {
      return value.includes(rule.includes);
    }
    if (Array.isArray(value)) {
      return value.includes(rule.includes);
    }
    return false;
  }
  return false;
}

/**
 * Returns true if the field/step/PDF should be visible: no when rule, or rule
 * evaluates to true against the given data.
 */
export function isVisibleWhen(
  when: VisibilityRule | undefined,
  data: Partial<FormData>,
): boolean {
  return !when || evaluateRule(when, data);
}

/** Expanded field entry for iteration: name + optional when */
type ExpandedField = { name: FieldName; when?: VisibilityRule };

/** Expands fields to a flat list of { name, when } for iteration. */
function expandFields(fields: readonly Field[]): ExpandedField[] {
  const result: ExpandedField[] = [];
  for (const f of fields) {
    if (typeof f === "string") {
      result.push({ name: f });
    } else if ("name" in f) {
      result.push({ name: f.name, when: f.when });
    } else {
      for (const name of f.names) {
        result.push({ name, when: f.when });
      }
    }
  }
  return result;
}

/** Extracts all field names from a step's fields array. */
export function getFieldNames(fields: Step["fields"]): FieldName[] {
  return expandFields(fields).map((e) => e.name);
}

/** Returns the `when` rule for a field name, or undefined if always visible. */
export function getFieldWhen(
  fields: readonly Field[],
  fieldName: FieldName,
): VisibilityRule | undefined {
  const expanded = expandFields(fields);
  const entry = expanded.find((e) => e.name === fieldName);
  return entry?.when;
}

/** PDF entry: shorthand (pdfId alone) or object with optional `when` rule */
export type PdfEntry = PDFId | { pdfId: PDFId; when?: VisibilityRule };

/** Extracts pdfId from a pdf entry. */
export function getPdfId(entry: PdfEntry): PDFId {
  return typeof entry === "string" ? entry : entry.pdfId;
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
  /** PDF configs with resolved include flags for loadPdfs */
  pdfsToInclude: Array<{ pdfId: PDFId; include: boolean }>;
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
    if (!isVisibleWhen(step.when, formData)) continue;

    visibleStepIds.push(step.id);

    const visibleFieldNames: FieldName[] = [];
    const expanded = expandFields(step.fields);
    for (const { name: fieldName, when: fieldWhen } of expanded) {
      if (isVisibleWhen(fieldWhen, formData)) {
        (visibleFields as Record<string, unknown>)[fieldName] =
          formData[fieldName];
        visibleFieldNames.push(fieldName);
      }
    }
    sections.push({ stepId: step.id, fields: visibleFieldNames });
  }

  const pdfsToInclude = pdfs.map((entry) => ({
    pdfId: getPdfId(entry),
    include: isVisibleWhen(getPdfWhen(entry), formData),
  }));

  return {
    visibleStepIds,
    visibleFields,
    sections,
    pdfsToInclude,
  };
}

/**
 * Finds the next step index (forward) that is in visibleStepIds, starting after `fromIndex`.
 * Returns -1 if no eligible step exists (meaning we should advance to review).
 */
export function findNextStepIndex(
  steps: readonly Step[],
  fromIndex: number,
  visibleStepIds: readonly string[],
): number {
  const visibleSet = new Set(visibleStepIds);
  for (let i = fromIndex + 1; i < steps.length; i++) {
    if (visibleSet.has(steps[i].id)) return i;
  }
  return -1;
}

/**
 * Finds the previous step index (backward) that is in visibleStepIds, starting before `fromIndex`.
 * Returns -1 if no eligible step exists (meaning we should go back to title).
 */
export function findPrevStepIndex(
  steps: readonly Step[],
  fromIndex: number,
  visibleStepIds: readonly string[],
): number {
  const visibleSet = new Set(visibleStepIds);
  for (let i = fromIndex - 1; i >= 0; i--) {
    if (visibleSet.has(steps[i].id)) return i;
  }
  return -1;
}
