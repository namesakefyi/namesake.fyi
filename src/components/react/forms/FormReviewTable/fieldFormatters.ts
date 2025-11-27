import { FIELD_DEFS, type FieldName } from "@/constants/fields";

/**
 * Formats a field value for display in the review table based on its type
 * from FIELD_DEFS.
 * @returns The formatted value, or undefined if the field has no response
 */
export function formatFieldValue(
  fieldName: FieldName,
  value: any,
): string | undefined {
  // Handle empty values - return undefined to trigger warning display
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  // Get the field definition to determine the type
  const fieldDef = FIELD_DEFS.find((def) => def.name === fieldName);
  if (!fieldDef) {
    return String(value);
  }

  // Format based on type
  switch (fieldDef.type) {
    case "boolean":
      return value === true ? "Yes" : value === false ? "No" : undefined;

    case "string[]":
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(", ") : undefined;
      }
      return undefined;
    default:
      // Handle special formatting for certain field name patterns

      // Phone number formatting
      if (fieldName === "phoneNumber") {
        return formatPhoneNumber(value);
      }

      // Date formatting
      if (fieldName === "dateOfBirth") {
        return formatDate(value);
      }

      return String(value);
  }
}

/**
 * Formats a phone number for display
 */
function formatPhoneNumber(phone: string): string | undefined {
  if (!phone) return undefined;
  // Phone is already formatted by the mask, just return as-is
  return phone;
}

/**
 * Formats a date for display
 */
function formatDate(date: string): string | undefined {
  if (!date) return undefined;
  // Assuming date is in ISO format or similar, format it nicely
  try {
    const dateObj = new Date(date);
    if (Number.isNaN(dateObj.getTime())) {
      return date; // Return as-is if not a valid date
    }
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

/**
 * Gets the label for a field from FIELD_DEFS
 */
export function getFieldLabel(fieldName: FieldName): string {
  const fieldDef = FIELD_DEFS.find((def) => def.name === fieldName);
  return fieldDef?.label || fieldName;
}
