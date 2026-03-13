import type { FieldName, FormData } from "@/constants/fields";

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
 * Evaluates a visibility rule against form data. Returns true if the rule
 * passes or if no rule is provided (undefined = always visible).
 */
export function evaluateRule(
  rule: VisibilityRule | undefined,
  data: Partial<FormData>,
): boolean {
  if (rule === undefined) return true;
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
