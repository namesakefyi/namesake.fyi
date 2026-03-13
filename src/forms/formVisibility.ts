import type { FieldName, FormData } from "@/constants/fields";
import type { PDFId } from "@/constants/pdf";
import type { Step } from "./types";

/** Rule: field equals value. Value type must match the field's FormData type. */
type EqualsRule = {
  [K in FieldName]: { field: K; equals: FormData[K] };
}[FieldName];

/** Rule: field does not equal value. */
type NotEqualsRule = {
  [K in FieldName]: { field: K; notEquals: FormData[K] };
}[FieldName];

/** Fields whose value type supports .includes() */
type FieldWithIncludes = {
  [K in FieldName]: FormData[K] extends string | readonly string[] ? K : never;
}[FieldName];

/** Rule: field value (string or array) includes the given string. */
type IncludesRule = { field: FieldWithIncludes; includes: string };

export type VisibilityRule =
  | EqualsRule
  | NotEqualsRule
  | IncludesRule
  | { and: readonly VisibilityRule[] }
  | { or: readonly VisibilityRule[] };

/**
 * Evaluates a visibility rule against form data.
 * - equals: strict equality; missing/undefined field → false
 * - notEquals: strict inequality; missing/undefined field → true
 * - includes: value?.includes(str) === true; non-string/array → false
 * - and: all rules must pass
 * - or: at least one rule must pass
 */
export function evaluateRule(
  rule: VisibilityRule,
  data: Partial<Record<FieldName, unknown>>,
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
  data: Partial<Record<FieldName, unknown>>,
): boolean {
  return !when || evaluateRule(when, data);
}

/** Multiple fields sharing the same when rule. */
export function condAll(
  when: VisibilityRule,
  ...names: FieldName[]
): { name: FieldName; when: VisibilityRule }[] {
  return names.map((name) => ({ name, when }));
}

/** Extracts all field names from a step's fields array. */
export function getFieldNames(fields: Step["fields"]): FieldName[] {
  return fields.map((f) => (typeof f === "string" ? f : f.name));
}

/** Returns the when rule for a field entry, or undefined if always visible. */
export function getFieldWhen(
  field: Step["fields"][number],
): VisibilityRule | undefined {
  return typeof field === "object" ? field.when : undefined;
}

/** PDF entry: shorthand (pdfId alone) or object with optional when */
export type PdfEntry = PDFId | { pdfId: PDFId; when?: VisibilityRule };

/** Extracts pdfId from a pdf entry. */
export function getPdfId(entry: PdfEntry): PDFId {
  return typeof entry === "string" ? entry : entry.pdfId;
}

/** Returns the when rule for a pdf entry, or undefined if always included. */
export function getPdfWhen(entry: PdfEntry): VisibilityRule | undefined {
  return typeof entry === "object" ? entry.when : undefined;
}

/**
 * Resolved visibility for a form: which steps, fields, and PDFs are visible
 * given the current form data.
 */
export interface FormVisibility {
  /** Ordered IDs of steps whose when rule passes (or no rule) */
  visibleStepIds: string[];
  /** Field values that were shown (for review table and PDF generation) */
  visibleFields: Partial<FormData>;
  /** PDF configs with resolved include flags for loadPdfs */
  pdfsToInclude: Array<{ pdfId: PDFId; include: boolean }>;
}

/**
 * Resolves all form visibility in one pass: which steps are visible, which
 * fields are visible, and which PDFs to include.
 *
 * This is the single source of truth for visibility. All consumers (navigation,
 * review table, submit handler) should use this function instead of evaluating
 * when rules directly.
 *
 * @param steps - Form steps from config
 * @param formData - Current form values
 * @param pdfs - Optional PDF configs from form config (omit when PDF visibility not needed)
 */
export function resolveFormVisibility(
  steps: readonly Step[],
  formData: Partial<FormData>,
  pdfs: readonly PdfEntry[] = [],
): FormVisibility {
  const visibleStepIds: string[] = [];
  const visibleFields: Partial<FormData> = {};

  for (const step of steps) {
    if (!isVisibleWhen(step.when, formData)) continue;

    visibleStepIds.push(step.id);

    const fieldNames = getFieldNames(step.fields);
    for (let i = 0; i < fieldNames.length; i++) {
      const fieldName = fieldNames[i] as FieldName;
      const fieldEntry = step.fields[i];
      const fieldWhen = getFieldWhen(fieldEntry);
      if (isVisibleWhen(fieldWhen, formData)) {
        (visibleFields as Record<string, unknown>)[fieldName] =
          formData[fieldName];
      }
    }
  }

  const pdfsToInclude = pdfs.map((entry) => ({
    pdfId: getPdfId(entry),
    include: isVisibleWhen(getPdfWhen(entry), formData),
  }));

  return {
    visibleStepIds,
    visibleFields,
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
